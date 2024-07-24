import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-manage-attractions',
  templateUrl: './manage-attractions.component.html',
  styleUrls: ['./manage-attractions.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ManageAttractionsComponent implements OnInit {
  attractions: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.fetchAttractions();
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

  createAttraction(attractionData: any) {
    this.authService.manageAttractions(attractionData).subscribe(
      (newAttraction: any) => {
        this.attractions.push({
          id: newAttraction.id,
          name: newAttraction.name,
          description: newAttraction.description,
          price: newAttraction.price
        });
        console.log('Attraction created successfully');
      },
      error => {
        console.error('Error creating attraction', error);
      }
    );
  }

  updateAttraction(attractionId: number, updatedData: any) {
    this.authService.manageAttractions(updatedData, attractionId).subscribe(
      (updatedAttraction: any) => {
        this.attractions = this.attractions.map(attraction =>
          attraction.id === updatedAttraction.id
            ? { ...attraction, ...updatedAttraction }
            : attraction
        );
        console.log('Attraction updated successfully');
      },
      error => {
        console.error('Error updating attraction', error);
      }
    );
  }

  deleteAttraction(attractionId: number) {
    this.authService.deleteAttraction(attractionId).subscribe(
      () => {
        this.attractions = this.attractions.filter(attraction => attraction.id !== attractionId);
        console.log('Attraction deleted successfully');
      },
      error => {
        console.error('Error deleting attraction', error);
      }
    );
  }
}
