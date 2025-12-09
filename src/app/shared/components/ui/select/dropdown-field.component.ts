import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-dropdown-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dropdown-field.component.html',
  styleUrls: ['./dropdown-field.component.css'],
})
export class DropdownFieldComponent {
  @Input() label: string = '';
  @Input() placeholder: string = 'Select option';
  @Input() options: Array<{ label: string; value: any }> = [];
  @Input() control!: FormControl;
  @Input() disabled: boolean = false;
}
