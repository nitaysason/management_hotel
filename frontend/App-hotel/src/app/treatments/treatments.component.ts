import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-treatments',
  templateUrl: './treatments.component.html',
  styleUrls: ['./treatments.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class TreatmentsComponent implements OnInit {
  treatments: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.fetchTreatments();
  }

  fetchTreatments() {
    const treatmentData = {}; // Provide appropriate treatment data here if needed
    this.authService.orderTreatment(treatmentData).subscribe(
      (data: any[]) => {
        this.treatments = data;
      },
      error => {
        console.error('Error fetching treatments', error);
      }
    );
  }
  
}
