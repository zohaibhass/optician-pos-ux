import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule, MatIconModule],
})
export class LoginComponent {
  username = '';
  password = '';
  message = '';

  // Hardcoded credentials
  private readonly validUsername = 'admin';
  private readonly validPassword = 'root';

  constructor(private toastr: ToastrService, private router: Router) {}

  login() {
    if (this.username === this.validUsername && this.password === this.validPassword) {
      this.message = `Logged in as ${this.username}`;
      this.toastr.success(`Welcome back, ${this.username} ✅`, 'Login Successful');
     setTimeout(() => {
        this.router.navigate(['pos']);
      }, 500);
    } else {
      this.message = 'Login failed';
      this.toastr.error('Invalid username or password ❌', 'Login Failed');
    }
  }
}
