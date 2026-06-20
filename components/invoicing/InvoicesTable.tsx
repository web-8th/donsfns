'use client';

import { format } from 'date-fns';
import { CalendarIcon, Eye, Pencil, Plus, Search, Send, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';

import type { Client, Invoice } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/Text';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface LatestLog {
  sent_at: string;
  recipient_email: string;
}

interface InvoiceRow extends Invoice {
  clients: Client;
  isStale: boolean;
  latestLog: LatestLog | null;
}

type SearchBy = 'invoice_number' | 'client' | 'date' | 'status';

export function InvoicesTable({ invoices }: { invoices: InvoiceRow[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [sendingId, setSendingId] = useState<string | null>(null);

  const [searchBy, setSearchBy] = useState<SearchBy>('invoice_number');
  const [invYear, setInvYear] = useState('');
  const [invNum, setInvNum] = useState('');
  const [clientId, setClientId] = useState('');
  const [dateValue, setDateValue] = useState<Date | undefined>();
  const [statusValue, setStatusValue] = useState('');
  const [dateOpen, setDateOpen] = useState(false);

  const uniqueClients = useMemo(() => {
    const seen = new Set<string>();
    const result: Client[] = [];
    for (const inv of invoices) {
      if (inv.clients && !seen.has(inv.clients.id)) {
        seen.add(inv.clients.id);
        result.push(inv.clients);
      }
    }
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [invoices]);

  function clearSearch() {
    setInvYear('');
    setInvNum('');
    setClientId('');
    setDateValue(undefined);
    setStatusValue('');
  }

  function handleSearchByChange(val: string) {
    setSearchBy(val as SearchBy);
    clearSearch();
  }

  const hasSearch = !!(invYear || invNum || clientId || dateValue || statusValue);

  const filtered = useMemo(() => {
    switch (searchBy) {
      case 'invoice_number': {
        if (!invYear && !invNum) return invoices;
        const suffix = [invYear, invNum].filter(Boolean).join('-');
        return invoices.filter((inv) => inv.invoice_number.includes(suffix));
      }
      case 'client':
        return clientId ? invoices.filter((inv) => inv.client_id === clientId) : invoices;
      case 'date': {
        if (!dateValue) return invoices;
        const dateStr = format(dateValue, 'yyyy-MM-dd');
        return invoices.filter((inv) => inv.issue_date === dateStr);
      }
      case 'status':
        return statusValue
          ? invoices.filter((inv) => inv.status === statusValue)
          : invoices;
      default:
        return invoices;
    }
  }, [invoices, searchBy, invYear, invNum, clientId, dateValue, statusValue]);

  function handleDelete(id: string) {
    startTransition(async () => {
      const res = await fetch(`/api/invoicing/invoices/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.error) {
        toast.error('Something went wrong. Please try again or refresh.');
        return;
      }
      router.refresh();
      toast.success('Invoice deleted.');
    });
  }

  async function handleSend(id: string) {
    setSendingId(id);
    try {
      const res = await fetch(`/api/invoicing/invoices/${id}/send`, { method: 'POST' });
      const result = await res.json();
      if (result.error) {
        toast.error('Something went wrong. Please try again or refresh.');
      } else {
        router.refresh();
        toast.success('Invoice sent.');
      }
    } finally {
      setSendingId(null);
    }
  }

  return (
    <div className='space-y-4'>
      {/* Search bar */}
      <div
        className='flex items-center gap-2 rounded-lg border bg-background px-3 py-2
          shadow-sm'
      >
        <Search className='h-4 w-4 shrink-0 text-muted-foreground' />

        <Select value={searchBy} onValueChange={handleSearchByChange}>
          <SelectTrigger
            className='h-auto w-auto min-w-24 border-0 p-0 text-sm font-medium shadow-none
              focus:ring-0 focus-visible:ring-0'
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='invoice_number'>Invoice #</SelectItem>
            <SelectItem value='client'>Client</SelectItem>
            <SelectItem value='date'>Date</SelectItem>
            <SelectItem value='status'>Status</SelectItem>
          </SelectContent>
        </Select>

        <div className='h-4 w-px shrink-0 bg-border' />

        {searchBy === 'invoice_number' && (
          <div className='flex flex-1 items-center'>
            <span className='select-none font-mono text-sm text-muted-foreground'>
              INV-
            </span>
            <input
              className='w-14 bg-transparent font-mono text-sm outline-none
                placeholder:text-muted-foreground/50'
              placeholder='2025'
              maxLength={4}
              value={invYear}
              onChange={(e) => setInvYear(e.target.value.replace(/\D/g, ''))}
            />
            <span className='select-none font-mono text-sm text-muted-foreground'>-</span>
            <input
              className='w-12 bg-transparent font-mono text-sm outline-none
                placeholder:text-muted-foreground/50'
              placeholder='001'
              maxLength={4}
              value={invNum}
              onChange={(e) => setInvNum(e.target.value.replace(/\D/g, ''))}
            />
          </div>
        )}

        {searchBy === 'client' && (
          <Select value={clientId} onValueChange={setClientId}>
            <SelectTrigger
              className='h-auto flex-1 border-0 p-0 text-sm shadow-none focus:ring-0
                focus-visible:ring-0'
            >
              <SelectValue placeholder='Select a client…' />
            </SelectTrigger>
            <SelectContent>
              {uniqueClients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {searchBy === 'date' && (
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <button
                className='flex flex-1 items-center gap-2 text-left text-sm outline-none'
              >
                <CalendarIcon className='h-4 w-4 shrink-0 text-muted-foreground' />
                {dateValue ? (
                  <span>{format(dateValue, 'MMM d, yyyy')}</span>
                ) : (
                  <span className='text-muted-foreground'>Pick a date…</span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                mode='single'
                selected={dateValue}
                onSelect={(d) => {
                  setDateValue(d);
                  setDateOpen(false);
                }}
                captionLayout='dropdown'
              />
            </PopoverContent>
          </Popover>
        )}

        {searchBy === 'status' && (
          <Select value={statusValue} onValueChange={setStatusValue}>
            <SelectTrigger
              className='h-auto flex-1 border-0 p-0 text-sm shadow-none focus:ring-0
                focus-visible:ring-0'
            >
              <SelectValue placeholder='Select a status…' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='draft'>Draft</SelectItem>
              <SelectItem value='sent'>Sent</SelectItem>
            </SelectContent>
          </Select>
        )}

        {hasSearch && (
          <Button
            variant='ghost'
            size='icon'
            className='ml-auto h-7 w-7 shrink-0 text-muted-foreground
              hover:text-foreground'
            onClick={clearSearch}
          >
            <X className='h-3.5 w-3.5' />
          </Button>
        )}
      </div>

      <div className='flex items-center justify-between'>
        <Text size='sm' variant='muted'>
          {hasSearch
            ? `${filtered.length} of ${invoices.length} invoice${invoices.length !== 1 ? 's' : ''}`
            : `${invoices.length} invoice${invoices.length !== 1 ? 's' : ''}`}
        </Text>
        <Button size='sm' asChild>
          <Link href='/invoicing/invoices/new'>
            <Plus />
            New Invoice
          </Link>
        </Button>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Total</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className='py-10 text-center text-muted-foreground'
                >
                  {hasSearch
                    ? 'No invoices match your search.'
                    : 'No invoices yet. Create your first invoice to get started.'}
                </TableCell>
              </TableRow>
            )}
            {filtered.map((inv) => {
              const isSending = sendingId === inv.id;
              const recipientEmail = inv.latestLog?.recipient_email ?? inv.clients?.email;
              const isResend = inv.status === 'sent' || inv.latestLog !== null;

              return (
                <TableRow key={inv.id}>
                  <TableCell className='font-mono text-sm font-medium'>
                    {inv.invoice_number}
                  </TableCell>
                  <TableCell>{inv.clients?.name ?? '—'}</TableCell>
                  <TableCell className='text-muted-foreground'>
                    {format(new Date(inv.issue_date + 'T00:00:00'), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className='font-mono'
                      variant={inv.status === 'sent' ? 'default' : 'secondary'}
                    >
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right font-medium'>
                    ${inv.total.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center justify-end gap-1'>
                      <TooltipProvider>
                        {/* Send / Resend */}
                        {isSending ? (
                          <Button
                            variant='outline'
                            size='sm'
                            className='h-8 px-2'
                            disabled
                          >
                            <Spinner /> Sending
                          </Button>
                        ) : (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant='outline'
                                size='sm'
                                className={cn(
                                  'h-8 gap-1.5 px-2 text-xs font-medium',
                                  inv.isStale &&
                                    `text-amber-600 hover:text-amber-700
                                      dark:text-amber-500 dark:hover:text-amber-400`
                                )}
                                disabled={sendingId !== null}
                              >
                                <div className='relative'>
                                  <Send className='h-3.5 w-3.5' />
                                  {inv.isStale && (
                                    <span
                                      className='absolute -right-0.5 -top-0.5 h-1.5 w-1.5
                                        rounded-full bg-amber-500'
                                    />
                                  )}
                                </div>
                                {isResend ? 'Resend' : 'Send'}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  {inv.isStale
                                    ? 'Invoice edited since last send'
                                    : isResend
                                      ? `Resend ${inv.invoice_number}?`
                                      : `Send ${inv.invoice_number}?`}
                                </AlertDialogTitle>
                                <AlertDialogDescription asChild>
                                  <div className='space-y-3 text-sm text-muted-foreground'>
                                    {inv.isStale && inv.latestLog && (
                                      <div
                                        className='rounded-md border border-amber-200
                                          bg-amber-50 px-3 py-2 text-amber-900
                                          dark:border-amber-800/50 dark:bg-amber-950/30
                                          dark:text-amber-200'
                                      >
                                        This invoice was sent to{' '}
                                        <strong>{inv.latestLog.recipient_email}</strong>{' '}
                                        on{' '}
                                        <strong>
                                          {format(
                                            new Date(inv.latestLog.sent_at),
                                            'MMM d, yyyy'
                                          )}
                                        </strong>{' '}
                                        but has since been edited. The client may have an
                                        outdated version.
                                      </div>
                                    )}
                                    <p>
                                      {isResend
                                        ? `A new PDF of ${inv.invoice_number} will be generated and emailed to ${recipientEmail}.`
                                        : `A PDF of ${inv.invoice_number} will be generated and emailed to ${recipientEmail}.`}
                                    </p>
                                  </div>
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleSend(inv.id)}>
                                  {isResend ? 'Resend' : 'Send'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}

                        {/* View */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant='outline'
                              size='icon'
                              className='h-8 w-8'
                              asChild
                            >
                              <Link href={`/invoicing/invoices/${inv.id}`}>
                                <Eye className='h-3.5 w-3.5' />
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View invoice</TooltipContent>
                        </Tooltip>

                        {/* Edit */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant='outline'
                              size='icon'
                              className='h-8 w-8'
                              asChild
                            >
                              <Link href={`/invoicing/invoices/${inv.id}/edit`}>
                                <Pencil className='h-3.5 w-3.5' />
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit invoice</TooltipContent>
                        </Tooltip>

                        {/* Delete */}
                        <AlertDialog>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant='outline'
                                  size='icon'
                                  className='h-8 w-8 text-destructive
                                    hover:text-destructive'
                                  disabled={isPending}
                                >
                                  {isPending ? (
                                    <Spinner className='h-3.5 w-3.5' />
                                  ) : (
                                    <Trash2 className='h-3.5 w-3.5' />
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>Delete invoice</TooltipContent>
                          </Tooltip>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete invoice?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete invoice{' '}
                                <strong>{inv.invoice_number}</strong> and its email log.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(inv.id)}
                                className='bg-destructive text-destructive-foreground
                                  hover:bg-destructive/90'
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
