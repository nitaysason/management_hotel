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

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}register/`, userData);
  }

  login(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}login/`, userData)
      .pipe(
        tap((response: any) => {
          localStorage.setItem('access_token', response.access_token);
        })
      );
  }

  logout(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}logout/`, {}, { headers })
      .pipe(
        tap(() => {
          localStorage.removeItem('access_token');
        })
      );
  }

  getOrders(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}orders/view/`, { headers });
  }

  getRooms(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}rooms/`, { headers });
  }



  getRoomDetails(roomId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}rooms/${roomId}/`, { headers });
  }

  makeReservation(reservationData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}reservations/make/`, reservationData, { headers });
  }

  viewReservations(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}reservations/view/`, { headers });
  }

  cancelReservation(reservationId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}reservations/cancel/${reservationId}/`, { headers });
  }

  getTreatments(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}treatments/`, { headers });
  }

  orderTreatment(treatmentData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}orders/treatment/`, treatmentData, { headers });
  }

  bookTicket(ticketData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}tickets/book/`, ticketData, { headers });
  }

  viewTickets(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}tickets/view/`, { headers });
  }

  contactHotel(contactData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}contact/`, contactData, { headers });
  }
  
}
