import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service'; // Import the AuthService
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddInvestmentComponent } from '../add-investment/add-investment.component'; // Import FormsModule for ngModel

@Component({
  selector: 'app-holdings',
  standalone: true,
  imports: [CommonModule, AddInvestmentComponent, FormsModule],
  templateUrl: './holdings.component.html',
  styleUrls: ['./holdings.component.css'],
})
export class HoldingsComponent implements OnInit {
  investments: any[] = [];
  userId: number = 1;
  totalInvestmentValue = 0;
  totalInvestmentCost = 0;
  totalGainLoss = 0;
  totalGainLossPercentage = 0;
  perDayGainLoss = 10;
  loading = true;
  error = '';
  showAddInvestment = false;
  showEditInvestment = false;
  selectedInvestment: any | null = null;
  showDeleteConfirm = false;
  investmentToDelete: any = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('User ID:', this.userId); // Add this to debug
    this.loadInvestments();
  }

  loadInvestments(): void {
    this.http.get<any[]>('http://localhost:3000/investments').subscribe({
      next: (data) => {
        console.log('Fetched investments:', data); // Debugging line to check data
        this.investments = data.filter(
          (inv) => inv.userId === this.userId && inv.transactionType === 'buy'
        );
        console.log('Filtered investments:', this.investments); // Log filtered investments
        this.calculateTotals();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load investments';
        this.loading = false;
      },
    });
  }
  // Add methods to handle the Add Investment pop-up
  openAddInvestment(): void {
    this.selectedInvestment = null;
    this.showAddInvestment = true;
    this.showEditInvestment = false;
  }

  editInvestment(investment: any): void {
    this.selectedInvestment = { ...investment }; // clone for editing
    this.showAddInvestment = false;
    this.showEditInvestment = true;
  }

  closeAddInvestment(): void {
    this.showAddInvestment = false;
    this.showEditInvestment = false;
    this.selectedInvestment = null;
  }
  // Called when delete button is clicked
  confirmDeleteInvestment(investment: any): void {
    this.investmentToDelete = investment;
    this.showDeleteConfirm = true;
  }

  // Called when user cancels the delete
  cancelDelete(): void {
    this.investmentToDelete = null;
    this.showDeleteConfirm = false;
  }

  // Called when user confirms the delete
  deleteInvestment(): void {
    if (!this.investmentToDelete) return;
    this.http
      .delete(`http://localhost:3000/investments/${this.investmentToDelete.id}`)
      .subscribe({
        next: () => {
          this.loadInvestments(); // Refresh the list from backend
          this.showDeleteConfirm = false;
          this.investmentToDelete = null;
        },
        error: (err) => {
          alert('Failed to delete investment.');
          this.showDeleteConfirm = false;
          this.investmentToDelete = null;
        },
      });
  }

  saveInvestment(updatedInvestment: any): void {
    if (this.showEditInvestment) {
      // Find and update the investment in the array
      const idx = this.investments.findIndex(
        (inv) => inv.id === updatedInvestment.id
      );
      if (idx !== -1) {
        this.investments[idx] = updatedInvestment;
      }
    } else {
      this.investments.push(updatedInvestment);
    }
    this.calculateTotals();
    this.loadInvestments();
    this.closeAddInvestment();
  }

  calculateTotals(): void {
    this.totalInvestmentCost = 0;
    this.totalInvestmentValue = 0;

    for (const inv of this.investments) {
      if (inv.type === 'stock') {
        const cost = inv.purchasePrice * inv.numberOfShares;
        this.totalInvestmentCost += cost;
        const currentPrice = inv.purchasePrice * 1.05; // Dummy current price +5%
        this.totalInvestmentValue += currentPrice * inv.numberOfShares;
      } else if (inv.type === 'mutualFund') {
        const units =
          inv.amountType === 'Rupees' ? inv.amount / inv.price : inv.amount;
        const currentPrice = inv.price * 1.05;
        this.totalInvestmentCost += units * inv.price;
        this.totalInvestmentValue += units * currentPrice;
      } else if (inv.type === 'goldBond') {
        console.log('Gold Bond:', inv); // Debugging line to check data
        const cost = inv.units * inv.price; // Initial cost of investment
        const currentPrice = inv.price * 1.05; // Assuming 5% appreciation in current value
        this.totalInvestmentCost += cost;
        this.totalInvestmentValue += inv.units * currentPrice;
      } else if (inv.type === 'bond') {
        this.totalInvestmentCost += inv.investmentAmount;
        this.totalInvestmentValue += inv.investmentAmount * 1.02; // Assume 2% appreciation
      }
    }

    this.totalGainLoss = this.totalInvestmentValue - this.totalInvestmentCost;
    this.totalGainLossPercentage =
      (this.totalGainLoss / this.totalInvestmentCost) * 100;
  }

  refreshPrices(): void {
    this.loadInvestments(); // Simulate a refresh
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  goToHoldings(): void {
    this.router.navigate(['/holdings']);
  }

  goToTransactions(): void {
    this.router.navigate(['/transactions']);
  }
}
