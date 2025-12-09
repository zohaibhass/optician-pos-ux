import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputFieldComponent } from '../ui/input-field/input-field.component';
import { DropdownFieldComponent } from '../ui/select/dropdown-field.component';

@Component({
  selector: 'app-register-customer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputFieldComponent, DropdownFieldComponent],
  templateUrl: './register-customer.component.html',
  styleUrls: ['./register-customer.component.css'],
})
export class RegisterCustomerComponent implements OnInit {
  form!: FormGroup;
  @Output() closePopup = new EventEmitter<void>();

  genderList = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  codeList = [
    { label: '+92', value: 'pak' },
    { label: '+1', value: 'usa' },
    { label: '+44', value: 'uk' },
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
  colorList=[
    {label:'blue',value:1},
     {label:'red',value:2},
      {label:'grey',value:3},
       {label:'black',value:4}


  ]

  ngOnInit(): void {
    this.form = new FormGroup({
      firstName: new FormControl('', Validators.required),
      phoneCountryCode: new FormControl('+92'),
      phoneNumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      gender: new FormControl('', Validators.required),
      colorTag: new FormControl(''),
      currency: new FormControl('Pakistani Rupee (PKR)'),

      sphRight: new FormControl(''),
      sphLeft: new FormControl(''),
      cylRight: new FormControl(''),
      cylLeft: new FormControl(''),
      axisRight: new FormControl(''),
      axisLeft: new FormControl(''),
      addRight: new FormControl(''),
      addLeft: new FormControl(''),

      prescriptionDate: new FormControl('', Validators.required),
      nextVisitDate: new FormControl('', Validators.required),   // ← THIS WAS MISSING
      jobCardNo: new FormControl('', Validators.required),
      comments: new FormControl(''),

      orderDate: new FormControl('', Validators.required),
      deliveryDate: new FormControl('', Validators.required),
    });
  }

  get genderControl() { return this.form.get('gender') as FormControl; }
  get codeListControl() { return this.form.get('phoneCountryCode') as FormControl; }
  get sphRightControl() { return this.form.get('sphRight') as FormControl; }
  get sphLeftControl() { return this.form.get('sphLeft') as FormControl; }
  get cylRightControl() { return this.form.get('cylRight') as FormControl; }
  get cylLeftControl() { return this.form.get('cylLeft') as FormControl; }
  get axisRightControl() { return this.form.get('axisRight') as FormControl; }
  get axisLeftControl() { return this.form.get('axisLeft') as FormControl; }
  get addRightControl() { return this.form.get('addRight') as FormControl; }
  get addLeftControl() { return this.form.get('addLeft') as FormControl; }
  get colorTagControl(){return this.form.get('colorTag') as FormControl}

  close() {
    this.closePopup.emit();
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Form Submitted:', this.form.value);
  }
}