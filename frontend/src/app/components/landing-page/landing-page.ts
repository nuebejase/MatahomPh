import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.html',
  styleUrls: ['./landing-page.css'],
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    CommonModule,



  ]
})
export class LandingPage implements OnInit, AfterViewInit {

  ngOnInit(): void {
    // Initialization logic here
  }
  ngAfterViewInit(): void {
    // ViewChild initialization logic here
  }
}
