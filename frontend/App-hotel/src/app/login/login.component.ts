// login.component.ts

import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginError: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    const userData = { username: this.username, password: this.password };
    this.authService.login(userData).subscribe(
      (response: any) => {
        console.log('Login successful:', response);
        localStorage.setItem('access_token', response.access); // Assuming token is returned in 'access' property
        this.router.navigate(['/reservations']); // Redirect to reservations page upon successful login
      },
      error => {
        console.error('Login error:', error);
        this.loginError = 'Invalid username or password'; // Display login error message
      }
    );
  }
}
