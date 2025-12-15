import { NgIf, NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import {  RouterModule } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
  imports: [ RouterModule, NgIf, NgFor],

})
export class ProductComponent {
  @Input() product: any; // Product object from parent component
  quantity: number = 1;

  increaseQty() {
    this.quantity++;
  }

  decreaseQty() {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart() {
    console.log(`Added ${this.quantity} of ${this.product?.name} to cart`);
    // TODO: integrate with cart service
  }

  buyNow() {
    console.log(`Buying ${this.quantity} of ${this.product?.name}`);
    // TODO: integrate with checkout
  }
}
