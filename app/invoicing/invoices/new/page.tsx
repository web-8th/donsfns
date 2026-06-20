import type { Client } from '@/types/database';
import { InvoiceForm } from '@/components/invoicing/InvoiceForm';
import { Text } from '@/components/Text';
import { createAdminClient } from '@/utils/supabase/server-admin';

export default async function NewInvoicePage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('clients')
    .select('*')
    .order('name', { ascending: true });

  const clients = (data ?? []) as Client[];

  return (
    <div className='max-w-4xl'>
      <Text as='h2' variant='hd-md' className='mb-6'>
        New Invoice
      </Text>
      <InvoiceForm clients={clients} />
    </div>
  );
}
