import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { CartService } from '../services/cart.service';
import { ScannerService } from '../services/scanner.service';
import { PosService } from "../services/pos.service";
import { PrintService } from '../services/print.service';

import { CheckoutModalComponent } from '../shared/components/checkout-modal/checkout-modal.component';
import { KeypadComponent } from '../shared/components/keypad-component/keypad.component';
import { ScannerPreviewComponent } from '../shared/components/scanner-preview/scanner-preview.component';
import { ProductSearchComponent } from '../shared/components/product-search/product-search.component';
import { QuantityEditModalComponent } from '../shared/components/quantity-edit/quantity-edit-modal.component';

import { Product } from '../models/product.model';
import { CartItem } from '../models/cart-item.model';
import { ReceiptComponent } from "../shared/components/receipt/receipt";
@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CheckoutModalComponent,
    KeypadComponent,
    ProductSearchComponent,
    QuantityEditModalComponent,
    ReceiptComponent
],
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
})
export class PosComponent implements OnInit, OnDestroy {
  @ViewChild(ScannerPreviewComponent) scannerPreview!: ScannerPreviewComponent;
 @ViewChild(ReceiptComponent) receiptComponent!: ReceiptComponent;
  barcodeInput = '';
  qtyInput = '';
  currentNumericInput = '';
  isInputForBarcode = true;
  showCheckout = false;
  showQtyModal = false;
  editingItemBarcode = '';
  selectedRow: any = null;
  showDiscountPopup = false;
  discountPercent = 0;
  taxPercent = 5; 


  scanningActive = false;
  showReceiptPreview = false;
  discountType: '%' | 'amount' = '%';
  discountValue: number = 0;
  showResetPopup = false;
  constructor(
    public cart: CartService,
    public pos: PosService,
    public scanner: ScannerService,
    private printService: PrintService,
    private toastr: ToastrService
  ) {}

  async ngOnInit() {
    this.pos.generateNewBill();
    this.scanner.loadCameras().catch(() => {});
  }

  ngOnDestroy() {
    this.scanner.stopScan();
  }

  onKeypadClick(value: string | number) {
    if (typeof value === 'number' || value === '.' || value === '0' || value === '00') {
      this.currentNumericInput += value.toString();
      this.updateActiveInput();
      return;
    }

    switch (value) {
      case 'ENTER': this.handleEnter(); break;
      case 'PAY': this.openCheckout(); break;
      case 'HOLD': this.holdTransaction(); break;
      case 'RECALL': this.recallTransaction(); break;
      case '+': this.toggleInputMode(); break;
      case '-': this.removeLastCharacter(); break;
      case 'OPTIONS': this.toastr.info('Options menu (not implemented)'); break;
      case 'EXIT': this.exitSystem(); break;
    }
  }

  updateActiveInput() {
    if (this.isInputForBarcode) this.barcodeInput = this.currentNumericInput;
    else this.qtyInput = this.currentNumericInput;
  }

  toggleInputMode() {
    this.isInputForBarcode = !this.isInputForBarcode;
    this.currentNumericInput = '';
    this.barcodeInput = this.isInputForBarcode ? this.currentNumericInput : this.barcodeInput;
  }

  removeLastCharacter() {
    this.currentNumericInput = this.currentNumericInput.slice(0, -1);
    this.updateActiveInput();
  }

  handleEnter() {
    if (this.isInputForBarcode) {
      this.addProductFromBarcode();
    } else {
      this.setQuantity();
    }
  }

  addProductFromBarcode() {
    if (!this.barcodeInput.trim()) {
      this.toastr.warning('Please enter barcode', 'Scan');
      return;
    }
    const qty = this.qtyInput ? Number(this.qtyInput) : 1;
    const added = this.pos.addByBarcode(this.barcodeInput.trim(), qty);

    if (!added) {
      this.toastr.error('Product not found', 'Error');
      return;
    }

    this.toastr.success('Product added', 'Cart');
    this.resetInputs();
  }

  setQuantity() {
    if (!this.qtyInput.trim()) {
      this.toastr.warning('Please enter quantity', 'Quantity');
      return;
    }
    const q = Number(this.qtyInput);
    if (!Number.isFinite(q) || q <= 0) {
      this.toastr.error('Please enter valid quantity', 'Error');
      return;
    }
    this.toastr.info(`Quantity set to ${q}`, 'Quantity');
    this.currentNumericInput = '';
    this.qtyInput = '';
  }

  resetInputs() {
    this.barcodeInput = '';
    this.qtyInput = '';
    this.currentNumericInput = '';
    this.isInputForBarcode = true;
  }

