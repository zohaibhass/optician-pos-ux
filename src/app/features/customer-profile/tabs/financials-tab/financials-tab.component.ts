import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { InputFieldComponent } from '../../../../shared/components/ui/input-field/input-field.component';

@Component({
  selector: 'app-financials-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputFieldComponent],
  templateUrl: './financials-tab.component.html',
  styleUrls: ['./financials-tab.component.css']
})
export class FinancialsTabComponent {
  @Input() form!: FormGroup;

  activeTab: 'payments' | 'refunds' = 'payments';

  /* ================= Financial Overview ================= */

  get outstandingBalanceControl(): FormControl | null {
    return this.form?.get('outstandingBalance') as FormControl | null;
  }

  get upcomingPaymentAmountControl(): FormControl | null {
    return this.form?.get('upcomingPaymentAmount') as FormControl | null;
  }

  get upcomingPaymentDateControl(): FormControl | null {
    return this.form?.get('upcomingPaymentDate') as FormControl | null;
  }

  /* ================= Shared ================= */

  get dateControl(): FormControl | null {
    return this.form?.get('date') as FormControl | null;
  }

  get invoiceNoControl(): FormControl | null {
    return this.form?.get('invoiceNo') as FormControl | null;
  }

  get amountControl(): FormControl | null {
    return this.form?.get('amount') as FormControl | null;
  }

  get paymentMethodControl(): FormControl | null {
    return this.form?.get('paymentMethod') as FormControl | null;
  }

  get paidToControl(): FormControl | null {
    return this.form?.get('paidTo') as FormControl | null;
  }

  get statusControl(): FormControl | null {
    return this.form?.get('status') as FormControl | null;
  }

  /* ================= Payment History ONLY ================= */

  get createdDateControl(): FormControl | null {
    return this.form?.get('createdDate') as FormControl | null;
  }

  get createdByControl(): FormControl | null {
    return this.form?.get('createdBy') as FormControl | null;
  }

  get authorizationDateControl(): FormControl | null {
    return this.form?.get('authorizationDate') as FormControl | null;
  }

  get authorizationByControl(): FormControl | null {
    return this.form?.get('authorizationBy') as FormControl | null;
  }

  get isCanceledControl(): FormControl | null {
    return this.form?.get('isCanceled') as FormControl | null;
  }

  get isReversalControl(): FormControl | null {
    return this.form?.get('isReversal') as FormControl | null;
  }
}
