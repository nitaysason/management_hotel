import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-manage-tickets',
  templateUrl: './manage-tickets.component.html',
  styleUrls: ['./manage-tickets.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ManageTicketsComponent implements OnInit {
  tickets: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.fetchTickets();
  }

  fetchTickets() {
    this.authService.fetchTickets().subscribe(
      (data: any[]) => {
        this.tickets = data.map(ticket => ({
          id: ticket.id,
          createdAt: ticket.created_at,
          client: ticket.client,
          attraction: ticket.attraction
        }));
      },
      error => {
        console.error('Error fetching tickets', error);
      }
    );
  }

  createTicket(ticketData: any) {
    this.authService.manageTickets(ticketData).subscribe(
      (newTicket: any) => {
        this.tickets.push({
          id: newTicket.id,
          createdAt: newTicket.created_at,
          client: newTicket.client,
          attraction: newTicket.attraction
        });
        console.log('Ticket created successfully');
      },
      error => {
        console.error('Error creating ticket', error);
      }
    );
  }

  updateTicket(ticketId: number, updatedData: any) {
    this.authService.manageTickets(updatedData, ticketId).subscribe(
      (updatedTicket: any) => {
        this.tickets = this.tickets.map(ticket =>
          ticket.id === updatedTicket.id
            ? { ...ticket, ...updatedTicket }
            : ticket
        );
        console.log('Ticket updated successfully');
      },
      error => {
        console.error('Error updating ticket', error);
      }
    );
  }

  deleteTicket(ticketId: number) {
    this.authService.deleteTicket(ticketId).subscribe(
      () => {
        this.tickets = this.tickets.filter(ticket => ticket.id !== ticketId);
        console.log('Ticket deleted successfully');
      },
      error => {
        console.error('Error deleting ticket', error);
      }
    );
  }
}
