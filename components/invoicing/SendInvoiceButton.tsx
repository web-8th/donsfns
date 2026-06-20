'use client';

import { CheckCircle2, Send } from 'lucide-react';
import { useState, useTransition } from 'react';

import { sendInvoice } from '@/actions/invoicing/send';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'sending' | 'sent'>('idle');

  function handleSend() {
    setConfirmOpen(false);
    setPhase('sending');
    startTransition(async () => {
      const result = await sendInvoice(invoiceId);
      if (result.error) {
        setPhase('idle');
        onError?.(result.error);
      } else {
        setPhase('sent');
        setTimeout(() => setPhase('idle'), 2000);
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

      <Dialog open={phase !== 'idle'} onOpenChange={() => {}}>
        <DialogContent
          className='flex max-w-xs flex-col items-center gap-4 py-10'
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className='text-center'>
              {phase === 'sent' ? `Invoice ${invoiceNumber} Sent.` : 'Sending invoice…'}
            </DialogTitle>
          </DialogHeader>
          {phase === 'sent' ? (
            <CheckCircle2 className='size-8 text-green-500' />
          ) : (
            <Spinner className='size-8' />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
