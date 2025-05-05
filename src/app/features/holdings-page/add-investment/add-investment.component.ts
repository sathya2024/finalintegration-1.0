import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Investment } from '../../../core/models/investment';
import { Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-investment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-investment.component.html',
  styleUrls: ['./add-investment.component.css'],
})
export class AddInvestmentComponent {
  @Input() investmentToEdit: any = null;
  @Input() isEdit: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Investment>();

  // Define investment without ID
  // Define investment without ID
  investment: Partial<Investment> = {
    userId: 0,
    type: 'stock',
    transactionType: 'buy',
  };
  transactionType: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (this.isEdit && this.investmentToEdit) {
      this.investment = { ...this.investmentToEdit };
      this.transactionType = this.investment.transactionType;
    } else {
      this.fetchCurrentUserId();
    }
  }

  fetchCurrentUserId(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      this.investment.userId = user.id;
    } else {
      console.error(
        'No user found in localStorage. Ensure login sets "currentUser".'
      );
    }
  }

  saveInvestment(): void {
    console.log('Saving investment:', this.investment, 'isEdit:', this.isEdit);
    // ... rest of your code
    this.investment.transactionType = this.transactionType;

    // Ensure all required fields are present before saving
    if (
      this.isEdit &&
      this.investment.id !== undefined &&
      this.investment.userId !== undefined
    ) {
      // Edit mode: update existing investment
      const updatedInvestment: Investment = this.investment as Investment;
      this.http
        .put<Investment>(
          `http://localhost:3000/investments/${updatedInvestment.id}`,
          updatedInvestment
        )
        .subscribe({
          next: (response) => {
            this.save.emit(response);
          },
          error: (error) => {
            console.error('Error updating investment:', error);
          },
        });
    } else if (this.investment.userId !== undefined) {
      // Add mode: create new investment
      this.http
        .get<Investment[]>('http://localhost:3000/investments')
        .subscribe((data) => {
          const maxId = Math.max(...data.map((i) => i.id ?? 0));
          const newInvestment: Investment = {
            ...(this.investment as Investment),
            id: maxId + 1,
          };
          this.http
            .post<Investment>(
              'http://localhost:3000/investments',
              newInvestment
            )
            .subscribe({
              next: (response) => {
                this.save.emit(response);
              },
              error: (error) => {
                console.error('Error saving investment:', error);
              },
            });
        });
    } else {
      // Handle missing userId or required fields
      alert('Required fields are missing!');
    }
  }

  closeForm(): void {
    this.close.emit();
  }
}
