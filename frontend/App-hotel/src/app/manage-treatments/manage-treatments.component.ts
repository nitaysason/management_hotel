import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-manage-treatments',
  templateUrl: './manage-treatments.component.html',
  styleUrls: ['./manage-treatments.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ManageTreatmentsComponent implements OnInit {
  treatments: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.fetchTreatments();
  }

  fetchTreatments() {
    this.authService.fetchTreatments().subscribe(
      (data: any[]) => {
        this.treatments = data.map(treatment => ({
          id: treatment.id,
          name: treatment.name,
          description: treatment.description,
          price: treatment.price
        }));
      },
      error => {
        console.error('Error fetching treatments', error);
      }
    );
  }

  createTreatment(treatmentData: any) {
    this.authService.manageTreatments(treatmentData).subscribe(
      (newTreatment: any) => {
        this.treatments.push({
          id: newTreatment.id,
          name: newTreatment.name,
          description: newTreatment.description,
          price: newTreatment.price
        });
        console.log('Treatment created successfully');
      },
      error => {
        console.error('Error creating treatment', error);
      }
    );
  }

  updateTreatment(treatmentId: number, updatedData: any) {
    this.authService.manageTreatments(updatedData, treatmentId).subscribe(
      (updatedTreatment: any) => {
        this.treatments = this.treatments.map(treatment =>
          treatment.id === updatedTreatment.id
            ? { ...treatment, ...updatedTreatment }
            : treatment
        );
        console.log('Treatment updated successfully');
      },
      error => {
        console.error('Error updating treatment', error);
      }
    );
  }

  deleteTreatment(treatmentId: number) {
    this.authService.deleteTreatment(treatmentId).subscribe(
      () => {
        this.treatments = this.treatments.filter(treatment => treatment.id !== treatmentId);
        console.log('Treatment deleted successfully');
      },
      error => {
        console.error('Error deleting treatment', error);
      }
    );
  }
}
