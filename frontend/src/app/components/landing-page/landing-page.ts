import { Component, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ProductService, Product } from '../../services/product.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.html',
  styleUrls: ['./landing-page.css'],
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
})
export class LandingPage implements OnInit, AfterViewInit {
  products: Product[] = [];
  featuredProducts: Product[] = [];

  loading = false;
  errorMsg = '';

  constructor(
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadFeatured();
  }

  ngAfterViewInit(): void {}

  loadFeatured(): void {
    this.loading = true;
    this.errorMsg = '';

    this.productService.getAll().subscribe({
      next: (data: Product[]) => {
        this.products = data || [];
        this.featuredProducts = this.products.slice(0, 4); // ✅ first 4
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Failed to load featured products.';
        this.loading = false;
      },
    });
  }

  // ✅ Add to order from landing page
  addToOrder(p: Product): void {
    const userId = Number(localStorage.getItem('user_id'));
    if (!userId) {
      this.errorMsg = 'Please login first.';
      return;
    }

    const payload: any = {
      user_id: userId,
      total_amount: p.price,
      status: 'Pending',
      shipping_address: 'N/A',
    };

    this.orderService.createOrder(payload).subscribe({
      next: (res) => console.log('Order created:', res),
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Failed to add product to order.';
      },
    });
  }
}
