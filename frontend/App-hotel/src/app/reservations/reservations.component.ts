import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ReservationsComponent implements OnInit {
  reservations: any[] = [];
  isStaff: boolean = false;
  editForm: FormGroup;
  editingReservationId: number | null = null;
  today: string;

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    this.editForm = this.fb.group({
      id: [''],
      room: [''],
      client: [''],
      start_date: [''],
      end_date: ['']
    });
  }

  ngOnInit() {
    this.checkUserRole();
    this.fetchReservations();
  }

  checkUserRole() {
    const staffId = localStorage.getItem('staff_id');
    this.isStaff = !!staffId;
  }

  fetchReservations() {
    this.authService.viewReservations().subscribe(
      (data: any[]) => {
        this.reservations = data.map(reservation => ({
          id: reservation.id,
          room: reservation.room,
          client: reservation.client,
          start_date: this.formatDate(reservation.check_in_date), // Convert to yyyy-MM-dd
          end_date: this.formatDate(reservation.check_out_date),  // Convert to yyyy-MM-dd
        }));
      },
      error => {
        console.error('Error fetching reservations', error);
      }
    );
  }

  formatDate(dateString: string): string {
    const [day, month, year] = dateString.split('-').map(Number);
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  editReservation(reservation: any) {
    this.editingReservationId = reservation.id;
    this.editForm.patchValue({
      id: reservation.id,
      room: reservation.room,
      client: reservation.client,
      start_date: reservation.check_in_date, // Already in yyyy-MM-dd format
      end_date: reservation.check_out_date   // Already in yyyy-MM-dd format
    });
  }
  
  updateReservation() {
    const id = this.editForm.get('id')?.value;
    const startDate = this.editForm.get('start_date')?.value;
    const endDate = this.editForm.get('end_date')?.value;
  
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }
  
    if (new Date(startDate) < new Date(this.today)) {
      alert('Start date cannot be in the past.');
      return;
    }
  
    if (new Date(endDate) <= new Date(startDate)) {
      alert('End date must be after start date.');
      return;
    }
  
    const data = {
      ...this.editForm.value,
      check_in_date: startDate,
      check_out_date: endDate
    };
  
    if (id) {
      this.authService.updateReservation(id, data).subscribe(
        response => {
          console.log('Reservation updated successfully:', response);
          this.fetchReservations();
          this.editingReservationId = null;
          this.editForm.reset();
        },
        error => {
          console.error('Error updating reservation:', error);
          alert('Error updating reservation: ' + JSON.stringify(error.error));
        }
      );
    } else {
      console.error('ID is undefined');
      alert('ID is undefined. Please try again.');
    }
  }

  cancelEdit() {
    this.editingReservationId = null;
    this.editForm.reset();
  }

  cancelReservation(reservationId: number) {
    if (confirm('Are you sure you want to cancel this reservation?')) {
      this.authService.cancelReservation(reservationId).subscribe(
        response => {
          console.log('Reservation cancelled successfully:', response);
          this.fetchReservations();
        },
        error => {
          console.error('Error cancelling reservation:', error);
          alert('Error cancelling reservation: ' + JSON.stringify(error.error));
        }
      );
    }
  }
}
