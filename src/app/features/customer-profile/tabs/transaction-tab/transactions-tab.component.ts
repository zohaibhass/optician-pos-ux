import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { InputFieldComponent } from '../../../../shared/components/ui/input-field/input-field.component';

@Component({
  selector: 'app-transactions-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputFieldComponent],
  templateUrl: './transactions-tab.component.html',
  styleUrls: ['./transactions-tab.component.css']
})
export class TransactionsTabComponent {
  @Input() form!: FormGroup;

  activeTab: 'orderHistory' | 'fulfillment' | 'supplier' = 'orderHistory';

  constructor() {
    // Initialize form and all controls
    this.form = new FormGroup({
      totalOrders: new FormControl(0),
      pendingOrders: new FormControl(0),
      orderFulfillmentRate: new FormControl(0),

      orderNo: new FormControl(''),
      orderDate: new FormControl(''),
      product: new FormControl(''),
      deliveryDate: new FormControl(''),
      paidAmount: new FormControl(''),
      city: new FormControl(''),
      totalAmount: new FormControl(''),
      status: new FormControl(''),
      action: new FormControl(''),

      fulfillmentMetric: new FormControl(''),
      fulfillmentValue: new FormControl(''),

      supplierMetric: new FormControl(''),
      supplierValue: new FormControl(''),
    });
  }

  // Financial Overview Controls
  get totalOrdersControl() { return this.form.get('totalOrders') as FormControl; }
  get pendingOrdersControl() { return this.form.get('pendingOrders') as FormControl; }
  get orderFulfillmentRateControl() { return this.form.get('orderFulfillmentRate') as FormControl; }

  // Order History Controls
  get orderNoControl() { return this.form.get('orderNo') as FormControl; }
  get orderDateControl() { return this.form.get('orderDate') as FormControl; }
  get productControl() { return this.form.get('product') as FormControl; }
  get deliveryDateControl() { return this.form.get('deliveryDate') as FormControl; }
  get paidAmountControl() { return this.form.get('paidAmount') as FormControl; }
  get cityControl() { return this.form.get('city') as FormControl; }
  get totalAmountControl() { return this.form.get('totalAmount') as FormControl; }
  get statusControl() { return this.form.get('status') as FormControl; }
  get actionControl() { return this.form.get('action') as FormControl; }

  // Fulfillment Tab Controls
  get fulfillmentMetricControl() { return this.form.get('fulfillmentMetric') as FormControl; }
  get fulfillmentValueControl() { return this.form.get('fulfillmentValue') as FormControl; }

  // Supplier Reliability Tab Controls
  get supplierMetricControl() { return this.form.get('supplierMetric') as FormControl; }
  get supplierValueControl() { return this.form.get('supplierValue') as FormControl; }
}
