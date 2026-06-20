'use client';

import { format } from 'date-fns';
import { Download, FileText } from 'lucide-react';
import { useState } from 'react';

import type { InvoiceEmailLog, InvoiceSnapshot } from '@/types/database';
import { Text } from '@/components/Text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export function SentHistory({ logs }: { logs: InvoiceEmailLog[] }) {
  const [snapshot, setSnapshot] = useState<InvoiceSnapshot | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  function openSnapshot(log: InvoiceEmailLog) {
    const snap = log.snapshot as unknown as InvoiceSnapshot;
    setSnapshot(snap);
  }

  async function downloadPdf(log: InvoiceEmailLog) {
    if (!log.pdf_path || downloadingId === log.id) return;
    setDownloadingId(log.id);
    try {
      const res = await fetch(
        `/api/invoicing/invoices/${log.invoice_id}/pdf-url?pdf_path=${encodeURIComponent(log.pdf_path!)}`
      );
      const { url, error } = await res.json();
      if (error || !url) {
        toast.error('Something went wrong. Please try again or refresh.');
        return;
      }
      window.open(url, '_blank');
    } finally {
      setDownloadingId(null);
    }
  }

  if (logs.length === 0) {
    return (
      <Text size='sm' variant='muted'>
        No sends yet. Use the <span className='font-bold'>Send Invoice</span> button above
        to email this invoice.
      </Text>
    );
  }

  return (
    <>
      <div className='space-y-3'>
        {logs.map((log, i) => (
          <div key={log.id} className='flex gap-3'>
            <div className='mt-1 flex flex-col items-center'>
              <div className='h-2 w-2 rounded-full bg-foreground' />
              {i < logs.length - 1 && <div className='mt-1 w-px flex-1 bg-border' />}
            </div>
            <div className='flex-1 rounded-md border p-3'>
              <div className='flex flex-wrap items-start justify-between gap-2'>
                <div>
                  <Text
                    as='p'
                    size='sm'
                    className='font-medium flex flex-wrap items-center gap-1'
                  >
                    Sent to {log.recipient_email}
                    <Badge variant='secondary' className='font-mono'>
                      status: {log.status}
                    </Badge>
                  </Text>
                  <Text as='p' size='xs' variant='muted'>
                    {format(new Date(log.sent_at), 'MMM d, yyyy · h:mm a')}
                  </Text>
                </div>
                <div className='flex items-center gap-2'>
                  <Button variant='outline' size='sm' onClick={() => openSnapshot(log)}>
                    <FileText />
                    View snapshot
                  </Button>
                  {log.pdf_path && (
                    <Button
                      variant='outline'
                      size='sm'
                      disabled={downloadingId === log.id}
                      onClick={() => downloadPdf(log)}
                    >
                      {downloadingId === log.id ? <Spinner /> : <Download />}
                      PDF
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!snapshot} onOpenChange={(o) => !o && setSnapshot(null)}>
        <DialogContent className='max-h-[80vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Invoice Snapshot — {snapshot?.invoice_number}</DialogTitle>
          </DialogHeader>
          {snapshot && (
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-2'>
                <Text as='span' size='sm' variant='muted'>
                  Issue Date
                </Text>
                <Text as='span' size='sm'>
                  {snapshot.issue_date}
                </Text>
                <Text as='span' size='sm' variant='muted'>
                  Client
                </Text>
                <Text as='span' size='sm'>
                  {snapshot.client.name}
                </Text>
                <Text as='span' size='sm' variant='muted'>
                  Email
                </Text>
                <Text as='span' size='sm'>
                  {snapshot.client.email}
                </Text>
              </div>
              <Separator />
              <div className='rounded-md border'>
                <div
                  className='grid grid-cols-[3fr_1fr_1.5fr_1.5fr] bg-muted/50 px-3 py-2
                    text-xs font-medium uppercase tracking-wide text-muted-foreground'
                >
                  <Text as='span' size='xs'>
                    Description
                  </Text>
                  <Text as='span' size='xs' className='text-right'>
                    Qty
                  </Text>
                  <Text as='span' size='xs' className='text-right'>
                    Rate
                  </Text>
                  <Text as='span' size='xs' className='text-right'>
                    Amount
                  </Text>
                </div>
                {snapshot.line_items.map((li, i) => (
                  <div
                    key={i}
                    className='grid grid-cols-[3fr_1fr_1.5fr_1.5fr] border-t px-3 py-2'
                  >
                    <Text as='span' size='sm'>
                      {li.description}
                    </Text>
                    <Text as='span' size='sm' className='text-right'>
                      {li.quantity}
                    </Text>
                    <Text as='span' size='sm' className='text-right'>
                      ${li.rate.toFixed(2)}
                    </Text>
                    <Text as='span' size='sm' className='text-right'>
                      ${li.amount.toFixed(2)}
                    </Text>
                  </div>
                ))}
              </div>
              <div className='flex flex-col items-end gap-1.5'>
                <div className='flex w-48 justify-between'>
                  <Text as='span' size='sm' variant='muted'>
                    Subtotal
                  </Text>
                  <Text as='span' size='sm'>
                    ${snapshot.subtotal.toFixed(2)}
                  </Text>
                </div>
                {snapshot.tax_rate > 0 && (
                  <div className='flex w-48 justify-between'>
                    <Text as='span' size='sm' variant='muted'>
                      Tax ({(snapshot.tax_rate * 100).toFixed(0)}%)
                    </Text>
                    <Text as='span' size='sm'>
                      ${snapshot.tax_amount.toFixed(2)}
                    </Text>
                  </div>
                )}
                <Separator className='w-48' />
                <div className='flex w-48 justify-between font-semibold'>
                  <Text as='span' size='sm'>
                    Total
                  </Text>
                  <Text as='span' size='sm'>
                    ${snapshot.total.toFixed(2)}
                  </Text>
                </div>
              </div>
              {snapshot.notes && (
                <>
                  <Separator />
                  <div>
                    <Text
                      as='p'
                      size='xs'
                      variant='muted'
                      className='mb-1 font-medium uppercase tracking-wide'
                    >
                      Notes
                    </Text>
                    <Text as='p' size='sm' className='whitespace-pre-wrap'>
                      {snapshot.notes}
                    </Text>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
