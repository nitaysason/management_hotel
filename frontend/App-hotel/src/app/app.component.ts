import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule if necessary
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule, // Include CommonModule if used
    MatToolbarModule,
    MatButtonModule,
    RouterModule
  ]
})
export class AppComponent {}