  async startScanner() {
    if (this.scanningActive) return;
    try {
      await this.scanner.startScan(this.scannerPreview.videoElementRef, (code) => this.onBarcodeScanned(code));
      this.scanningActive = true;
    } catch (err) {
      console.error(err);
      this.toastr.error('Cannot start scanner', 'Scanner');
    }
  }

  stopScanner() {
    this.scanner.stopScan();
    this.scanningActive = false;
  }

  onBarcodeScanned(code: string) {
    this.barcodeInput = code;
    this.addProductFromBarcode();
    this.flashScanAnimation();
    this.toastr.success(`Scanned ${code}`, 'Scan');
  }

  flashScanAnimation() {
    this.scannerPreview.flash();
  }

  onCameraChange() {
    if (this.scanningActive) {
      this.stopScanner();
      setTimeout(() => this.startScanner(), 250);
    }
  }

  editQuantity(barcode: string) {
    this.editingItemBarcode = barcode;
    this.showQtyModal = true;
  }

  onQtyModalSave(barcode: string, qty: number) {
    this.cart.updateQty(barcode, qty);
    this.showQtyModal = false;
    this.toastr.success('Quantity updated', 'Cart');
  }

  removeItem(barcode: string) {
    this.cart.removeItem(barcode);
    this.toastr.info('Item removed', 'Cart');
  }

  holdTransaction() {
    this.pos.holdCurrentTransaction();
    this.cart.clear();
    this.toastr.success('Transaction held', 'Hold');
  }

  recallTransaction() {
    const recalled = this.pos.recallLastHeld();
    if (!recalled) {
      this.toastr.warning('No held transactions', 'Recall');
      return;
    }
    this.toastr.success('Transaction recalled', 'Recall');
  }
  openCheckout() {
    if (this.cart.items.length === 0) {
      this.toastr.warning('Cart is empty', 'Checkout');
      return;
    }
    this.showCheckout = true;
  }

async confirmCheckout(printMethod: 'websocket' | 'window') {
  if (!this.receiptComponent) return;

  const html = this.receiptComponent.buildHtml();

  try {
    if (printMethod === 'websocket') {
      await this.printService.printEscPosViaWebSocket(html);
    } else {
      this.printService.printViaWindow(html);
    }

    this.pos.finalizeSale();
    this.cart.clear();
    this.showCheckout = false;
    this.showReceiptPreview = true;

    this.toastr.success('Checkout complete', 'Success');
  } catch (err) {
    console.error(err);
    this.toastr.error('Print failed, falling back to browser print', 'Print');
    this.printService.printViaWindow(html);
    this.pos.finalizeSale();
    this.cart.clear();
    this.showCheckout = false;
    this.showReceiptPreview = true;
  }
}

  exitSystem() {
    if (confirm('Are you sure you want to exit?')) {
      this.stopScanner();
    }
  }


addProductByObject(product: Product) {
  const qty = 1;
  const item: CartItem = {
    id:product.id,
    barcode: product.barcode,
    name: product.name,
    qty: qty,
    unit: 'PCS',
    price: product.price,
    total: qty * product.price
  };


this.cart.addItem(item);
}
openDiscountPopup() {
  if (!this.selectedRow) return;
  this.showDiscountPopup = true;
}

applyOrderDiscount() {
    // Show popup if there are item-level discounts
    if (this.pos.hasItemLevelDiscounts()) {
      this.showResetPopup = true;
    } else {
      this.applyDiscount();
    }
  }

  confirmReset() {
    // Reset item-level discounts
    this.pos.resetItemDiscounts();
    this.showResetPopup = false;
    this.applyDiscount();
  }

  private applyDiscount() {
    this.pos.applyOrderDiscount(this.discountValue, this.discountType);
  }
  updateDiscount(item: any) {
  const input = item.discountInput?.toString().trim() || "";

  const total = item.price * item.qty;

  if (input.endsWith('%')) {
    const percent = parseFloat(input.replace('%', '')) || 0;
    item.totalDiscount = (total * percent) / 100;
  } else {
    const amount = parseFloat(input) || 0;
    item.totalDiscount = amount;
  }

  item.totalAfterDiscount = total - item.totalDiscount;

  if (item.totalAfterDiscount < 0) {
    item.totalAfterDiscount = 0;
  }
}
onNewOrder() {
  this.cart.clear(); // This now correctly emits [] and updates the UI

  this.discountValue = 0;
  this.discountType = '%';
  this.showQtyModal = false;
  this.showCheckout = false;
  this.showReceiptPreview = false;

  // Optional: fresh bill number
  const now = new Date();
  this.pos.invoice.billNo = 'B' + now.getTime().toString().slice(-8);
  this.pos.invoice.dateString = now.toLocaleDateString('en-GB');
  this.pos.invoice.timeString = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  console.log('New Order – Cart & screen cleared!');
}
}
