import { Component, OnInit } from '@angular/core';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

import { OrderService, Order } from '../../services/order.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
  imports: [NgFor, NgIf, FormsModule, RouterModule, DecimalPipe],
})
export class CartComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  errorMsg = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadMyOrders();
  }

  loadMyOrders(): void {
    const userId = Number(localStorage.getItem('user_id'));
    if (!userId) {
      this.errorMsg = 'Please login first.';
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    // If you don't have getMyOrders(), use getOrders() then filter
    this.orderService.getOrders().subscribe({
      next: (data) => {
        const all = data || [];
        this.orders = all.filter(o => Number(o.user_id) === userId);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Failed to load cart.';
        this.loading = false;
      },
    });
  }

  get subtotal(): number {
    return (this.orders || []).reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  }

  checkout(): void {
    if (!this.orders.length) {
      Swal.fire('Empty cart', 'Add items first.', 'info');
      return;
    }
    Swal.fire('Checkout', 'Proceeding to checkout (demo).', 'success');
  }
}
