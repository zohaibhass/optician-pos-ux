// customer-profile.component.ts
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { OverviewTabComponent } from './tabs/overview-tab/overview-tab.component';
import { FinancialsTabComponent } from './tabs/financials-tab/financials-tab.component';
import { TransactionsTabComponent } from './tabs/transaction-tab/transactions-tab.component';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OverviewTabComponent,
    FinancialsTabComponent,
    TransactionsTabComponent
  ],
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css'],
})
export class CustomerProfileComponent implements OnInit {
  form!: FormGroup;
  @Output() closePopup = new EventEmitter<void>();
  activeTab: 'overview' | 'financials' | 'transactions' = 'overview';

  paymentMethods = [
    { label: 'Cash', value: 'cash' },
    { label: 'Credit Card', value: 'credit_card' },
    { label: 'Debit Card', value: 'debit_card' },
    { label: 'Bank Transfer', value: 'bank_transfer' },
  ];

  businessTypes = [
    { label: 'Customer', value: 'customer' },
    { label: 'Business', value: 'business' },
    { label: 'Wholesaler', value: 'wholesaler' },
    { label: 'Retailer', value: 'retailer' },
  ];

  sphList = [
    { label: '-19.50', value: -19.5 }, { label: '-6.00', value: -6 }, { label: '-5.00', value: -5 },
    { label: '-4.00', value: -4 }, { label: '-3.00', value: -3 }, { label: '-2.00', value: -2 },
    { label: '-1.00', value: -1 }, { label: '0.00', value: 0 }, { label: '+1.00', value: 1 },
    { label: '+2.00', value: 2 },
  ];

  cylList = [
    { label: '-4.00', value: -4 }, { label: '-3.00', value: -3 },
    { label: '-2.00', value: -2 }, { label: '-1.00', value: -1 },
    { label: '0.00', value: 0 },
  ];

  axisList = [
    { label: '0°', value: 0 }, { label: '45°', value: 45 },
    { label: '90°', value: 90 }, { label: '135°', value: 135 },
    { label: '180°', value: 180 },
  ];

  addList = [
    { label: '+0.50', value: 0.5 }, { label: '+1.00', value: 1 },
    { label: '+1.50', value: 1.5 }, { label: '+2.00', value: 2 },
  ];

  ngOnInit(): void {
    this.initializeForm();
  }

  setActiveTab(tab: 'overview' | 'financials' | 'transactions'): void {
    this.activeTab = tab;
  }

  private initializeForm(): void {
    this.form = new FormGroup({
      // Customer basic info fields
      email: new FormControl('', [Validators.email]),
      phoneNumber: new FormControl('+9223904823948', [Validators.required]),
      businessType: new FormControl('customer', [Validators.required]),
      location: new FormControl(''),

      // Overview tab fields
      lastOrder: new FormControl(''),
      lastPayment: new FormControl(''),
      companyDetails: new FormControl(''),
      address: new FormControl(''),
      longitude: new FormControl(''),
      latitude: new FormControl(''),

      // Prescription fields
      sphRight: new FormControl(''),
      sphLeft: new FormControl('-18.75'),
      cylRight: new FormControl(''),
      cylLeft: new FormControl(''),
      axisRight: new FormControl(''),
      axisLeft: new FormControl(''),
      addRight: new FormControl(''),
      addLeft: new FormControl(''),

      // Financials tab fields
      outstandingBalance: new FormControl(0, [Validators.min(0)]),
      upcomingPaymentAmount: new FormControl(0, [Validators.min(0)]),
      upcomingPaymentDate: new FormControl(''),

      // Transactions tab fields
      totalOrders: new FormControl({ value: 0, disabled: true }),
      pendingOrders: new FormControl({ value: 0, disabled: true }),

      // Payment fields
      paymentMethod: new FormControl('', [Validators.required]),
      orderAmount: new FormControl(0, [Validators.min(0)]),
      saleTax: new FormControl({ value: 0, disabled: true }),
      fedTax: new FormControl({ value: 0, disabled: true }),
      totalTax: new FormControl({ value: 0, disabled: true }),
      amountAfterTax: new FormControl({ value: 0, disabled: true }),
      previousBalance: new FormControl({ value: 0, disabled: true }),
      totalReceivable: new FormControl({ value: 0, disabled: true }),
      totalDiscount: new FormControl(0, [Validators.min(0)]),
    });

    this.orderAmountControl.valueChanges.subscribe(() => this.calculateTaxes());
    this.totalDiscountControl.valueChanges.subscribe(() => this.calculateTaxes());
  }

