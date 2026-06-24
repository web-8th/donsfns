import type { InvoiceSnapshot } from '@/types/database';

const brand = {
  dark: '#3d3126',
  mid: '#8a7f6e',
  light: '#f5ede3',
  cream: '#fdf9f4',
  border: '#d4c9b8',
};

function fmt(n: number) {
  return `$${n.toFixed(2)}`;
}

function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function buildInvoiceEmailHtml(snapshot: InvoiceSnapshot): string {
  const {
    invoice_number,
    issue_date,
    line_items,
    subtotal,
    tax_rate,
    tax_amount,
    total,
    notes,
    client,
  } = snapshot;

  const taxPct = tax_rate ? (tax_rate * 100).toFixed(0) : '0';

  const lineItemRows = line_items
    .map(
      (item, i) => `
      <tr style="background:${i % 2 === 1 ? brand.light : brand.cream};">
        <td style="padding:9px 12px;font-size:13px;color:${brand.dark};border-bottom:1px solid ${brand.border};">${item.description}</td>
        <td style="padding:9px 12px;font-size:13px;color:${brand.dark};text-align:right;border-bottom:1px solid ${brand.border};">${item.quantity}</td>
        <td style="padding:9px 12px;font-size:13px;color:${brand.dark};text-align:right;border-bottom:1px solid ${brand.border};">${fmt(item.rate)}</td>
        <td style="padding:9px 12px;font-size:13px;color:${brand.dark};text-align:right;border-bottom:1px solid ${brand.border};">${fmt(item.amount)}</td>
      </tr>`
    )
    .join('');

  const taxRow =
    tax_rate != null && tax_rate > 0
      ? `<tr>
          <td colspan="2" style="padding:4px 0;font-size:12px;color:${brand.mid};">Tax (${taxPct}%)</td>
          <td style="padding:4px 0;font-size:12px;color:${brand.dark};text-align:right;font-weight:bold;">${fmt(tax_amount)}</td>
        </tr>`
      : '';

  const notesSection = notes
    ? `<div style="margin-top:28px;padding:14px;border:1px solid ${brand.border};background:${brand.light};">
        <p style="margin:0 0 6px;font-size:10px;font-weight:bold;color:${brand.mid};text-transform:uppercase;letter-spacing:0.08em;">Notes</p>
        <p style="margin:0;font-size:13px;color:${brand.dark};line-height:1.6;">${notes}</p>
      </div>`
    : '';

  const clientAddress = client.address
    ? `<p style="margin:2px 0;font-size:12px;color:${brand.mid};">${client.address}</p>`
    : '';
  const clientPhone = client.phone
    ? `<p style="margin:2px 0;font-size:12px;color:${brand.mid};">${client.phone}</p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:20px 0;background:#ede8e0;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0"
               style="max-width:600px;background:${brand.cream};border:1px solid ${brand.border};border-radius:12px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:${brand.dark};padding:28px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:20px;font-weight:bold;color:${brand.light};letter-spacing:0.04em;">Don's Fences &amp; Services</p>
                    <p style="margin:3px 0 0;font-size:11px;color:${brand.mid};">
                      <a href="https://maps.google.com/?q=67+Enderby+Mabel+Lk+Rd+Enderby+BC+V0E+1V4" style="color:${brand.mid};text-decoration:underline;">67 Enderby Mabel Lk Rd, Enderby, BC V0E 1V4</a>
                    </p>
                    <p style="margin:2px 0 0;font-size:11px;color:${brand.mid};">
                      <a href="https://donsfences.ca" style="color:${brand.mid};text-decoration:underline;">donsfences.ca</a>
                    </p>
                  </td>
                  <td style="text-align:right;vertical-align:top;">
                    <p style="margin:0;font-size:26px;font-weight:bold;color:${brand.light};letter-spacing:0.08em;">INVOICE</p>
                    <p style="margin:4px 0 0;font-size:12px;color:${brand.mid};">${invoice_number}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Bill To + Date -->
          <tr>
            <td style="padding:24px 32px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align:top;">
                    <p style="margin:0 0 6px;font-size:10px;font-weight:bold;color:${brand.mid};text-transform:uppercase;letter-spacing:0.08em;">Bill To</p>
                    <p style="margin:0 0 3px;font-size:14px;font-weight:bold;color:${brand.dark};">${client.name}</p>
                    ${clientAddress}
                    <p style="margin:2px 0;font-size:12px;color:${brand.mid};">${client.email}</p>
                    ${clientPhone}
                  </td>
                  <td style="text-align:right;vertical-align:top;">
                    <p style="margin:0 0 3px;font-size:10px;color:${brand.mid};letter-spacing:0.04em;">Issue Date</p>
                    <p style="margin:0;font-size:13px;font-weight:bold;color:${brand.dark};">${fmtDate(issue_date)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Line Items -->
          <tr>
            <td style="padding:0 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:2px;overflow:hidden;">
                <thead>
                  <tr style="background:${brand.dark};">
                    <th style="padding:9px 12px;font-size:10px;font-weight:bold;color:${brand.light};text-align:left;text-transform:uppercase;letter-spacing:0.06em;">Description</th>
                    <th style="padding:9px 12px;font-size:10px;font-weight:bold;color:${brand.light};text-align:right;text-transform:uppercase;letter-spacing:0.06em;">Qty</th>
                    <th style="padding:9px 12px;font-size:10px;font-weight:bold;color:${brand.light};text-align:right;text-transform:uppercase;letter-spacing:0.06em;">Rate</th>
                    <th style="padding:9px 12px;font-size:10px;font-weight:bold;color:${brand.light};text-align:right;text-transform:uppercase;letter-spacing:0.06em;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${lineItemRows}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Totals -->
          <tr>
            <td style="padding:16px 32px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="60%"></td>
                  <td width="40%">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0"
                           style="border-top:1px solid ${brand.border};padding-top:12px;">
                      <tr>
                        <td style="padding:4px 0;font-size:12px;color:${brand.mid};">Subtotal</td>
                        <td style="padding:4px 0;font-size:12px;color:${brand.dark};text-align:right;font-weight:bold;">${fmt(subtotal)}</td>
                      </tr>
                      ${taxRow}
                      <tr>
                        <td colspan="2" style="padding:0;">
                          <div style="border-top:1px solid ${brand.dark};margin:8px 0;"></div>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size:14px;font-weight:bold;color:${brand.dark};">Total Due</td>
                        <td style="font-size:14px;font-weight:bold;color:${brand.dark};text-align:right;">${fmt(total)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Notes -->
          ${
            notesSection
              ? `<tr><td style="padding:0 32px 16px;">${notesSection}</td></tr>`
              : ''
          }

          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;border-top:1px solid ${brand.border};margin-top:28px;text-align:center;">
              <p style="margin:0;font-size:11px;color:${brand.mid};">
                Don's Fences &amp; Services &middot;
                <a href="https://maps.google.com/?q=67+Enderby+Mabel+Lk+Rd+Enderby+BC+V0E+1V4" style="color:${brand.mid};text-decoration:underline;">67 Enderby Mabel Lk Rd, Enderby, BC V0E 1V4</a>
                &middot; <a href="https://donsfences.ca" style="color:${brand.mid};text-decoration:underline;">donsfences.ca</a>
                &middot; Thank you for your business
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
