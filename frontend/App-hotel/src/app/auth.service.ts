import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://127.0.0.1:8000/';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  public loggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) { }

  private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

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

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}login/`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('client_id', response.client_id || '');
        localStorage.setItem('staff_id', response.staff_id || '');
        this.loggedIn.next(true);
      })
    );
  }

  logout(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.baseUrl}logout/`, {}, { headers }).pipe(
      tap(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('client_id');
        localStorage.removeItem('staff_id');
        this.loggedIn.next(false);
      }),
      catchError(err => {
        console.error('Error during logout', err);
        return throwError(err);
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

  updateReservation(id: number, data: any): Observable<any> {
    const url = `${this.baseUrl}reservations/update/${id}/`; // Correct URL construction
    const headers = this.getAuthHeaders();
    return this.http.put(url, data, { headers });
  }

  getTreatments(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}treatments/`, { headers });
  }

  orderTreatment(orderData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}orders/treatment/`, orderData, { headers });
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

  getContactMessages(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}contact/messages/`, { headers });
  }

  respondContactMessage(messageId: number, responseData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.baseUrl}contact/messages/respond/${messageId}/`, responseData, { headers });
  }

  deleteContactMessage(messageId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}contact/messages/delete/${messageId}/`, { headers });
  }

  // Staff operations
  getClients(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}clients/`, { headers });
  }

  manageOrders(orderData?: any, orderId?: number): Observable<any> {
    const headers = this.getAuthHeaders();
    let url = `${this.baseUrl}orders/manage/`;
  
    if (orderId) {
      url += `${orderId}/`;
    }
  
    if (orderData) {
      if (orderId) {
        // PUT request to update an existing order
        return this.http.put(url, orderData, { headers });
      } else {
        // POST request to create a new order
        return this.http.post(url, orderData, { headers });
      }
    } else if (orderId) {
      // DELETE request to delete an existing order
      return this.http.delete(url, { headers });
    } else {
      // GET request to fetch orders (either all or by ID)
      return this.http.get(url, { headers });
    }
  }
  
  deleteOrder(orderId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}orders/manage/${orderId}/`, { headers });
  }

  manageTickets(ticketData?: any, ticketId?: number): Observable<any> {
    const headers = this.getAuthHeaders();
    
    if (ticketId) {
      // For PUT request (update ticket)
      return this.http.put(`${this.baseUrl}tickets/manage/${ticketId}/`, ticketData, { headers });
    }
    // For POST request (create ticket)
    return this.http.post(`${this.baseUrl}tickets/manage/`, ticketData, { headers });
  }
  
  fetchTickets(ticketId?: number): Observable<any> {
    const headers = this.getAuthHeaders();
    
    if (ticketId) {
      // For GET request for a single ticket
      return this.http.get(`${this.baseUrl}tickets/manage/${ticketId}/`, { headers });
    } else {
      // For GET request for all tickets
      return this.http.get(`${this.baseUrl}tickets/manage/`, { headers });
    }
  }

  deleteTicket(ticketId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}tickets/manage/${ticketId}/`, { headers });
  }

  manageTreatments(treatmentData?: any, treatmentId?: number): Observable<any> {
    const headers = this.getAuthHeaders();
    
    if (treatmentId) {
      // If treatmentId is provided, check the request method
      if (treatmentData) {
        // For PUT request (update treatment)
        return this.http.put(`${this.baseUrl}treatments/manage/${treatmentId}/`, treatmentData, { headers });
      } else {
        // For DELETE request (delete treatment)
        return this.http.delete(`${this.baseUrl}treatments/manage/${treatmentId}/`, { headers });
      }
    } else {
      // For POST request (create treatment)
      return this.http.post(`${this.baseUrl}treatments/manage/`, treatmentData, { headers });
    }
  }
  
  fetchTreatments(treatmentId?: number): Observable<any> {
    const headers = this.getAuthHeaders();
    
    if (treatmentId) {
      // For GET request for a single treatment
      return this.http.get(`${this.baseUrl}treatments/manage/${treatmentId}/`, { headers });
    } else {
      // For GET request for all treatments
      return this.http.get(`${this.baseUrl}treatments/manage/`, { headers });
    }
  }

  deleteTreatment(treatmentId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}treatments/manage/${treatmentId}/`, { headers });
  }
  
  // Rooms management methods
  fetchRooms(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}rooms/`, { headers });
  }
  
  manageRooms(roomData: any, roomId?: number): Observable<any> {
    const headers = this.getAuthHeaders();
    
    if (roomId) {
      // For PUT request (update room)
      return this.http.put<any>(`${this.baseUrl}rooms/${roomId}/`, roomData, { headers });
    } else {
      // For POST request (create room)
      return this.http.post<any>(`${this.baseUrl}rooms/`, roomData, { headers });
    }
  }
  
  deleteRoom(roomId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.baseUrl}rooms/${roomId}/`, { headers });
  }
  fetchAttractions(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}attractions/manage/`, { headers }).pipe(
      catchError(err => {
        console.error('Error fetching attractions', err);
        return throwError(err);
      })
    );
  }

  manageAttractions(attractionData: any, attractionId?: number): Observable<any> {
    const headers = this.getAuthHeaders();

    if (attractionId) {
      console.log(`Updating attraction with ID ${attractionId}`);
      console.log(`Data:`, attractionData);
      return this.http.put<any>(`${this.baseUrl}attractions/manage/${attractionId}/`, attractionData, { headers }).pipe(
        catchError(err => {
          console.error('Error managing attraction', err);
          return throwError(err);
        })
      );
    } else {
      console.log(`Creating new attraction`);
      console.log(`Data:`, attractionData);
      return this.http.post<any>(`${this.baseUrl}attractions/manage/`, attractionData, { headers }).pipe(
        catchError(err => {
          console.error('Error managing attraction', err);
          return throwError(err);
        })
      );
    }
  }

  deleteAttraction(attractionId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.baseUrl}attractions/manage/${attractionId}/`, { headers }).pipe(
      catchError(err => {
        console.error('Error deleting attraction', err);
        return throwError(err);
      })
    );
  }

  
  
}

  


