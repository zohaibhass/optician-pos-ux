import { Injectable, ElementRef } from '@angular/core';
import { BrowserMultiFormatReader, Result } from '@zxing/library';

@Injectable({ providedIn: 'root' })
export class ScannerService {
  public reader = new BrowserMultiFormatReader();
  public cameras: MediaDeviceInfo[] = [];
  public selectedCamera = '';
  private isScanning = false;
  private lastCode = '';
  private cooldown = false;

  async loadCameras() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.cameras = devices.filter(d => d.kind === 'videoinput');
      this.selectedCamera = this.cameras[0]?.deviceId || '';
    } catch (err) {
      console.warn('No cameras', err);
      this.cameras = [];
    }
  }

  // videoRef should be a reference to the video element
  async startScan(videoRef: ElementRef<HTMLVideoElement>, onResult: (code: string) => void) {
    if (this.isScanning) return;
    if (!videoRef) throw new Error('video ref required');

    const constraints: MediaStreamConstraints = {
      video: { deviceId: this.selectedCamera ? { exact: this.selectedCamera } : undefined },
      audio: false
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    videoRef.nativeElement.srcObject = stream;
    await videoRef.nativeElement.play();

    this.isScanning = true;

this.reader.decodeFromVideoDevice(
  this.selectedCamera || null, 
  videoRef.nativeElement, 
  (result: Result | null, err) => {
    if (result && result.getText()) {
      const code = result.getText();
      if (this.cooldown || code === this.lastCode) return;
      this.lastCode = code;
      this.cooldown = true;
      onResult(code);
      setTimeout(() => (this.cooldown = false), 700);
    }

    if (err && !err.message?.includes('NotFoundException')) {
      console.warn('scan error', err);
    }
  }
);
  }

  stopScan() {
    try {
      this.reader.reset();
      this.isScanning = false;
      this.lastCode = '';
    } catch (e) {
      console.warn('stop scan', e);
    }
    // stop media tracks
    // (browser will stop when reader.reset called; but ensure tracks stopped if needed)
  }
}
