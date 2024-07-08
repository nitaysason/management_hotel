// auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://127.0.0.1:8000/';

  constructor(private http: HttpClient) { }

  // Helper method to retrieve authorization headers with token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Register user
  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}register/`, userData);
  }

  // Login user and store token in localStorage
  login(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}login/`, userData)
      .pipe(
        tap((response: any) => {
          localStorage.setItem('access_token', response.access_token);
        })
      );
  }

  // Logout user and remove token from localStorage
  logout(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}logout/`, {}, { headers })
      .pipe(
        tap(() => {
          localStorage.removeItem('access_token');
        })
      );
  }

  // Example method to fetch orders (adjust as per your backend API)
  getOrders(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}orders/view/`, { headers });
  }
}
