import { redirect } from 'next/navigation';

import { InvoicingNav } from '@/components/invoicing/InvoicingNav';
import { Text } from '@/components/Text';
import { createClient } from '@/utils/supabase/server';

export default async function InvoicingLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/');

  return (
    <div className='mx-auto max-w-7xl px-4 nb-padding sm:px-6 lg:px-8'>
      <div className='mb-6'>
        <Text as='h1' variant='hd-xl'>
          Invoicing
        </Text>
        <Text variant='muted' size='sm' className='mt-1'>
          Don's Fences & Services — internal billing tool
        </Text>
      </div>
      <InvoicingNav />
      {children}
    </div>
  );
}