  // Customer basic info controls
  get emailControl(): FormControl { return this.form.get('email') as FormControl; }
  get phoneNumberControl(): FormControl { return this.form.get('phoneNumber') as FormControl; }
  get businessTypeControl(): FormControl { return this.form.get('businessType') as FormControl; }
  get locationControl(): FormControl { return this.form.get('location') as FormControl; }

  // Overview tab controls
  get lastOrderControl(): FormControl { return this.form.get('lastOrder') as FormControl; }
  get lastPaymentControl(): FormControl { return this.form.get('lastPayment') as FormControl; }
  get companyDetailsControl(): FormControl { return this.form.get('companyDetails') as FormControl; }
  get addressControl(): FormControl { return this.form.get('address') as FormControl; }
  get longitudeControl(): FormControl { return this.form.get('longitude') as FormControl; }
  get latitudeControl(): FormControl { return this.form.get('latitude') as FormControl; }

  // Prescription controls
  get sphRightControl(): FormControl { return this.form.get('sphRight') as FormControl; }
  get sphLeftControl(): FormControl { return this.form.get('sphLeft') as FormControl; }
  get cylRightControl(): FormControl { return this.form.get('cylRight') as FormControl; }
  get cylLeftControl(): FormControl { return this.form.get('cylLeft') as FormControl; }
  get axisRightControl(): FormControl { return this.form.get('axisRight') as FormControl; }
  get axisLeftControl(): FormControl { return this.form.get('axisLeft') as FormControl; }
  get addRightControl(): FormControl { return this.form.get('addRight') as FormControl; }
  get addLeftControl(): FormControl { return this.form.get('addLeft') as FormControl; }

  // Financials tab controls
  get outstandingBalanceControl(): FormControl { return this.form.get('outstandingBalance') as FormControl; }
  get upcomingPaymentAmountControl(): FormControl { return this.form.get('upcomingPaymentAmount') as FormControl; }
  get upcomingPaymentDateControl(): FormControl { return this.form.get('upcomingPaymentDate') as FormControl; }

  // Transactions tab controls
  get totalOrdersControl(): FormControl { return this.form.get('totalOrders') as FormControl; }
  get pendingOrdersControl(): FormControl { return this.form.get('pendingOrders') as FormControl; }

  // Payment controls
  get paymentMethodControl(): FormControl { return this.form.get('paymentMethod') as FormControl; }
  get orderAmountControl(): FormControl { return this.form.get('orderAmount') as FormControl; }
  get saleTaxControl(): FormControl { return this.form.get('saleTax') as FormControl; }
  get fedTaxControl(): FormControl { return this.form.get('fedTax') as FormControl; }
  get totalTaxControl(): FormControl { return this.form.get('totalTax') as FormControl; }
  get amountAfterTaxControl(): FormControl { return this.form.get('amountAfterTax') as FormControl; }
  get previousBalanceControl(): FormControl { return this.form.get('previousBalance') as FormControl; }
  get totalReceivableControl(): FormControl { return this.form.get('totalReceivable') as FormControl; }
  get totalDiscountControl(): FormControl { return this.form.get('totalDiscount') as FormControl; }

  close(): void {
    this.closePopup.emit();
  }

  save(): void {
    if (this.form.invalid) {
      this.markAllControlsAsTouched();
      return;
    }
    console.log('Profile Saved:', this.form.getRawValue());
  }

  private markAllControlsAsTouched(): void {
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  calculateTaxes(): void {
    const orderAmount = this.orderAmountControl.value || 0;
    const discount = this.totalDiscountControl.value || 0;
    const subtotal = orderAmount - discount;

    this.form.patchValue({
      saleTax: 0,
      fedTax: 0,
      totalTax: 0,
      amountAfterTax: subtotal,
      totalReceivable: subtotal
    }, { emitEvent: false });
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return control ? control.invalid && control.touched : false;
  }

  getFieldError(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'This field is required';
    if (control.errors['email']) return 'Please enter a valid email';
    if (control.errors['min']) return 'Value cannot be negative';

    return 'Invalid value';
  }
}
