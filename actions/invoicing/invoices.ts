'use server';

import { revalidatePath } from 'next/cache';

import type { LineItem } from '@/types/database';
import { createAdminClient } from '@/utils/supabase/server-admin';

interface InvoicePayload {
  client_id: string;
  issue_date: string;
  line_items: LineItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes?: string | null;
}

export async function getNextInvoiceNumber(): Promise<string> {
  const supabase = createAdminClient();
  const year = new Date().getFullYear();
  const { data } = await supabase
    .from('invoices')
    .select('invoice_number')
    .like('invoice_number', `INV-${year}-%`)
    .order('invoice_number', { ascending: false })
    .limit(1);

  const last = (data as { invoice_number: string }[] | null)?.[0]?.invoice_number;
  const seq = last ? parseInt(last.split('-')[2] ?? '0') + 1 : 1;
  return `INV-${year}-${String(seq).padStart(3, '0')}`;
}

export async function createInvoice(
  data: InvoicePayload
): Promise<{ id?: string; error?: string }> {
  const supabase = createAdminClient();
  const invoice_number = await getNextInvoiceNumber();

  const { data: row, error } = await supabase
    .from('invoices')
    .insert({
      ...data,
      invoice_number,
      line_items: data.line_items,
    })
    .select('id')
    .single();

  if (error) return { error: error.message };
  revalidatePath('/invoicing/invoices');
  return { id: (row as { id: string }).id };
}

export async function updateInvoice(
  id: string,
  data: InvoicePayload
): Promise<{ error?: string }> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('invoices')
    .update({
      ...data,
      line_items: data.line_items,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/invoicing/invoices');
  revalidatePath(`/invoicing/invoices/${id}`);
  return {};
}

export async function deleteInvoice(id: string): Promise<{ error?: string }> {
  const supabase = createAdminClient();
  const { error } = await supabase.from('invoices').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/invoicing/invoices');
  return {};
}
