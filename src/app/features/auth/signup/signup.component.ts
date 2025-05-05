import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup; // Declare the form group without initializing it

  securityQuestions: string[] = [
    'What was your childhood nickname?',
    'What is the name of your favorite childhood friend?',
    'What is your mother’s maiden name?',
    'What was the name of your first pet?',
    'What is your favorite book?',
  ];

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    // Initialize the form group in ngOnInit
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      securityQuestion: ['', Validators.required],
      securityAnswer: ['', Validators.required],
    });
  }

  async onSubmit() {
    const form = this.signupForm.value;
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(form.password!, 10);
      const hashedAnswer = await bcrypt.hash(form.securityAnswer!, 10);

      const users: any = await this.http.get('http://localhost:3000/users').toPromise();
      const newId = users.length ? Number(users[users.length - 1].id) + 1 : 1; // Ensure newId is a number

      const newUser = {
        id: newId,
        Userid: newId, // Ensure Userid is a number
        name: form.name,
        email: form.email,
        password: hashedPassword,
        securityQuestion: form.securityQuestion,
        securityAnswer: hashedAnswer,
      };

      this.http.post('http://localhost:3000/users', newUser).subscribe(() => {
        alert('Signup successful');
        this.signupForm.reset();
      });
    } catch (error) {
      console.error('Signup error:', error);
      alert('Something went wrong. Please try again.');
    }
  }
}