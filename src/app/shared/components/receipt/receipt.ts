import { Component, input, Input } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Product } from '../../../models/product.model';
import { PosService } from '../../../services/pos.service';

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [CommonModule],  // <-- Add this
  templateUrl: './receipt.html',
  styleUrls: ['./receipt.css'],
  providers: [DecimalPipe] // optional if you want to inject DecimalPipe
})
export class ReceiptComponent {
items = input<any[]>([]);
invoice = input<any>();
discountPercent = input(0);
taxPercent = input(5);

  constructor(private pos: PosService) {}

  subtotal() {
    return this.pos.subtotal();
  }

  vat() {
    return this.pos.vat(this.subtotal(), this.taxPercent());
  }

  discount() {
    return Number((this.subtotal() * (this.discountPercent() / 100)).toFixed(3));
  }

  netTotal() {
    return this.pos.netTotal(this.subtotal(), this.taxPercent(), this.discountPercent());
  }

  buildHtml() {
    return document.querySelector('.receipt')?.outerHTML || '';
  }
}
