import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class TicketsComponent implements OnInit {
  tickets: any[] = [];
  ticketData = { attraction: '' };

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.fetchTickets();
  }

  fetchTickets() {
    this.authService.viewTickets().subscribe(
      (data: any[]) => {
        this.tickets = data.map(ticket => ({
          id: ticket.id,
          client: ticket.client,
          attraction: ticket.attraction,
          date: new Date(ticket.created_at).toLocaleDateString(), // Format the date as needed
        }));
      },
      error => {
        console.error('Error fetching tickets', error);
      }
    );
  }

  bookTicket() {
    const client_id = localStorage.getItem('client_id');
    if (client_id) {
      const ticketData = {
        client: Number(client_id),  // Ensure client_id is a number
        attraction: this.ticketData.attraction
      };
      this.authService.bookTicket(ticketData).subscribe(
        response => {
          console.log('Ticket booked successfully', response);
          alert('Ticket booked successfully');
          this.fetchTickets();  // Refresh tickets list after booking
        },
        error => {
          console.error('Error booking ticket', error);
          alert('Error booking ticket: ' + JSON.stringify(error.error));
        }
      );
    } else {
      console.error('Client ID not found in localStorage');
      alert('Client ID not found. Please log in again.');
    }
  }
}
