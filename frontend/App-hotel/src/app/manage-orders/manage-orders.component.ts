import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css']
})
export class ManageOrdersComponent implements OnInit {
  orders: any[] = [];
  newOrder: any = {};

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
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

  addOrder() {
    this.authService.manageOrders(this.newOrder).subscribe(
      response => {
        console.log('Order added successfully', response);
        this.fetchOrders(); // Refresh orders list after adding
        this.newOrder = {}; // Clear new order data
      },
      error => {
        console.error('Error adding order', error);
      }
    );
  }

  updateOrder(orderId: number) {
    this.authService.manageOrders(this.newOrder, orderId).subscribe(
      response => {
        console.log('Order updated successfully', response);
        this.fetchOrders(); // Refresh orders list after updating
        this.newOrder = {}; // Clear new order data
      },
      error => {
        console.error('Error updating order', error);
      }
    );
  }

  deleteOrder(orderId: number) {
    this.authService.deleteOrder(orderId).subscribe(
      response => {
        console.log('Order deleted successfully', response);
        this.fetchOrders(); // Refresh orders list after deleting
      },
      error => {
        console.error('Error deleting order', error);
      }
    );
  }
}
