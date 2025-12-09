// product-search.component.ts  ← FULL FIXED FILE

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputFieldComponent } from "../ui/input-field/input-field.component";
import { RegisterCustomerComponent } from "../register-customer/register-customer.component";

export interface Product {
  id: string;
  name: string;
  barcode: string;
  price: number;
  stock: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [CommonModule, FormsModule, InputFieldComponent, RegisterCustomerComponent],
  templateUrl: './product-search.html',
  styleUrls: ['./product-search.css']
})
export class ProductSearchComponent {

  searchInput = '';
  customerSearch = '';
  showRegisterPopup = false;

  products: Product[] = [
    { id: "1", name: 'Basic Reading Glasses', barcode: '1001', price: 12.5, stock: 20 },
    { id: "2", name: 'Eyeglasses Frame (Metal)', barcode: '1002', price: 25.0, stock: 15 },
    { id: "3", name: 'Eyeglasses Frame (Plastic)', barcode: '1003', price: 18.0, stock: 18 },
    { id: "4", name: 'Premium Optical Frame', barcode: '1004', price: 40.0, stock: 10 },
    { id: "5", name: 'Sunglasses – Black', barcode: '1005', price: 30.0, stock: 12 },
    { id: "6", name: 'Sunglasses – Brown', barcode: '1006', price: 32.0, stock: 8 },
    { id: "7", name: 'Anti-Reflective Lenses', barcode: '1007', price: 50.0, stock: 25 },
  ];

  customers: Customer[] = [
    { id: 'c1', name: 'Ali Khan', email: 'ali@example.com', phone: '0300-1234567' },
    { id: 'c2', name: 'Sara Ahmed', email: 'sara@example.com', phone: '0301-2345678' },
    { id: 'c3', name: 'Hamza Malik', email: 'hamza@example.com', phone: '0302-3456789' },
  ];

  filteredProducts: Product[] = [];
  filteredCustomers: Customer[] = [];

  @Output() selectProduct = new EventEmitter<Product>();
  @Output() selectCustomer = new EventEmitter<Customer>();
  @Output() newOrder = new EventEmitter<void>();   // ← This is the EVENT (keep this name)

  // Search handlers
  onSearchChange() {
    const term = this.searchInput.toLowerCase().trim();
    this.filteredProducts = term
      ? this.products.filter(p =>
          p.name.toLowerCase().includes(term) || p.barcode.includes(term)
        )
      : [];
  }

  onCustomerSearch() {
    const term = this.customerSearch.toLowerCase().trim();
    this.filteredCustomers = term
      ? this.customers.filter(c =>
          c.name.toLowerCase().includes(term) ||
          c.phone.includes(term) ||
          c.email.toLowerCase().includes(term)
        )
      : [];
  }

  onSelectProduct(product: Product) {
    this.selectProduct.emit(product);
    this.searchInput = product.name;
    this.filteredProducts = [];
  }

  onSelectCustomer(customer: Customer) {
    this.selectCustomer.emit(customer);
    this.customerSearch = `${customer.name} - ${customer.phone}`;
    this.filteredCustomers = [];
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.product-search-container')) this.filteredProducts = [];
    if (!target.closest('.customer-search-container')) this.filteredCustomers = [];
  }

  // BUTTON ACTIONS
  startNewOrder() {                          // ← RENAMED METHOD (no conflict)
    this.searchInput = '';
    this.customerSearch = '';
    this.filteredProducts = [];
    this.filteredCustomers = [];
    this.newOrder.emit();                   // ← Emit the event
  }

  registerCustomer() {
    this.showRegisterPopup = true;
  }

  openProfile() { console.log('Profile clicked'); }
  editCustomer() { console.log('Edit clicked'); }
  saveCustomer() { console.log('Save clicked'); }
}