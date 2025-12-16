import { Component, OnInit } from '@angular/core';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

import { OrderService, Order, OrderItem } from '../../services/order.service';
import { OrderItemService } from '../../services/order-item.service';

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

  constructor(
    private orderService: OrderService,
    private orderItemService: OrderItemService
  ) {}

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

    this.orderService.getMyOrders().subscribe({
      next: (data: Order[]) => {
        const all = data ?? [];
        // ✅ show only orders with items
        this.orders = all.filter((o) => (o.items ?? []).length > 0);
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.errorMsg = 'Failed to load cart.';
        this.loading = false;
      },
    });
  }

  get subtotal(): number {
    return (this.orders ?? []).reduce((sum, o) => {
      const items = o.items ?? [];
      const itemsTotal = items.reduce((s, it) => s + Number(it.subtotal ?? 0), 0);
      return sum + itemsTotal;
    }, 0);
  }

  // ✅ Checkout = delete all order items then clear UI
  checkout(): void {
    if (!this.orders.length) {
      Swal.fire('Empty cart', 'Add items first.', 'info');
      return;
    }

    Swal.fire({
      title: 'Proceed to checkout?',
      text: 'This will finalize your order and clear your cart.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, checkout',
    }).then(async (res) => {
      if (!res.isConfirmed) return;

      // collect all item IDs from all orders
      const itemIds: number[] = [];
      for (const o of this.orders) {
        for (const it of (o.items ?? [])) {
          const id = Number((it as any).order_items_id);
          if (id) itemIds.push(id);
        }
      }

      if (!itemIds.length) {
        Swal.fire('Nothing to checkout', 'No items found in cart.', 'info');
        return;
      }

      Swal.fire({
        title: 'Checking out...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      try {
        // ✅ delete all items (parallel)
        await Promise.all(
          itemIds.map((id) => this.orderItemService.deleteOrderItem(id).toPromise())
        );

        // clear UI + reload from backend
        this.orders = [];
        await this.loadMyOrders();

        Swal.fire('Success', 'Checkout complete! Cart cleared.', 'success');
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Checkout failed while clearing items.', 'error');
      }
    });
  }

  removeItem(orderIndex: number, item: OrderItem): void {
    const itemId = Number(item?.order_items_id);
    if (!itemId) {
      Swal.fire('Error', 'Missing order item id.', 'error');
      return;
    }

    Swal.fire({
      title: 'Remove item?',
      text: 'This will remove the product from your cart.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Remove',
    }).then((r) => {
      if (!r.isConfirmed) return;

      this.orderItemService.deleteOrderItem(itemId).subscribe({
        next: () => {
          Swal.fire('Removed', 'Product removed from cart.', 'success');
          this.loadMyOrders();
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire('Error', 'Failed to remove item.', 'error');
        },
      });
    });
  }
}
