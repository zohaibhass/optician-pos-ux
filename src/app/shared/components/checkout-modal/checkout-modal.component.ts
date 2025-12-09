import { Component, EventEmitter, input, Input, output, Output } from '@angular/core';
import { CartItem } from '../../../models/cart-item.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl:"./checkout-modal.component.html",
  styleUrls:['./checkout-modal.component.css']
})
export class CheckoutModalComponent {
   visible = input(false);
  subtotal = input(0);
  vat = input(0);
  total = input(0);

  // 🔹 Outputs
  confirm = output<number>();
  confirmWs = output<void>();
  confirmPrint = output<void>();
  cancel = output<void>();

  paidAmount = 0;

  onConfirm() {
    this.confirm.emit(this.paidAmount);
  }

  onConfirmWs() {
    this.confirmWs.emit();
  }

  onConfirmPrint() {
    this.confirmPrint.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
