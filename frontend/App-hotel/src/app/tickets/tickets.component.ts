import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

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
    MatButtonModule,
    MatSelectModule
  ]
})
export class TicketsComponent implements OnInit {
  tickets: any[] = [];
  attractions: any[] = [];
  ticketData = { attractionId: '' };

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.fetchTickets();
    this.fetchAttractions(); // Fetch attractions to populate the select dropdown
  }

  fetchTickets() {
    this.authService.viewTickets().subscribe(
      (data: any[]) => {
        this.tickets = data.map(ticket => ({
          id: ticket.id,
          client: ticket.client,
          attractionId: ticket.attraction,
          date: new Date(ticket.created_at).toLocaleDateString(), // Format the date as needed
        }));
        this.loadAttractionDetails(); // Load attraction details for tickets
      },
      error => {
        console.error('Error fetching tickets', error);
      }
    );
  }

  fetchAttractions() {
    this.authService.fetchAttractions().subscribe(
      (data: any[]) => {
        this.attractions = data.map(attraction => ({
          id: attraction.id,
          name: attraction.name,
          description: attraction.description,
          price: attraction.price
        }));
      },
      error => {
        console.error('Error fetching attractions', error);
      }
    );
  }

  loadAttractionDetails() {
    this.tickets.forEach(ticket => {
      const attraction = this.attractions.find(attr => attr.id === ticket.attractionId);
      if (attraction) {
        ticket.attractionName = attraction.name;
        ticket.attractionDescription = attraction.description;
        ticket.attractionPrice = attraction.price;
      }
    });
  }

  bookTicket() {
    const client_id = localStorage.getItem('client_id');
    if (client_id) {
      const ticketData = {
        client: Number(client_id),  // Ensure client_id is a number
        attraction: this.ticketData.attractionId
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
