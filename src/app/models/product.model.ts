export interface Product {
  id: string;
  name: string;
  barcode: string;
  price: number;
  stock: number;
  unit?:string;
amount?: number;
}
