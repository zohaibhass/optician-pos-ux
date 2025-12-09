import { Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { Product } from '../models/product.model';

export interface InvoiceMeta {
  billNo: string;
  date: Date;
  dateString: string;
  timeString: string;
  cashier: string;
  counter: string;
}

@Injectable({ providedIn: 'root' })
export class PosService {
  invoice: InvoiceMeta = {
    billNo: '',
    date: new Date(),
    dateString: '',
    timeString: '',
    cashier: 'CASHIER-1',
    counter: '1',
  };

  private heldTransactions: any[] = [];

  // Order-level discount
  orderDiscountType: '%' | 'amount' = '%';
  orderDiscountValue: number = 0;

  constructor(private cart: CartService) {}

  generateNewBill() {
    const now = new Date();
    this.invoice.date = now;
    this.invoice.dateString = `${now.getDate().toString().padStart(2, '0')}/${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${now.getFullYear()}`;
    this.invoice.timeString = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    this.invoice.billNo = `${now.getHours().toString().padStart(2, '0')}${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}-${this.invoice.counter}`;
  }

  subtotal(): number {
    return this.cart.getSubtotal();
  }

  vat(subtotal: number, taxPercent: number): number {
    return Number((subtotal * (taxPercent / 100)).toFixed(3));
  }

  hasItemLevelDiscounts(): boolean {
    return this.cart.items.some(item => item.discountPercent && item.discountPercent > 0);
  }

  resetItemDiscounts(): void {
    this.cart.items.forEach(item => (item.discountPercent = 0));
  }

  applyOrderDiscount(value: number, type: '%' | 'amount'): void {
    this.orderDiscountValue = value;
    this.orderDiscountType = type;
  }

  netTotal(
    subtotal: number,
    taxPercent: number,
    discountValue?: number,
    discountType?: '%' | 'amount'
  ): number {
    const vatAmount = this.vat(subtotal, taxPercent);
    let discountAmount = 0;

    const value = discountValue !== undefined ? discountValue : this.orderDiscountValue;
    const type = discountType || this.orderDiscountType;

    if (type === '%') {
      discountAmount = Number((subtotal * (value / 100)).toFixed(3));
    } else {
      discountAmount = Number(value.toFixed(3));
    }

    return Number((subtotal + vatAmount - discountAmount).toFixed(3));
  }

  addByBarcode(barcode: string, qty = 1): boolean {
    const product = MOCK_DB.find(p => p.barcode === barcode);
    if (!product) return false;
    this.cart.addProduct(product, qty);
    return true;
  }

  addProductByObject(product: Product, qty = 1): void {
    this.cart.addProduct(product, qty);
  }

  holdCurrentTransaction(): void {
    const snapshot = {
      id: Date.now(),
      items: [...this.cart.items],
      meta: { ...this.invoice },
      timestamp: new Date().toISOString(),
    };
    this.heldTransactions.push(snapshot);
    this.generateNewBill();
  }

  recallLastHeld(): any | null {
    if (this.heldTransactions.length === 0) return null;
    const recent = this.heldTransactions.pop();
    this.cart.clear();
    recent.items.forEach((it: any) =>
      this.cart.addProduct(
        { id: it.id, name: it.name, barcode: it.barcode, price: it.price, stock: 999 },
        it.qty
      )
    );
    this.invoice = recent.meta;
    return recent;
  }

  finalizeSale(): void {
    // persist to server or local storage, then new invoice
    // TODO: implement persistence
    this.generateNewBill();
  }

  buildReceiptHtml({
    items,
    discountPercent,
    taxPercent,
    invoice,
  }: {
    items: any[];
    discountPercent: number;
    taxPercent: number;
    invoice: any;
  }): string {
    const subtotal = this.cart.getSubtotal();
    const vat = this.vat(subtotal, taxPercent);
    const discount =
      this.orderDiscountType === '%'
        ? Number((subtotal * (discountPercent / 100)).toFixed(3))
        : Number(discountPercent.toFixed(3));
    const total = this.netTotal(subtotal, taxPercent, discountPercent);

    const header = `
      <div style="font-family:monospace; padding:10px; color:#000;">
        <div style="text-align:center;">
          <h3 style="margin:0;">STORE NAME</h3>
          <div>${invoice.dateString} ${invoice.timeString}</div>
          <div>Bill: ${invoice.billNo}</div>
          <div>Cashier: ${invoice.cashier}</div>
          <hr/>
        </div>
    `;

    const itemsHtml = items
      .map(it => {
        const name = it.name.length > 20 ? it.name.slice(0, 20) + '...' : it.name;
        return `<div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:4px;">
          <div style="width:60%">${name} (${it.barcode})</div>
          <div style="width:20%; text-align:right">${it.qty}x</div>
          <div style="width:20%; text-align:right">${it.total.toFixed(3)}</div>
        </div>`;
      })
      .join('');

    const footer = `
        <hr/>
        <div style="display:flex;justify-content:space-between"><div>Subtotal</div><div>${subtotal.toFixed(
          3
        )}</div></div>
        <div style="display:flex;justify-content:space-between"><div>VAT (${taxPercent}%)</div><div>${vat.toFixed(
      3
    )}</div></div>
        <div style="display:flex;justify-content:space-between"><div>Discount (${discountPercent}${
      this.orderDiscountType
    })</div><div>${discount.toFixed(3)}</div></div>
        <div style="display:flex;justify-content:space-between;font-weight:700"><div>NET TOTAL</div><div>${total.toFixed(
          3
        )}</div></div>
        <hr/>
        <div style="text-align:center; margin-top:10px;">Thank you for shopping!</div>
      </div>
    `;

    return header + itemsHtml + footer;
  }
}

/* ---- Demo/mock DB ---- */
const MOCK_DB: Product[] = [
  { id: '1', name: 'Sample Product 1', barcode: '1', price: 5.0, stock: 99 },
  { id: '2', name: 'Sample Product 2', barcode: '2', price: 12.5, stock: 50 },
  { id: '3', name: 'Sample Product 3', barcode: '3', price: 8.75, stock: 40 },
  { id: '7', name: 'Sample Product 7', barcode: '7', price: 4.0, stock: 100 },
];
