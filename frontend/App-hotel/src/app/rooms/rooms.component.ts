import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class RoomsComponent implements OnInit {
  rooms: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.fetchRooms();
  }

  fetchRooms() {
    this.authService.getRooms().subscribe(
      (data: any[]) => {
        this.rooms = data;
      },
      error => {
        console.error('Error fetching rooms', error);
      }
    );
  }
}
