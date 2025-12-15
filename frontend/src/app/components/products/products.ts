import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../services/product.service';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';

type ProductFilter = 'all' | 'Makeup' | 'Skincare' | 'Body Care' | 'Fragrance' | 'Hair Care';

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

  searchTerm: string = '';
  activeFilter: ProductFilter = 'all';

  loading: boolean = false;
  errorMsg: string = '';

  constructor(
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMsg = '';

    this.productService.getAll().subscribe({
      next: (data: Product[]) => {
        this.products = data || [];
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

    this.filteredProducts = this.products.filter((p: Product) => {
      const name = (p.name ?? '').toLowerCase();
      const desc = (p.description ?? '').toLowerCase();
      const category = (p.category_name ?? '').trim().toLowerCase();

      const matchesSearch = !term || name.includes(term) || desc.includes(term);
      const matchesFilter = active === 'all' || category === active;

      return matchesSearch && matchesFilter;
    });
  }

  // ✅ ADD TO ORDER (POST /orders)
  addToOrder(p: Product): void {
  this.errorMsg = '';

  const userId = Number(localStorage.getItem('user_id'));
if (!userId) {
  this.errorMsg = 'Please login first.';
  return;
}

const payload = {
  user_id: userId,
  total_amount: p.price,
  status: 'Pending',
  shipping_address: 'N/A'
};


  this.orderService.createOrder(payload).subscribe({
    next: (res) => console.log('Order created:', res),
    error: (err) => {
      console.error(err);
      this.errorMsg = 'Failed to add order.';
    }
  });
}

}
