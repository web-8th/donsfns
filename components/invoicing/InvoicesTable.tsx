'use client';

import { format } from 'date-fns';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useTransition } from 'react';

import { deleteInvoice } from '@/actions/invoicing/invoices';
import type { Client, Invoice } from '@/types/database';
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

interface InvoiceRow extends Invoice {
  clients: Client;
}

export function InvoicesTable({ invoices }: { invoices: InvoiceRow[] }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteInvoice(id);
    });
  }

  return (
    <>
      <div className='mb-4 flex items-center justify-between'>
        <Text size='sm' variant='muted'>
          {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}
        </Text>
        <Button size='sm' asChild>
          <Link href='/invoicing/invoices/new'>
            <Plus className='mr-1.5 h-4 w-4' />
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
              <TableHead className='w-28' />
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className='py-10 text-center text-muted-foreground'
                >
                  No invoices yet. Create your first invoice to get started.
                </TableCell>
              </TableRow>
            )}
            {invoices.map((inv) => (
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
                  <div className='flex justify-end gap-1'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant='ghost' size='icon' className='h-8 w-8' asChild>
                            <Link href={`/invoicing/invoices/${inv.id}`}>
                              <Eye className='h-3.5 w-3.5' />
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View invoice</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant='ghost' size='icon' className='h-8 w-8' asChild>
                            <Link href={`/invoicing/invoices/${inv.id}/edit`}>
                              <Pencil className='h-3.5 w-3.5' />
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit invoice</TooltipContent>
                      </Tooltip>
                      <AlertDialog>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant='ghost'
                                size='icon'
                                className='h-8 w-8 text-destructive
                                  hover:text-destructive'
                                disabled={isPending}
                              >
                                <Trash2 className='h-3.5 w-3.5' />
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
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
