import { Injectable } from '@angular/core';

/**
 * PrintService
 * - printEscPosViaWebSocket(html) : encodes the HTML into ESC/POS and sends bytes to local WebSocket print server
 * - printViaWindow(html) : fallback to window.print()
 *
 * Note: For ESC/POS printing, you need a small server that accepts WebSocket connections and sends raw bytes to the printer.
 * Example server could be Node.js with 'ws' and 'escpos' libraries.
 */
@Injectable({ providedIn: 'root' })
export class PrintService {
  // WebSocket endpoint of the local print server (adjust to your environment)
  private wsUrl = 'ws://localhost:8181/print';

  async printEscPosViaWebSocket(html: string) {
    // VERY simple converter: we send HTML as text to the print server which must convert to ESC/POS.
    // For production, better encode into actual ESC/POS commands (paper cut, encoding, align, bold).
    return new Promise<void>((resolve, reject) => {
      try {
        const ws = new WebSocket(this.wsUrl);
        ws.onopen = () => {
          // wrapper message - server responsibilities: convert html to ESC/POS and print
          ws.send(JSON.stringify({ type: 'print', format: 'html', payload: html }));
        };
        ws.onmessage = (ev) => {
          const msg = JSON.parse(ev.data);
          if (msg.status === 'ok') {
            ws.close();
            resolve();
          } else {
            ws.close();
            reject(new Error(msg.error || 'print error'));
          }
        };
        ws.onerror = (err) => {
          reject(err);
        };
        // timeout
        setTimeout(() => reject(new Error('Print timeout')), 8000);
      } catch (e) {
        reject(e);
      }
    });
  }

  printViaWindow(html: string) {
    const w = window.open('', '_blank', 'width=400,height=600');
    if (!w) throw new Error('Pop-up blocked');
    w.document.write(`<html><head><title>Receipt</title></head><body>${html}</body></html>`);
    w.document.close();
    w.focus();
    // Give the popup a moment to render
    setTimeout(() => {
      w.print();
      w.close();
    }, 600);
  }
}
