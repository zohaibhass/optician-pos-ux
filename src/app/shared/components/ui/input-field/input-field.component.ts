import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFieldComponent),
      multi: true
    }
  ]
})
export class InputFieldComponent implements ControlValueAccessor {
  @Input() value: any = '';
  @Output() valueChange = new EventEmitter<any>();

  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() autocomplete: string = 'off';
  @Input() minlength: string | number | null = null;
  @Input() maxlength: string | number | null = null;
  @Input() pattern: string | RegExp | null = null;
  @Input() required: boolean = false;
  @Input() validationPattern: string | RegExp = '';
  @Input() inputClass: string = '';
  @Input() wrapperClass: string = '';

  @Input() textarea: boolean = false;

  @Output() inputEvent = new EventEmitter<Event>();
  @Output() blurEvent = new EventEmitter<Event>();
  @Output() focusEvent = new EventEmitter<Event>();

  private onChange = (_: any) => {};
  private onTouched = () => {};

  writeValue(value: any): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  onValueChange(val: any) {
    this.value = val;
    this.valueChange.emit(val);
    this.onChange(val);
    this.onTouched();
  }

  onInput(event: Event) {
    this.inputEvent.emit(event);
  }
}