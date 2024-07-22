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
cancelReservation(arg0: any) {
throw new Error('Method not implemented.');
}
  reservations: any[] = [];
  isStaff: boolean = false;
  editForm: FormGroup;
  editingReservationId: number | null = null;

  constructor(private authService: AuthService, private fb: FormBuilder) {
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
      console.error('Start date or end date is missing');
      return;
    }
  
    const data = {
      ...this.editForm.value,
      check_in_date: this.convertToBackendDate(startDate),
      check_out_date: this.convertToBackendDate(endDate)
    };
  
    console.log('Updating reservation with data:', data);
  
    // Example API call (replace with your actual update method):
    // this.reservationService.updateReservation(id, data).subscribe(response => {
    //   console.log('Reservation updated successfully', response);
    // });

    if (id) {
      this.authService.updateReservation(id, data).subscribe(
        response => {
          console.log('Reservation updated successfully:', response);
          this.fetchReservations();
        },
        error => {
          console.error('Error updating reservation:', error);
        }
      );
    } else {
      console.error('ID is undefined');
    }
  }
  convertToBackendDate(date: Date | string | null): string {
    if (!date) return '';
  
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return ''; // Handle invalid dates
  
    const year = dateObj.getFullYear();
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2); // Months are zero-based
    const day = ('0' + dateObj.getDate()).slice(-2);
  
    return `${year}-${month}-${day}`;
  }
  

  cancelEdit() {
    this.editingReservationId = null;
    this.editForm.reset();
  }
}
