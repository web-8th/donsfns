import type { Client } from '@/types/database';
import { ClientsTable } from '@/components/invoicing/ClientsTable';
import { createAdminClient } from '@/utils/supabase/server-admin';

export default async function ClientsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('clients')
    .select('*')
    .order('name', { ascending: true });

  const clients = (data ?? []) as Client[];

  return <ClientsTable clients={clients} />;
}
