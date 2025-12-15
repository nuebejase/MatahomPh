import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule]
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  address = '';
  message = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register(this.name, this.email, this.password)
      .subscribe({
        next: (res) => {
          this.message = res.message;
          // Optionally, redirect to login after successful registration
          setTimeout(() => this.router.navigate(['/landing']), 1500);
        },
        error: (err) => this.message = err.error.error
      });
  }

  goToLogin() {
    this.router.navigate(['/']);
  }
}
