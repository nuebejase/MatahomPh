import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface OrderItem {
  order_items_id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  subtotal: number;
  created_at?: string;

  // from your OrderItem.to_dict()
  product_name?: string | null;
  image_url?: string | null;
}

export interface Order {
  order_id: number;          // ✅ matches DB
  user_id: number;
  total_amount: number;      // ✅ matches DB
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address?: string | null;
  created_at?: string;

  items?: OrderItem[];       // ✅ from Order.to_dict()
}

export type CreateOrderPayload = {
  user_id: number;
  total_amount: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: string;
};

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly API_BASE = 'http://127.0.0.1:5000/auth';

  constructor(private http: HttpClient) {}

  createOrder(payload: CreateOrderPayload): Observable<Order> {
    return this.http.post<Order>(`${this.API_BASE}/orders`, payload);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.API_BASE}/orders`);
  }

  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.API_BASE}/orders/${orderId}`);
  }

  updateOrder(orderId: number, payload: Partial<Order>): Observable<Order> {
    return this.http.put<Order>(`${this.API_BASE}/orders/${orderId}`, payload);
  }

  getMyOrders(): Observable<Order[]> {
    const userId = Number(localStorage.getItem('user_id'));
    return this.getOrders().pipe(
      map((orders) => (orders ?? []).filter((o) => Number(o.user_id) === userId))
    );
  }
}
