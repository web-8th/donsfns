import type { InvoiceSnapshot } from '@/types/database';

export function buildInvoiceEmailHtml(snapshot: InvoiceSnapshot): string {
  const { invoice_number, issue_date, total, client, notes } = snapshot;

  const date = new Date(issue_date + 'T00:00:00').toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const notesSection = notes
    ? `
    <div style="border-left:2px solid #d4c9b8;padding-left:1rem;margin-bottom:1.5rem;">
      <p style="font-size:12px;color:#8a7f6e;margin:0 0 4px;font-family:Georgia,serif;text-transform:uppercase;letter-spacing:0.08em;">Notes</p>
      <p style="font-size:14px;color:#3d3126;margin:0;line-height:1.7;font-family:Georgia,serif;">${notes}</p>
    </div>`
    : '';

  return `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;background:#fdf9f4;border:1px solid #d4c9b8;border-radius:4px;overflow:hidden;">
      <div style="background:#3d3126;padding:2rem;text-align:center;">
        <p style="color:#f5ede3;font-size:24px;font-weight:400;margin:0;letter-spacing:0.05em;">Invoice from Don's Fences &amp; Services</p>
        <p style="color:#c4b49e;font-size:13px;margin:6px 0 0;letter-spacing:0.04em;">Enderby, BC · donsfences.ca</p>
      </div>
      <div style="padding:2rem;">
        <p style="font-size:15px;color:#3d3126;margin:0 0 1rem;">Hi ${client.name},</p>
        <p style="font-size:14px;color:#3d3126;line-height:1.7;margin:0 0 1.5rem;">
          Please find attached your invoice <strong>${invoice_number}</strong> dated ${date},
          for a total of <strong>$${total.toFixed(2)} CAD</strong>.
        </p>
        ${notesSection}
        <p style="font-size:14px;color:#8a7f6e;line-height:1.7;margin:0;">
          — Don<br>
          <span style="font-size:12px;">Don's Fences &amp; Services · <a href="https://donsfences.ca" style="color:#8a7f6e;">donsfences.ca</a></span>
        </p>
      </div>
    </div>
  `;
}
