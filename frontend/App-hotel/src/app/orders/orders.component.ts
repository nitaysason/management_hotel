import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule if needed
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  standalone: true,
  imports: [CommonModule]  // Ensure CommonModule is imported here
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.authService.getOrders().subscribe(
      (data: any[]) => {
        this.orders = data;
      },
      error => {
        console.error('Error fetching orders', error);
      }
    );
  }

  stringifyOrder(order: any): string {
    return JSON.stringify(order, null, 2); // Use JSON.stringify to format JSON with 2 spaces
  }
}
