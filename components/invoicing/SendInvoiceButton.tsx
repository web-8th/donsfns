'use client';

import { CheckCircle2, Send } from 'lucide-react';
import { useState, useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { useToast } from '@/hooks/use-toast';
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
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';

interface Props {
  invoiceId: string;
  recipientEmail: string;
  invoiceNumber: string;
  status: 'draft' | 'sent';
  onError?: (msg: string) => void;
}

export function SendInvoiceButton({
  invoiceId,
  recipientEmail,
  invoiceNumber,
  status,
  onError,
}: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'sending' | 'sent'>('idle');

  function handleSend() {
    setConfirmOpen(false);
    setPhase('sending');
    startTransition(async () => {
      const res = await fetch(`/api/invoicing/invoices/${invoiceId}/send`, {
        method: 'POST',
      });
      const result = await res.json();
      if (result.error) {
        setPhase('idle');
        onError?.('Something went wrong. Please try again or refresh.');
        toast.error('Something went wrong. Please try again or refresh.');
      } else {
        setPhase('sent');
        router.refresh();
        toast.success(`Invoice ${invoiceNumber} sent to ${recipientEmail}.`);
      }
    });
  }

  return (
    <>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogTrigger asChild>
          <Button disabled={isPending}>
            <Send />
            {status === 'sent' ? 'Resend Invoice' : 'Send Invoice'}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {status === 'sent' ? 'Resend invoice?' : 'Send invoice?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will generate a PDF of <strong>{invoiceNumber}</strong> and email it to{' '}
              <strong>{recipientEmail}</strong>.
              {status === 'sent' &&
                ' A new email log entry will be created — the previous send history is preserved.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSend}>Send</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={phase !== 'idle'}
        onOpenChange={(open) => {
          if (!open && phase === 'sent') setPhase('idle');
        }}
      >
        <DialogContent
          className='flex max-w-xs flex-col items-center gap-4 py-10'
          onInteractOutside={(e) => phase === 'sending' && e.preventDefault()}
          onEscapeKeyDown={(e) => phase === 'sending' && e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className='text-center'>
              {phase === 'sent' ? `Invoice ${invoiceNumber} Sent.` : 'Sending invoice…'}
            </DialogTitle>
            <DialogDescription className='text-center'>
              {phase === 'sent'
                ? `Invoice ${invoiceNumber} has been sent to ${recipientEmail}.`
                : 'Please wait while we send your invoice.'}
            </DialogDescription>
          </DialogHeader>
          {phase === 'sent' ? (
            <CheckCircle2 className='size-8 text-green-500' />
          ) : (
            <Spinner className='size-8' />
          )}
          {phase === 'sent' && (
            <DialogFooter>
              <Button onClick={() => setPhase('idle')}>Close</Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
