import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ReservationsComponent implements OnInit {
  reservations: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.fetchReservations();
  }

  fetchReservations() {
    this.authService.viewReservations().subscribe(
      (data: any[]) => {
        this.reservations = data.map(reservation => ({
          id: reservation.id,
          room: reservation.room,
          client: reservation.client,
          start_date: new Date(reservation.check_in_date).toLocaleDateString(), // Format check-in date
          end_date: new Date(reservation.check_out_date).toLocaleDateString(), // Format check-out date
        }));
      },
      error => {
        console.error('Error fetching reservations', error);
      }
    );
  }

  cancelReservation(reservationId: number) {
    this.authService.cancelReservation(reservationId).subscribe(
      () => {
        this.reservations = this.reservations.filter(reservation => reservation.id !== reservationId);
        console.log('Reservation canceled successfully');
      },
      error => {
        console.error('Error canceling reservation', error);
      }
    );
  }
}
