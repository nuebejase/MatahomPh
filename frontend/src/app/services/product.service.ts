import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id?: number;
  name?: string;
  description?: string;

  price?: number;
  old_price?: number;

  badge?: string;
  category?: string;

  // your template uses this:
  category_name?: string;  // ✅ add

  // pick one image field and keep it consistent
  image_url?: string;
}
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // IMPORTANT: match your backend prefix.
  // If your Flask registers product_bp under "/auth", this becomes:
  // http://localhost:5000/auth/products
  private readonly baseUrl = 'http://localhost:5000/auth/products';

  // Optional: set headers (usually not required unless you want explicit JSON)
  private readonly jsonHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  getOne(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product, { headers: this.jsonHeaders });
  }

  update(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product, { headers: this.jsonHeaders });
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
