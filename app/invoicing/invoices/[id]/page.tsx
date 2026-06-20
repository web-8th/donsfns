import { format } from 'date-fns';
import { Pencil } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import type { Client, Invoice, InvoiceEmailLog } from '@/types/database';
import { SentHistory } from '@/components/invoicing/SentHistory';
import { SendInvoiceButton } from '@/components/invoicing/SendInvoiceButton';
import { Text } from '@/components/Text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { createAdminClient } from '@/utils/supabase/server-admin';

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const [{ data: raw }, { data: logData }] = await Promise.all([
    supabase.from('invoices').select('*, clients(*)').eq('id', id).single(),
    supabase
      .from('invoice_email_log')
      .select('*')
      .eq('invoice_id', id)
      .order('sent_at', { ascending: false }),
  ]);

  if (!raw) notFound();

  const invoice = raw as unknown as Invoice & { clients: Client };
  const client = invoice.clients;
  const logs = (logData ?? []) as unknown as InvoiceEmailLog[];

  return (
    <div className='max-w-4xl space-y-8'>
      {/* Header */}
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <div className='flex items-center gap-3'>
            <Text as='h2' variant='hd-lg'>
              {invoice.invoice_number}
            </Text>
            <Badge
              className='font-mono'
              variant={invoice.status === 'sent' ? 'default' : 'secondary'}
            >
              status: {invoice.status}
            </Badge>
          </div>
          <Text variant='muted' size='sm' className='mt-1'>
            Issued {format(new Date(invoice.issue_date + 'T00:00:00'), 'MMMM d, yyyy')}
          </Text>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' asChild>
            <Link href={`/invoicing/invoices/${id}/edit`}>
              <Pencil />
              Edit
            </Link>
          </Button>
          <SendInvoiceButton
            invoiceId={id}
            recipientEmail={client.email}
            invoiceNumber={invoice.invoice_number}
            status={invoice.status as 'draft' | 'sent'}
          />
        </div>
      </div>

      {/* Client + meta */}
      <div className='grid gap-6 sm:grid-cols-2'>
        <div className='rounded-md border p-4'>
          <Text
            as='p'
            size='xs'
            variant='muted'
            className='mb-2 font-medium uppercase tracking-wide'
          >
            Bill To
          </Text>
          <Text as='p' size='sm' className='font-semibold'>
            {client.name}
          </Text>
          {client.address && (
            <Text as='p' size='sm' variant='muted' className='mt-0.5'>
              {client.address}
            </Text>
          )}
          <Text as='p' size='sm' variant='muted' className='mt-0.5'>
            {client.email}
          </Text>
          {client.phone && (
            <Text as='p' size='sm' variant='muted' className='mt-0.5'>
              {client.phone}
            </Text>
          )}
        </div>
        <div className='rounded-md border p-4'>
          <Text
            as='p'
            size='xs'
            variant='muted'
            className='mb-2 font-medium uppercase tracking-wide'
          >
            Last Sent
          </Text>
          {invoice.sent_at ? (
            <Text as='p' size='sm'>
              {format(new Date(invoice.sent_at), 'MMMM d, yyyy · h:mm a')}
            </Text>
          ) : (
            <Text as='p' size='sm' variant='muted'>
              Not sent yet. Click <span className='font-bold'>Send Invoice</span> above to
              send it.
            </Text>
          )}
        </div>
      </div>

      {/* Line items */}
      <div className='rounded-md border'>
        <div
          className='grid grid-cols-[3fr_1fr_1.5fr_1.5fr] bg-muted/50 px-4 py-2.5 text-xs
            font-medium uppercase tracking-wide text-muted-foreground'
        >
          <Text as='span' size='xs'>Description</Text>
          <Text as='span' size='xs' className='text-right'>Qty</Text>
          <Text as='span' size='xs' className='text-right'>Rate</Text>
          <Text as='span' size='xs' className='text-right'>Amount</Text>
        </div>
        {invoice.line_items.map((item, i) => (
          <div
            key={i}
            className='grid grid-cols-[3fr_1fr_1.5fr_1.5fr] border-t px-4 py-3'
          >
            <Text as='span' size='sm'>{item.description}</Text>
            <Text as='span' size='sm' className='text-right'>{item.quantity}</Text>
            <Text as='span' size='sm' className='text-right'>${item.rate.toFixed(2)}</Text>
            <Text as='span' size='sm' className='text-right font-medium'>
              ${item.amount.toFixed(2)}
            </Text>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className='flex justify-end'>
        <div className='w-64 space-y-2 rounded-md border p-4'>
          <div className='flex justify-between'>
            <Text as='span' size='sm' variant='muted'>Subtotal</Text>
            <Text as='span' size='sm'>${invoice.subtotal.toFixed(2)}</Text>
          </div>
          {invoice.tax_rate > 0 && (
            <div className='flex justify-between'>
              <Text as='span' size='sm' variant='muted'>
                Tax ({(invoice.tax_rate * 100).toFixed(0)}%)
              </Text>
              <Text as='span' size='sm'>${invoice.tax_amount.toFixed(2)}</Text>
            </div>
          )}
          <Separator />
          <div className='flex justify-between font-semibold'>
            <Text as='span' size='sm'>Total</Text>
            <Text as='span' size='sm'>${invoice.total.toFixed(2)}</Text>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className='rounded-md border p-4'>
          <Text
            as='p'
            size='xs'
            variant='muted'
            className='mb-2 font-medium uppercase tracking-wide'
          >
            Notes
          </Text>
          <Text as='p' size='sm' className='whitespace-pre-wrap'>
            {invoice.notes}
          </Text>
        </div>
      )}

      {/* Sent history */}
      <div>
        <Text as='h3' variant='hd-sm' className='mb-4'>
          Send History
        </Text>
        <SentHistory logs={logs} />
      </div>
    </div>
  );
}