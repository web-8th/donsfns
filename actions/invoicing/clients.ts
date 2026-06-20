'use server';

import { revalidatePath } from 'next/cache';

import { createAdminClient } from '@/utils/supabase/server-admin';

export async function createClient(data: {
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
}): Promise<{ error?: string }> {
  const supabase = createAdminClient();
  const { error } = await supabase.from('clients').insert(data);
  if (error) return { error: error.message };
  revalidatePath('/invoicing/clients');
  return {};
}

export async function updateClient(
  id: string,
  data: {
    name?: string;
    email?: string;
    phone?: string | null;
    address?: string | null;
  }
): Promise<{ error?: string }> {
  const supabase = createAdminClient();
  const { error } = await supabase.from('clients').update(data).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/invoicing/clients');
  return {};
}

export async function deleteClient(id: string): Promise<{ error?: string }> {
  const supabase = createAdminClient();
  const { error } = await supabase.from('clients').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/invoicing/clients');
  return {};
}
