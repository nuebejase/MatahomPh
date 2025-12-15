// src/app/services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Order {
  id?: number;         // or order_id depending on backend
  user_id: number;
  total_amount: number;
  status: string;
  shipping_address?: string;
  created_at?: string;

  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly API_BASE = 'http://127.0.0.1:5000/auth';

  constructor(private http: HttpClient) {}

  createOrder(payload: Partial<Order>): Observable<Order> {
    return this.http.post<Order>(`${this.API_BASE}/orders`, payload);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.API_BASE}/orders`);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.API_BASE}/orders/${id}`);
  }

  updateOrder(id: number, payload: Partial<Order>): Observable<Order> {
    return this.http.put<Order>(`${this.API_BASE}/orders/${id}`, payload);
  }

  // ✅ helper: get orders for the logged-in user
  getMyOrders(): Observable<Order[]> {
    const userId = Number(localStorage.getItem('user_id'));
    return this.getOrders().pipe(
      map((orders) => (orders || []).filter(o => Number(o.user_id) === userId))
    );
  }
}
