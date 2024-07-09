// logout.component.ts

import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
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
