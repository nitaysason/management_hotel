import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class TicketsComponent implements OnInit {
  tickets: any[] = [];

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
}
