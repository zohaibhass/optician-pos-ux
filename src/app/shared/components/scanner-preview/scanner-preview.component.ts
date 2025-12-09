import { Component, ElementRef, EventEmitter, input, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ScannerService } from '../../../services/scanner.service';

@Component({
  selector: 'app-scanner-preview',
  standalone: true,
  templateUrl: "./scanner-preview.html",
  styleUrls: ['./scanner-preview.html']
})
export class ScannerPreviewComponent implements OnInit {
  @ViewChild('video', { static: true }) video!: ElementRef<HTMLVideoElement>;
onScan = input.required<(code: string) => void>();

  flashVisible = false;

  constructor(public scanner: ScannerService) {}

  ngOnInit() {
  }

  get videoElementRef() {
    return this.video;
  }

  flash() {
    this.flashVisible = true;
    setTimeout(() => this.flashVisible = false, 300);
  }
}
