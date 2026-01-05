import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputFieldComponent } from '../../../../shared/components/ui/input-field/input-field.component';

@Component({
  selector: 'app-overview-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputFieldComponent],
  templateUrl: './overview-tab.component.html',
  styleUrls: ['./overview-tab.component.css']
})
export class OverviewTabComponent {
  @Input() form!: FormGroup;

  get lastOrderControl() { return this.form?.get('lastOrder') as any; }
  get lastPaymentControl() { return this.form?.get('lastPayment') as any; }
  get companyDetailsControl() { return this.form?.get('companyDetails') as any; }
  get addressControl() { return this.form?.get('address') as any; }
  get longitudeControl() { return this.form?.get('longitude') as any; }
  get latitudeControl() { return this.form?.get('latitude') as any; }
}

