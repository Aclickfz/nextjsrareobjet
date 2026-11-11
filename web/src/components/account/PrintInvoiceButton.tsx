'use client';

export function PrintInvoiceButton() {
  return (
    <button type="button" className="order-invoice__print" onClick={() => window.print()}>
      Print
    </button>
  );
}
