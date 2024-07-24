import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-manage-rooms',
  templateUrl: './manage-rooms.component.html',
  styleUrls: ['./manage-rooms.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ManageRoomsComponent implements OnInit {
  rooms: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.fetchRooms();
  }

  fetchRooms() {
    this.authService.fetchRooms().subscribe(
      (data: any[]) => {
        this.rooms = data.map(room => ({
          id: room.id,
          number: room.number,
          room_type: room.room_type,
          description: room.description,
          price_per_night: room.price_per_night,
          is_available: room.is_available
        }));
      },
      error => {
        console.error('Error fetching rooms', error);
      }
    );
  }

  createRoom(roomData: any) {
    this.authService.manageRooms(roomData).subscribe(
      (newRoom: any) => {
        this.rooms.push({
          id: newRoom.id,
          number: newRoom.number,
          room_type: newRoom.room_type,
          description: newRoom.description,
          price_per_night: newRoom.price_per_night,
          is_available: newRoom.is_available
        });
        console.log('Room created successfully');
      },
      error => {
        console.error('Error creating room', error);
      }
    );
  }

  updateRoom(roomId: number, updatedData: any) {
    this.authService.manageRooms(updatedData, roomId).subscribe(
      (updatedRoom: any) => {
        this.rooms = this.rooms.map(room =>
          room.id === updatedRoom.id
            ? { ...room, ...updatedRoom }
            : room
        );
        console.log('Room updated successfully');
      },
      error => {
        console.error('Error updating room', error);
      }
    );
  }

  deleteRoom(roomId: number) {
    this.authService.deleteRoom(roomId).subscribe(
      () => {
        this.rooms = this.rooms.filter(room => room.id !== roomId);
        console.log('Room deleted successfully');
      },
      error => {
        console.error('Error deleting room', error);
      }
    );
  }
}
