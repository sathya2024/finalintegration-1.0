import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

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
      UserName: ['', Validators.required],
      Password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      securityQuestion: ['', Validators.required],
      securityAnswer: ['', Validators.required],
    });
  }

    async onSubmit() {
    const form = this.signupForm.value;
  
    // Check if passwords match
    if (form.Password !== form.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
  
    try {
      // Create the new user object
      const newUser = {
        Id: 0,
        Name: form.name,
        Email: form.email,
        UserName: form.UserName, // Corrected casing
        Password: form.Password,
        ConfirmPassword: form.confirmPassword,
        SecurityQuestion: form.securityQuestion,
        SecurityAnswer: form.securityAnswer,
      };
  
      console.log('New user:', newUser); // Debugging line to check newUser object
      console.log('UserName:', form.UserName); // Debugging line to check UserName value
  
      // Send the new user object to the backend
      this.http.post('http://localhost:5154/api/Auth/register', newUser).subscribe({
        next: (response) => {
          console.log('Response:', response); // Log the plain text response
          alert("Successfully registered"); // Display the response message to the user
          this.signupForm.reset();
        },
        error: (error) => {
          console.error('Signup error:', error);
          alert('Something went wrong. Please try again.');
        },
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('Something went wrong. Please try again.');
    }
  }
}