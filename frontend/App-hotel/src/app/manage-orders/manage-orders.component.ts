import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ManageOrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.authService.manageOrders().subscribe(
      (data: any[]) => {
        this.orders = data.map(order => ({
          id: order.id,
          client: order.client,
          // Adjusted fields based on the provided JSON structure
          treatment: order.treatment, // Assuming treatment represents the room
          date: new Date(order.created_at).toLocaleDateString(), // Correct date field
        }));
      },
      error => {
        console.error('Error fetching orders', error);
      }
    );
  }

  deleteOrder(orderId: number) {
    this.authService.manageOrders(null, orderId).subscribe(
      () => {
        this.orders = this.orders.filter(order => order.id !== orderId);
        console.log('Order deleted successfully');
      },
      error => {
        console.error('Error deleting order', error);
      }
    );
  }
  
  createOrder(orderData: any) {
    this.authService.manageOrders(orderData).subscribe(
      (newOrder: any) => {
        this.orders.push({
          id: newOrder.id,
          client: newOrder.client,
          treatment: newOrder.treatment,
          date: new Date(newOrder.created_at).toLocaleDateString(), // Correct date field
        });
        console.log('Order created successfully');
      },
      error => {
        console.error('Error creating order', error);
      }
    );
  }

  updateOrder(orderId: number, updatedData: any) {
    this.authService.manageOrders(updatedData, orderId).subscribe(
      (updatedOrder: any) => {
        this.orders = this.orders.map(order =>
          order.id === updatedOrder.id
            ? { ...order, ...updatedOrder, date: new Date(updatedOrder.created_at).toLocaleDateString() }
            : order
        );
        console.log('Order updated successfully');
      },
      error => {
        console.error('Error updating order', error);
      }
    );
  }
}
