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
  contactData = { subject: '', message: '' };
  isStaff: boolean = false;
  responseData = { response: '' };

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.checkUserRole();
    this.fetchContactMessages();
  }

  checkUserRole() {
    const staffId = localStorage.getItem('staff_id');
    this.isStaff = !!staffId;
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

  respondToMessage(messageId: number) {
    this.authService.respondContactMessage(messageId, this.responseData).subscribe(
      response => {
        console.log('Response sent successfully', response);
        this.fetchContactMessages();
      },
      error => {
        console.error('Error sending response', error);
      }
    );
  }

  deleteMessage(messageId: number) {
    this.authService.deleteContactMessage(messageId).subscribe(
      response => {
        console.log('Message deleted successfully');
        this.fetchContactMessages();
      },
      error => {
        console.error('Error deleting message', error);
      }
    );
  }
}