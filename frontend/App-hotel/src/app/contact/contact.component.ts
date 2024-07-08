import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ContactComponent implements OnInit {
  contactMessages: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.fetchContactMessages();
  }

  fetchContactMessages() {
    const contactData = {}; // Provide appropriate contact data here if needed
    this.authService.contactHotel(contactData).subscribe(
      (data: any[]) => {
        this.contactMessages = data;
      },
      error => {
        console.error('Error fetching contact messages', error);
      }
    );
  }
  
}
