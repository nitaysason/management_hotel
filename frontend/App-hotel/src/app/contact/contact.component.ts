import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ContactComponent implements OnInit {
  contactMessages: any[] = [];
  contactData = { subject: '', message: '' };  // Initialize with empty strings

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.fetchContactMessages();
  }

  fetchContactMessages() {
    this.authService.getContactMessages().subscribe(
      (data: any[]) => {
        this.contactMessages = data;
      },
      error => {
        console.error('Error fetching contact messages', error);
      }
    );
  }

  sendContactMessage() {
    const client_id = localStorage.getItem('client_id');
    if (client_id) {
      const contactData = {
        client: Number(client_id),  // Ensure client_id is a number
        subject: this.contactData.subject,
        message: this.contactData.message
      };
      this.authService.contactHotel(contactData).subscribe(
        response => {
          console.log('Contact message sent successfully', response);
          alert('Contact message sent successfully');
          this.fetchContactMessages();  // Refresh messages after sending
        },
        error => {
          console.error('Error sending contact message', error);
          alert('Error sending contact message: ' + JSON.stringify(error.error));
        }
      );
    } else {
      console.error('Client ID not found in localStorage');
      alert('Client ID not found. Please log in again.');
    }
  }
}
