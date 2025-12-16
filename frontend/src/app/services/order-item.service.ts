import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type CreateOrderItemPayload = {
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  subtotal: number; // ✅ REQUIRED by DB
};

@Injectable({ providedIn: 'root' })
export class OrderItemService {
private readonly API_BASE = 'http://localhost:5000/auth';


  constructor(private http: HttpClient) {}

  createOrderItem(payload: CreateOrderItemPayload): Observable<any> {
    return this.http.post(`${this.API_BASE}/order-items`, payload);
  }

  deleteOrderItem(itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE}/order-items/${itemId}`);
  }
}
