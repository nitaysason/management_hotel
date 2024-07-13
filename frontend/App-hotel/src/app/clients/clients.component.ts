import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ]
})
export class ClientsComponent implements OnInit {
  clients: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchClients();
  }

  fetchClients(): void {
    this.authService.getClients().subscribe(
      (data: any[]) => {
        this.clients = data;
      },
      error => {
        console.error('Error fetching clients', error);
      }
    );
  }
}
