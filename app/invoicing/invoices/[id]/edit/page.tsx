import { notFound } from 'next/navigation';

import type { Client, Invoice } from '@/types/database';
import { InvoiceForm } from '@/components/invoicing/InvoiceForm';
import { Text } from '@/components/Text';
import { createAdminClient } from '@/utils/supabase/server-admin';

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const [{ data: raw }, { data: clientData }] = await Promise.all([
    supabase.from('invoices').select('*').eq('id', id).single(),
    supabase.from('clients').select('*').order('name', { ascending: true }),
  ]);

  if (!raw) notFound();

  const invoice = raw as unknown as Invoice;
  const clients = (clientData ?? []) as Client[];

  return (
    <div className='max-w-4xl'>
      <Text variant='hd-md' className='mb-6 flex items-center gap-2'>
        Edit{' '}
        <Text variant='hd-md' className='font-mono'>
          {invoice.invoice_number}
        </Text>
      </Text>
      <InvoiceForm clients={clients} invoice={invoice} />
    </div>
  );
}
