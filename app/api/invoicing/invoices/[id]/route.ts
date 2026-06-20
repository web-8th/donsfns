import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import { createAdminClient } from '@/utils/supabase/server-admin';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminClient();
  const [{ data: invoice, error: invErr }, { data: logs }] = await Promise.all([
    supabase.from('invoices').select('*, clients(*)').eq('id', id).single(),
    supabase
      .from('invoice_email_log')
      .select('*')
      .eq('invoice_id', id)
      .order('sent_at', { ascending: false }),
  ]);
  if (invErr) {
    const status = invErr.code === 'PGRST116' ? 404 : 500;
    return NextResponse.json({ error: invErr.message }, { status });
  }
  return NextResponse.json({ invoice, logs: logs ?? [] });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('invoices')
    .update({
      client_id: body.client_id,
      issue_date: body.issue_date,
      line_items: body.line_items,
      subtotal: body.subtotal,
      tax_rate: body.tax_rate,
      tax_amount: body.tax_amount,
      total: body.total,
      notes: body.notes ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath('/invoicing/invoices');
  revalidatePath(`/invoicing/invoices/${id}`);
  return NextResponse.json({});
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: logs } = await supabase
    .from('invoice_email_log')
    .select('pdf_path')
    .eq('invoice_id', id);

  const paths = (logs ?? []).map((l) => l.pdf_path).filter(Boolean) as string[];
  if (paths.length > 0) {
    await supabase.storage.from('donsfns_invoices').remove(paths);
  }

  const { error } = await supabase.from('invoices').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath('/invoicing/invoices');
  return NextResponse.json({});
}
