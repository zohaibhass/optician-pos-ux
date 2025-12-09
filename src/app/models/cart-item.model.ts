export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  barcode: string;
  total: number;
  unit:string;
  discountInput?:number
}
