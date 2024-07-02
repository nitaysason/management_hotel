import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://127.0.0.1:8000/';

  constructor(private http: HttpClient) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}register/`, userData);
  }

  login(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}login/`, userData);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}logout/`, {});
  }
}
