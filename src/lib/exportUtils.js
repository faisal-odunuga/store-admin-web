import { formatCurrency, formatDate } from './utils';

/**
 * Download data as a CSV file.
 * @param {string} filename - Name of the file (without extension)
 * @param {string[]} headers - Column header labels
 * @param {string[][]} rows - Array of row arrays (each cell is a string)
 */
export function exportToCSV(filename, headers, rows) {
  const escape = (val) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent = [
    headers.map(escape).join(','),
    ...rows.map((row) => row.map(escape).join(',')),
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Open a styled print window with the given HTML content.
 * @param {string} htmlBody - Inner HTML body content
 * @param {string} title - Document title
 */
export function printContent(htmlBody, title = 'Print') {
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; padding: 40px; font-size: 13px; line-height: 1.5; }
        .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #e5e7eb; padding-bottom: 24px; }
        .invoice-header h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; }
        .invoice-header .meta { text-align: right; color: #6b7280; font-size: 12px; }
        .invoice-header .meta strong { color: #1a1a1a; display: block; font-size: 14px; }
        .section { margin-bottom: 28px; }
        .section-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af; margin-bottom: 8px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px; }
        .info-box { background: #f9fafb; padding: 16px; border-radius: 8px; }
        .info-box h4 { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af; margin-bottom: 4px; }
        .info-box p { font-weight: 600; font-size: 13px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        th { background: #f3f4f6; text-align: left; padding: 10px 14px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #6b7280; border-bottom: 1px solid #e5e7eb; }
        td { padding: 12px 14px; border-bottom: 1px solid #f3f4f6; font-size: 13px; }
        .text-right { text-align: right; }
        .totals { width: 320px; margin-left: auto; }
        .totals .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #6b7280; }
        .totals .row.grand { font-size: 18px; font-weight: 800; color: #1a1a1a; border-top: 2px solid #1a1a1a; padding-top: 12px; margin-top: 8px; }
        .footer { margin-top: 48px; text-align: center; color: #9ca3af; font-size: 11px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      ${htmlBody}
      <script>
        window.onload = function() {
          setTimeout(function() { window.print(); }, 300);
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

/**
 * Generate a printable invoice HTML string from an order object.
 * @param {object} order
 * @returns {string} HTML string
 */
export function generateInvoiceHTML(order) {
  const items = order.items || order.orderItems || [];
  const customerName = order.user?.name || 'Guest Customer';
  const customerEmail = order.user?.email || 'N/A';

  const itemRows = items
    .map((item) => {
      const unitPrice = item.sellingPrice ?? item.price ?? 0;
      return `
    <tr>
      <td>${item.product?.name || 'Unknown Product'}</td>
      <td>${item.product?.sku || '—'}</td>
      <td class="text-right">${item.quantity}</td>
      <td class="text-right">${formatCurrency(unitPrice)}</td>
      <td class="text-right"><strong>${formatCurrency(unitPrice * item.quantity)}</strong></td>
    </tr>
  `;
    })
    .join('');

  const subtotal = order.subtotal || order.totalAmount;

  return `
    <div class="invoice-header">
      <div>
        <h1>INVOICE</h1>
        <p style="color: #6b7280; margin-top: 4px;">Order #${order.orderNumber}</p>
      </div>
      <div class="meta">
        <strong>Date Issued</strong>
        ${formatDate(order.createdAt)}
      </div>
    </div>

    <div class="info-grid">
      <div class="info-box">
        <h4>Customer</h4>
        <p>${customerName}</p>
        <p style="font-size: 12px; color: #6b7280; font-weight: 400;">${customerEmail}</p>
      </div>
      <div class="info-box">
        <h4>Order Status</h4>
        <p>${order.status}</p>
        <p style="font-size: 12px; color: #6b7280; font-weight: 400;">Payment: ${order.paymentStatus}</p>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Items</div>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>SKU</th>
            <th class="text-right">Qty</th>
            <th class="text-right">Unit Price</th>
            <th class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>
    </div>

    <div class="totals">
      <div class="row"><span>Subtotal</span><span>${formatCurrency(subtotal)}</span></div>
      ${order.discountAmount > 0 ? `<div class="row"><span>Discount</span><span>-${formatCurrency(order.discountAmount)}</span></div>` : ''}
      ${order.taxAmount > 0 ? `<div class="row"><span>Tax</span><span>${formatCurrency(order.taxAmount)}</span></div>` : ''}
      <div class="row"><span>Shipping</span><span>${order.shippingFee > 0 ? formatCurrency(order.shippingFee) : 'FREE'}</span></div>
      <div class="row grand"><span>Total</span><span>${formatCurrency(order.totalAmount)}</span></div>
    </div>

    <div class="footer">
      Thank you for your business. &bull; Invoice generated on ${new Date().toLocaleDateString()}
    </div>
  `;
}

/**
 * Generate a print-friendly HTML table.
 * @param {string} title - Table title
 * @param {string[]} headers - Column header labels
 * @param {string[][]} rows - Array of row arrays
 * @returns {string} HTML string
 */
export function generateTableHTML(title, headers, rows) {
  const headerCells = headers.map((h) => `<th>${h}</th>`).join('');
  const bodyRows = rows
    .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`)
    .join('');

  return `
    <div class="invoice-header">
      <div>
        <h1>${title}</h1>
        <p style="color: #6b7280; margin-top: 4px;">${rows.length} records &bull; Exported ${new Date().toLocaleDateString()}</p>
      </div>
    </div>
    <table>
      <thead><tr>${headerCells}</tr></thead>
      <tbody>${bodyRows}</tbody>
    </table>
    <div class="footer">
      Generated on ${new Date().toLocaleString()}
    </div>
  `;
}
