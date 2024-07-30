// // src/app/order.service.ts
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class OrderService {

//   private baseUrl = 'http://127.0.0.1:8000/';

//   constructor(private http: HttpClient) { }

//   getOrders(): Observable<any[]> {
//     const token = localStorage.getItem('access_token');
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
//     return this.http.get<any[]>(`${this.baseUrl}orders/view/`, { headers });
//   }
// }
