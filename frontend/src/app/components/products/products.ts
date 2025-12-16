import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ProductService, Product } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { OrderItemService } from '../../services/order-item.service';

import Swal from 'sweetalert2';

type ProductFilter =
  | 'all'
  | 'Makeup'
  | 'Skincare'
  | 'Body Care'
  | 'Fragrance'
  | 'Hair Care';

@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];

  searchTerm = '';
  activeFilter: ProductFilter = 'all';

  loading = false;
  errorMsg = '';

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private orderItemService: OrderItemService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMsg = '';

    this.productService.getAll().subscribe({
      next: (data: Product[]) => {
        this.products = data ?? [];
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Failed to load products. Check backend + CORS.';
        this.loading = false;
      },
    });
  }

  setFilter(filter: ProductFilter): void {
    this.activeFilter = filter;
    this.applyFilters();
  }

  onSearch(term: string): void {
    this.searchTerm = term ?? '';
    this.applyFilters();
  }

  applyFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();
    const active = this.activeFilter.trim().toLowerCase();

    this.filteredProducts = (this.products ?? []).filter((p: Product) => {
      const name = (p.name ?? '').toLowerCase();
      const desc = (p.description ?? '').toLowerCase();
      const category = (p.category_name ?? '').trim().toLowerCase();

      const matchesSearch = !term || name.includes(term) || desc.includes(term);
      const matchesFilter = active === 'all' || category === active;

      return matchesSearch && matchesFilter;
    });
  }

  addToOrder(p: any): void {
  const userId = Number(localStorage.getItem('user_id'));
  if (!userId) return;

  const productId = Number(p.product_id ?? p.id);
  const price = Number(p.price ?? 0);
  const quantity = 1;
  const subtotal = Number((price * quantity).toFixed(2));

  const orderPayload = {
    user_id: userId,
    status: 'pending',
    shipping_address: 'N/A',
    total_amount: price,
  };

  this.orderService.createOrder(orderPayload as any).subscribe({
    next: (orderRes: any) => {
      const orderId = Number(orderRes?.order_id);
      if (!orderId) return;

      const itemPayload = {
        order_id: orderId,
        product_id: productId,
        quantity,
        price,
        subtotal, // ✅ REQUIRED by your DB
      };

      this.orderItemService.createOrderItem(itemPayload as any).subscribe({
        next: () => Swal.fire('Added!', 'Product was added to your order.', 'success'),
        error: (err) => console.error('order-items error', err),
      });
    },
    error: (err) => console.error('orders error', err),
  });
}

}
