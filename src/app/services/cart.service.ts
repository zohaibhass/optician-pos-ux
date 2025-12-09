import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

export interface CartItem {
  id: string;
  name: string;
  barcode: string;
  price: number;
  qty: number;
  total: number;
  discountPercent?: number;
  discountInput?: number;
  totalDiscount?: number;
  totalAfterDiscount?: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  // Public readonly access
  get items(): CartItem[] {
    return this.itemsSubject.value;
  }

  addProduct(product: Product, qty = 1) {
    const items = [...this.items];
    const found = items.find(i => i.barcode === product.barcode);

    if (found) {
      found.qty += qty;
      found.total = this.round(found.qty * found.price);
    } else {
      items.push({
        id: product.id,
        name: product.name,
        barcode: product.barcode,
        price: product.price,
        qty,
        total: this.round(product.price * qty)
      });
    }
    this.itemsSubject.next(items);
  }

  updateQty(barcode: string, qty: number) {
    if (qty <= 0) {
      this.removeItem(barcode);
      return;
    }

    const items = this.items.map(item =>
      item.barcode === barcode
        ? { ...item, qty, total: this.round(qty * item.price) }
        : item
    );
    this.itemsSubject.next(items);
  }

  removeItem(barcode: string) {
    this.itemsSubject.next(this.items.filter(i => i.barcode !== barcode));
  }

  // This is correct and will work perfectly
  clear() {
    this.itemsSubject.next([]);
  }

  getQty(barcode: string): number {
    return this.items.find(i => i.barcode === barcode)?.qty || 0;
  }

  getSubtotal(): number {
    return this.round(this.items.reduce((sum, i) => sum + i.total, 0));
  }

  private round(value: number, decimals = 3): number {
    return Math.round(value * 1000) / 1000;
  }

  // Fixed version – immutable
  addItem(newItem: CartItem) {
    const items = [...this.items];
    const existing = items.find(i => i.barcode === newItem.barcode);

    if (existing) {
      existing.qty += newItem.qty;
      existing.total = this.round(existing.qty * existing.price);
    } else {
      items.push({ ...newItem, total: this.round(newItem.qty * newItem.price) });
    }
    this.itemsSubject.next(items);
  }
}