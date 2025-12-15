import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule]
})
export class LoginComponent {
  email = '';
  password = '';
  message = '';
  user: any = null;

  constructor(private authService: AuthService, private router: Router) {}

 login() {
  this.authService.login(this.email, this.password)
    .subscribe({
      next: (res) => {
        this.message = res.message;
        this.user = res.user;

        // ✅ store logged-in user_id (adjust key if needed)
        localStorage.setItem('user_id', String(res.user.user_id));

        // Redirect
        this.router.navigate(['/landing']);
      },
      error: (err) => this.message = err.error.error
    });
}


  goToRegister() {
    this.router.navigate(['/register']); // Make sure you have a Register route
  }
}
