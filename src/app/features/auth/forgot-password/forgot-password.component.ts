import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule]
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm!: FormGroup; // Declare the form group without initializing it

  securityQuestions: string[] = [
    "What was your childhood nickname?",
    "What is the name of your favorite childhood friend?",
    "What is your mother’s maiden name?",
    "What was the name of your first pet?",
    "What is your favorite book?"
  ];

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    // Initialize the form group in ngOnInit
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      securityQuestion: ['', Validators.required],
      securityAnswer: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  async onSubmit() {
    const form = this.forgotForm.value;

    if (form.newPassword !== form.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const users: any = await this.http.get(`http://localhost:3000/users?email=${form.email}`).toPromise();
      if (!users.length) {
        alert('User not found');
        return;
      }

      const user = users[0];
      if (
        form.securityQuestion !== user.securityQuestion ||
        !(await bcrypt.compare(form.securityAnswer!, user.securityAnswer))
      ) {
        alert('Security answer does not match');
        return;
      }

      const hashedNewPassword = await bcrypt.hash(form.newPassword!, 10);

      this.http.patch(`http://localhost:3000/users/${user.id}`, {
        password: hashedNewPassword
      }).subscribe(() => {
        alert('Password updated successfully');
        this.forgotForm.reset();
      });
    } catch (error) {
      console.error('Error updating password:', error);
      alert('An error occurred. Please try again.');
    }
  }
}