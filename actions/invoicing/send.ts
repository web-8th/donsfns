'use server';

import { renderToBuffer, type DocumentProps } from '@react-pdf/renderer';
import { createElement, type ReactElement } from 'react';
import { Resend } from 'resend';

import { revalidatePath } from 'next/cache';

import { buildInvoiceEmailHtml } from '@/lib/invoicing/email';
import type { Client, Invoice, InvoiceSnapshot, LineItem } from '@/types/database';
import { createAdminClient } from '@/utils/supabase/server-admin';

import { InvoicePDF } from '@/components/invoicing/InvoicePDF';

export async function sendInvoice(
  invoiceId: string
): Promise<{ error?: string }> {
  const supabase = createAdminClient();

  const { data: raw, error: invErr } = await supabase
    .from('invoices')
    .select('*, clients(*)')
    .eq('id', invoiceId)
    .single();

  if (invErr || !raw) return { error: invErr?.message ?? 'Invoice not found' };

  const invoice = raw as unknown as Invoice & { clients: Client };
  const client = invoice.clients;
  const lineItems = invoice.line_items as unknown as LineItem[];

  const snapshot: InvoiceSnapshot = {
    invoice_number: invoice.invoice_number,
    issue_date: invoice.issue_date,
    subtotal: invoice.subtotal,
    tax_rate: invoice.tax_rate,
    tax_amount: invoice.tax_amount,
    total: invoice.total,
    notes: invoice.notes,
    line_items: lineItems,
    client: {
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
    },
  };

  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await renderToBuffer(
      createElement(InvoicePDF, { snapshot }) as ReactElement<DocumentProps>
    );
  } catch (e) {
    return { error: `PDF generation failed: ${(e as Error).message}` };
  }

  const filePath = `invoices/${invoice.invoice_number}_${Date.now()}.pdf`;
  const { error: uploadErr } = await supabase.storage
    .from('donsfns_invoices')
    .upload(filePath, pdfBuffer, { contentType: 'application/pdf', upsert: false });

  if (uploadErr) return { error: `Storage upload failed: ${uploadErr.message}` };

  const resend = new Resend(process.env.RESEND_API_KEY);
  const FROM_EMAIL = process.env.FROM_EMAIL ?? 'donsfences@web8th.com';

  const { data: emailData, error: emailErr } = await resend.emails.send({
    from: `Don's Fences & Services <${FROM_EMAIL}>`,
    to: client.email,
    subject: `Invoice ${invoice.invoice_number} from Don's Fences & Services`,
    html: buildInvoiceEmailHtml(snapshot),
    attachments: [
      {
        filename: `${invoice.invoice_number}.pdf`,
        content: pdfBuffer,
      },
    ],
  });

  if (emailErr) return { error: `Email send failed: ${emailErr.message}` };

  const now = new Date().toISOString();

  await supabase
    .from('invoices')
    .update({ status: 'sent', sent_at: now, updated_at: now })
    .eq('id', invoiceId);

  await supabase.from('invoice_email_log').insert({
    invoice_id: invoiceId,
    sent_at: now,
    resend_message_id: emailData?.id ?? null,
    recipient_email: client.email,
    snapshot,
    pdf_path: filePath,
    status: 'sent',
  });

  revalidatePath(`/invoicing/invoices/${invoiceId}`);
  revalidatePath('/invoicing/invoices');

  return {};
}

export async function getSignedPdfUrl(
  pdfPath: string
): Promise<{ url?: string; error?: string }> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from('donsfns_invoices')
    .createSignedUrl(pdfPath, 3600);
  if (error) return { error: error.message };
  return { url: data.signedUrl };
}
