import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule
  ],
})
export class PosComponent implements OnInit {
  search = '';
  psearch = '';
  customer: any = null;
  items: any[] = [];
  total = 0;

  // Sample JSON data for testing
  sampleData = {
    customers: [
      {
        customerId: 'cust-1',
        name: 'John Smith',
        phone: '+1234567890',
        balance: 1500,
        email: 'john.smith@email.com'
      },
      {
        customerId: 'cust-2', 
        name: 'Sarah Johnson',
        phone: '+0987654321',
        balance: -250,
        email: 'sarah.j@email.com'
      },
      {
        customerId: 'cust-3',
        name: 'Mike Wilson',
        phone: '+1122334455',
        balance: 3200,
        email: 'mike.wilson@email.com'
      },
      {
        customerId: 'cust-4',
        name: 'Emily Davis',
        phone: '+5566778899',
        balance: 0,
        email: 'emily.davis@email.com'
      }
    ],
    products: [
      {
        productId: 'prod-1',
        name: 'Ray-Ban Aviator Sunglasses',
        price: 199.99,
        sku: 'RB-AVI-001',
        category: 'Sunglasses',
        stock: 25
      },
      {
        productId: 'prod-2',
        name: 'Oakley Holbrook',
        price: 159.50,
        sku: 'OK-HB-002',
        category: 'Sunglasses', 
        stock: 18
      },
      {
        productId: 'prod-3',
        name: 'Contact Lens Solution 300ml',
        price: 12.99,
        sku: 'CL-SOL-003',
        category: 'Accessories',
        stock: 50
      },
      {
        productId: 'prod-4',
        name: 'Designer Optical Frames - Black',
        price: 89.99,
        sku: 'DOF-BLK-004',
        category: 'Frames',
        stock: 12
      },
      {
        productId: 'prod-5',
        name: 'Blue Light Glasses',
        price: 45.00,
        sku: 'BLG-005',
        category: 'Specialty',
        stock: 30
      },
      {
        productId: 'prod-6',
        name: 'Lens Cleaning Kit',
        price: 8.50,
        sku: 'LCK-006',
        category: 'Accessories',
        stock: 100
      },
      {
        productId: 'prod-7',
        name: 'Prescription Sunglasses',
        price: 229.99,
        sku: 'PS-007',
        category: 'Sunglasses',
        stock: 8
      },
      {
        productId: 'prod-8',
        name: 'Kids Glasses Frame',
        price: 65.00,
        sku: 'KGF-008',
        category: 'Frames',
        stock: 15
      }
    ]
  };

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    // Try API first, fall back to sample data
    this.http.get<any>('/sync/download?terminalId=term-1').subscribe(
      (r) => {
        this.items = (r.products || []).map((p: any) => ({
          productId: p.productId,
          name: p.name,
          price: p.price,
          qty: 0,
          sku: p.sku
        }));
      },
      (error) => {
        // Fallback to sample data if API fails
        console.log('API failed, using sample data');
        this.items = this.sampleData.products.map((p: any) => ({
          productId: p.productId,
          name: p.name,
          price: p.price,
          qty: 0,
          sku: p.sku
        }));
      }
    );
  }

  searchCustomer() {
  const term = this.search.trim().toLowerCase();
  if (!term) {
    this.toastr.warning('Please enter a name to search.', 'Search');
    return;
  }

  // Fallback-first approach
  let found = this.sampleData.customers.find(
    (c: any) =>
      c.name.toLowerCase().includes(term) ||
      c.phone.toLowerCase().includes(term)
  );

  if (found) {
    this.customer = found;
    this.toastr.success(`Customer found: ${found.name}`, 'Customer');
  } else {
    this.toastr.error('No customer found!', 'Search');
    this.customer = null;
  }
}

searchProduct() {
  const searchTerm = this.psearch.trim().toLowerCase();
  if (!searchTerm) {
    this.toastr.warning('Please enter product name or SKU.', 'Search');
    return;
  }

  const foundProduct = this.items.find(
    (i) =>
      i.name.toLowerCase().includes(searchTerm) ||
      (i.sku && i.sku.toLowerCase().includes(searchTerm))
  );

  if (foundProduct) {
    foundProduct.qty = (foundProduct.qty || 0) + 1;
    this.recalc();
    this.toastr.success(`${foundProduct.name} added to cart.`, 'Product Added');
    this.psearch = '';
  } else {
    this.toastr.error('Product not found!', 'Search');
  }
}

  increaseQty(index: number) {
    if (this.items[index]) {
      this.items[index].qty = (this.items[index].qty || 0) + 1;
      this.recalc();
    }
  }

  decreaseQty(index: number) {
    if (this.items[index] && this.items[index].qty > 0) {
      this.items[index].qty = Math.max(0, (this.items[index].qty || 0) - 1);
      this.recalc();
    }
  }

  recalc() {
    this.total = this.items.reduce((s, i) => s + i.price * (i.qty || 0), 0);
  }

save() {
  const transaction = {
    localId: 'l-' + Date.now(),
    customerId: this.customer?.customerId,
    customerName: this.customer?.name,
    totalAmount: this.total,
    items: this.items.filter((i) => i.qty > 0),
    timestamp: new Date().toISOString()
  };

  console.log('Saving transaction:', transaction);
  
  this.http.post('/sync/upload', { terminalId: 'term-1', transactions: [transaction] }).subscribe(
    (r) => {
      this.toastr.success('Transaction saved successfully!', 'Success');
      this.clearCart();
    },
    (error) => {
      this.saveToLocalStorage(transaction);
      this.toastr.info('Saved locally — API unavailable', 'Offline Mode');
      this.clearCart();
    }
  );
}

  private saveToLocalStorage(transaction: any) {
    const savedTransactions = JSON.parse(localStorage.getItem('posTransactions') || '[]');
    savedTransactions.push(transaction);
    localStorage.setItem('posTransactions', JSON.stringify(savedTransactions));
  }

  clearCart() {
    this.items.forEach(item => item.qty = 0);
    this.recalc();
  }

syncNow() {
  const localTransactions = JSON.parse(localStorage.getItem('posTransactions') || '[]');
  
  if (localTransactions.length > 0) {
    this.http.post('/sync/upload', { terminalId: 'term-1', transactions: localTransactions }).subscribe(
      (r) => {
        localStorage.removeItem('posTransactions');
        this.toastr.success(`Synced ${localTransactions.length} transactions successfully!`, 'Sync Complete');
      },
      (error) => {
        this.toastr.error(`Sync failed. ${localTransactions.length} transactions pending.`, 'Error');
      }
    );
  } else {
    this.toastr.warning('No pending transactions to sync.', 'Nothing to Sync');
  }
}
  // Helper method to get sample data for testing
  loadSampleData() {
    this.items = this.sampleData.products.map((p: any) => ({
      productId: p.productId,
      name: p.name,
      price: p.price,
      qty: 0,
      sku: p.sku
    }));
  }

}