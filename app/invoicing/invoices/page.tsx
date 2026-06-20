import type { Client, Invoice } from '@/types/database';
import { InvoicesTable } from '@/components/invoicing/InvoicesTable';
import { createAdminClient } from '@/utils/supabase/server-admin';

export default async function InvoicesPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('invoices')
    .select('*, clients(*)')
    .order('created_at', { ascending: false });

  const invoices = (data ?? []) as unknown as (Invoice & { clients: Client })[];

  return <InvoicesTable invoices={invoices} />;
}
