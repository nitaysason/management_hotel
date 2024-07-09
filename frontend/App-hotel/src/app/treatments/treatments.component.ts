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

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.fetchTreatments();
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

  orderTreatment() {
    if (this.selectedTreatmentId !== null) {
      const orderData = { treatment_id: this.selectedTreatmentId };
      this.authService.orderTreatment(orderData).subscribe(
        response => {
          console.log('Treatment ordered successfully', response);
          alert('Treatment ordered successfully');
        },
        error => {
          console.error('Error ordering treatment', error);
          alert('Error ordering treatment');
        }
      );
    } else {
      alert('Please select a treatment before ordering');
    }
  }
}
