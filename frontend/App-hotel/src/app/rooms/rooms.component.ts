import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class RoomsComponent implements OnInit {
  rooms: any[] = [];
  reservationData: Map<number, any> = new Map();

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.fetchRooms();
  }

  fetchRooms() {
    this.authService.getRooms().subscribe(
      (data: any[]) => {
        this.rooms = data;
        this.rooms.forEach(room => {
          this.reservationData.set(room.id, { check_in_date: '', check_out_date: '' });
        });
      },
      error => {
        console.error('Error fetching rooms', error);
      }
    );
  }

  makeReservation(roomId: number) {
    const client_id = localStorage.getItem('client_id');
    if (client_id) {
      const reservationData = {
        room: roomId,
        client: Number(client_id),  // Ensure client_id is a number
        check_in_date: this.reservationData.get(roomId).check_in_date,
        check_out_date: this.reservationData.get(roomId).check_out_date
      };
      this.authService.makeReservation(reservationData).subscribe(
        response => {
          console.log('Reservation made successfully', response);
          alert('Reservation made successfully');
          this.fetchRooms();  // Refresh room list after making a reservation
        },
        error => {
          console.error('Error making reservation', error);
          alert('Error making reservation: ' + JSON.stringify(error.error));
        }
      );
    } else {
      console.error('Client ID not found in localStorage');
      alert('Client ID not found. Please log in again.');
    }
  }
}
