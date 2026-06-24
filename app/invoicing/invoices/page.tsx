import type { Client, Invoice, InvoiceSnapshot } from '@/types/database';
import { computeIsStale } from '@/lib/invoicing/is-stale';
import { InvoicesTable } from '@/components/invoicing/InvoicesTable';
import { createAdminClient } from '@/utils/supabase/server-admin';

export default async function InvoicesPage() {
  const supabase = createAdminClient();

  const [{ data }, { data: allLogs }] = await Promise.all([
    supabase
      .from('invoices')
      .select('*, clients(*)')
      .order('created_at', { ascending: false }),
    supabase
      .from('invoice_email_log')
      .select('invoice_id, sent_at, recipient_email, snapshot')
      .order('sent_at', { ascending: false }),
  ]);

  // Keep only the latest log per invoice (logs are already desc by sent_at)
  const latestLogMap = new Map<
    string,
    { sent_at: string; recipient_email: string; snapshot: InvoiceSnapshot }
  >();
  for (const log of allLogs ?? []) {
    if (!latestLogMap.has(log.invoice_id)) {
      latestLogMap.set(
        log.invoice_id,
        log as unknown as {
          sent_at: string;
          recipient_email: string;
          snapshot: InvoiceSnapshot;
        }
      );
    }
  }

  const rawInvoices = (data ?? []) as unknown as (Invoice & { clients: Client })[];

  const invoices = rawInvoices.map((inv) => {
    const latestLog = latestLogMap.get(inv.id) ?? null;
    return {
      ...inv,
      isStale: computeIsStale(inv, latestLog?.snapshot ?? null),
      latestLog: latestLog
        ? { sent_at: latestLog.sent_at, recipient_email: latestLog.recipient_email }
        : null,
    };
  });

  return <InvoicesTable invoices={invoices} />;
}
