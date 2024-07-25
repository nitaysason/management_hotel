import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router'; // Import Router
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    RouterModule
  ]
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;
  isStaff: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.loggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      this.isStaff = !!localStorage.getItem('staff_id');
    });
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']); // Navigate to login page after logout
    });
  }
}
