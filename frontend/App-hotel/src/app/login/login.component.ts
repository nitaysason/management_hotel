import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  login(): void {
    const userData = { username: this.username, password: this.password };
    this.authService.login(userData).subscribe(
      response => {
        console.log(response);
        localStorage.setItem('access_token', response.access);
        this.router.navigate(['/']);
      },
      error => {
        console.error(error);
      }
    );
  }
}
