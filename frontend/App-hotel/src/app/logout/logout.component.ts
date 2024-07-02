import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logout',
  template: '<button (click)="logout()">Logout</button>',
  standalone: true,
  imports: [CommonModule]
})
export class LogoutComponent {

  constructor(private authService: AuthService, private router: Router) { }

  logout(): void {
    this.authService.logout().subscribe(
      response => {
        console.log(response);
        localStorage.removeItem('access_token');
        this.router.navigate(['/login']);
      },
      error => {
        console.error(error);
      }
    );
  }
}
