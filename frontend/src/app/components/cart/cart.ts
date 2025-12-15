import { NgFor, NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AppRoutingModule } from "../../app.routes";
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
  imports: [NgFor, NgIf, FormsModule, RouterModule],
})
export class CartComponent {
}