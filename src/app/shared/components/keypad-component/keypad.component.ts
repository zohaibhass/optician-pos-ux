import { Component, EventEmitter, Output, input, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-keypad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './keypad.component.html',
  styleUrls: ['./keypad.component.css'],
})
export class KeypadComponent {
  isInputForBarcode = input<boolean>(true);
  currentNumericInput = model<string>('');

  inputChanged = output<string>();
  onEnter = output<void>();
  onPay = output<void>();
  onReturn = output<void>();
  onHold = output<void>();
  onRecall = output<void>();
  onOptions = output<void>();
  onExit = output<void>();
  onToggleInput = output<void>();
  onDiscount = output<void>();

  keypadClick(value: string | number) {
    if (typeof value === 'number' || value === '.' || value === '0' || value === '00') {
      this.currentNumericInput.update((v) => v + value.toString());
      this.inputChanged.emit(this.currentNumericInput());
      return;
    }

    switch (value) {
      case 'ENTER': this.onEnter.emit(); break;
      case 'PAY': this.onPay.emit(); break;
      case 'RETURN': this.onReturn.emit(); break;
      case 'HOLD': this.onHold.emit(); break;
      case 'RECALL': this.onRecall.emit(); break;
      case 'OPTIONS': this.onOptions.emit(); break;
      case 'EXIT': this.onExit.emit(); break;

      case '-':
        this.currentNumericInput.update((v) => v.slice(0, -1));
        this.inputChanged.emit(this.currentNumericInput());
        break;

      case '+':
        this.onToggleInput.emit();
        break;

      case 'DISCOUNT':   // NEW CASE
        this.onDiscount.emit();
        break;
    }
  }
}
