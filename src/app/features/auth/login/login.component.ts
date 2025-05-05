import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../../../core/services/auth.service';
import { response } from 'express';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup; // Declare the form group without initializing it

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private auth:AuthService
  ) {}

  ngOnInit(): void {
    // Initialize the form group in ngOnInit
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      alert('Please enter valid credentials.');
      return;
    }

    const { email, password } = this.loginForm.value;
    const credentials = {
      email: email,
      password: password,
    };

    try {
      this.auth.login(credentials).subscribe({
        next: (response) => {
          console.log('Login response:', response); // Log the response for debugging
          if (response && response.token) {
            localStorage.setItem('authToken', response.token);
            console.log(response); // Store the token in localStorage
            localStorage.setItem('userId', response.userId);

            this.auth.setUser(response.user); // Set the user in AuthService
            this.router.navigate(['/dashboard']); // Navigate to home page after successful login
          } else {
            alert('Invalid credentials. Please try again.');
          }
        }
      });
      
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong. Please try again.');
    }
  }
}