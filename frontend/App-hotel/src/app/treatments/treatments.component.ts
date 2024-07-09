import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-treatments',
  templateUrl: './treatments.component.html',
  styleUrls: ['./treatments.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TreatmentsComponent implements OnInit {
  treatments: any[] = [];
  selectedTreatmentId: number | null = null;
  clientId: number | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.fetchTreatments();
    this.fetchClientId();
  }

  fetchTreatments() {
    this.authService.getTreatments().subscribe(
      (data: any[]) => {
        this.treatments = data;
      },
      error => {
        console.error('Error fetching treatments', error);
      }
    );
  }

  fetchClientId() {
    const clientIdStr = localStorage.getItem('client_id');
    if (clientIdStr) {
      this.clientId = Number(clientIdStr);
      console.log('Client ID:', this.clientId); // Log client ID to verify
    } else {
      console.error('Client ID not found in localStorage');
      alert('Client ID not found. Please log in again.');
    }
  }

  orderTreatment() {
    if (this.selectedTreatmentId !== null && this.clientId !== null && !isNaN(this.clientId)) {
      const orderData = { client: this.clientId, treatment: this.selectedTreatmentId };
      console.log('Order Data:', orderData); // Log order data to verify
      this.authService.orderTreatment(orderData).subscribe(
        response => {
          console.log('Treatment ordered successfully', response);
          alert('Treatment ordered successfully');
        },
        error => {
          console.error('Error ordering treatment', error);
          alert('Error ordering treatment: ' + JSON.stringify(error.error));
        }
      );
    } else {
      console.error('Invalid client ID or treatment ID');
      alert('Invalid client ID or treatment ID. Please select a treatment and ensure you are logged in.');
    }
  }
  
}
