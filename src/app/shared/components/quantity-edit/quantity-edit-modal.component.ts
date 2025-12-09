import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quantity-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quantity-edit.html',
  styleUrls: ['./quantity-edit.css'],
})
export class QuantityEditModalComponent {

  // ----- Inputs -----
  barcode = input<string>('');
  initialQty = input<number>(1);

  // ----- Outputs -----
  save = output<{ barcode: string; qty: number }>();
  cancel = output<void>();

  // Local qty signal
  qty = signal(1);

  ngOnInit() {
    this.qty.set(this.initialQty() || 1);
  }

  saveClick() {
    this.save.emit({
      barcode: this.barcode(),
      qty: this.qty(),
    });
  }

  cancelClick() {
    this.cancel.emit();
  }
}
