import { CartItem } from './cart-item.model';

export interface Invoice {
  id: string;
  date: Date;
  items: CartItem[];
  subtotal: number;
  vat: number;
  discount: number;
  total: number;
  paidAmount: number;
  changeAmount: number;
}
