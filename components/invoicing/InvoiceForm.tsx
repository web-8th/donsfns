'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import type { Client, Invoice } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Text } from '@/components/Text';

const lineItemSchema = z.object({
  description: z.string().min(1, 'Required'),
  quantity: z.number().positive('Must be > 0'),
  rate: z.number().min(0, 'Must be ≥ 0'),
  amount: z.number(),
});

const schema = z.object({
  client_id: z.string().min(1, 'Select a client'),
  issue_date: z.string().min(1, 'Required'),
  tax_rate: z.number().min(0).max(100),
  notes: z.string().optional(),
  line_items: z.array(lineItemSchema).min(1, 'Add at least one line item'),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  clients: Client[];
  invoice?: Invoice;
}

export function InvoiceForm({ clients, invoice }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [dateOpen, setDateOpen] = useState(false);

  const defaultValues: FormValues = {
    client_id: invoice?.client_id ?? '',
    issue_date: invoice?.issue_date ?? new Date().toISOString().split('T')[0],
    tax_rate: invoice ? invoice.tax_rate * 100 : 0,
    notes: invoice?.notes ?? '',
    line_items: invoice?.line_items?.length
      ? invoice.line_items
      : [{ description: '', quantity: 1, rate: 0, amount: 0 }],
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'line_items',
  });

  const lineItems = useWatch({ control: form.control, name: 'line_items' });
  const taxRatePct = useWatch({ control: form.control, name: 'tax_rate' });

  const subtotal = lineItems?.reduce((sum, item) => sum + (item.amount || 0), 0) ?? 0;
  const taxRate = (taxRatePct ?? 0) / 100;
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  useEffect(() => {
    lineItems?.forEach((item, i) => {
      const qty = Number(item.quantity) || 0;
      const rate = Number(item.rate) || 0;
      const computed = Math.round(qty * rate * 100) / 100;
      if (computed !== item.amount) {
        form.setValue(`line_items.${i}.amount`, computed, { shouldValidate: false });
      }
    });
  }, [lineItems, form]);

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const payload = {
        client_id: values.client_id,
        issue_date: values.issue_date,
        line_items: values.line_items.map((li) => ({
          description: li.description,
          quantity: Number(li.quantity),
          rate: Number(li.rate),
          amount: li.amount,
        })),
        subtotal,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        total,
        notes: values.notes || null,
      };

      if (invoice) {
        const res = await fetch(`/api/invoicing/invoices/${invoice.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const result = await res.json();
        if (result.error) {
          form.setError('root', { message: 'Something went wrong. Please try again or refresh.' });
          toast.error('Something went wrong. Please try again or refresh.');
          return;
        }
        toast.success('Invoice saved.');
        router.push(`/invoicing/invoices/${invoice.id}`);
      } else {
        const res = await fetch('/api/invoicing/invoices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const result = await res.json();
        if (result.error) {
          form.setError('root', { message: 'Something went wrong. Please try again or refresh.' });
          toast.error('Something went wrong. Please try again or refresh.');
          return;
        }
        toast.success('Invoice created.');
        router.push(`/invoicing/invoices/${result.id}`);
      }
    });
  }

  const lineItemErrors = form.formState.errors.line_items;
  const lineItemArrayError =
    lineItemErrors?.root?.message ??
    (lineItemErrors && !Array.isArray(lineItemErrors)
      ? (lineItemErrors as { message?: string }).message
      : undefined);
  const hasFieldErrors = Array.isArray(lineItemErrors) && lineItemErrors.some(Boolean);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='grid gap-4 sm:grid-cols-3'>
          <FormField
            control={form.control}
            name='client_id'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select client…' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='issue_date'
            render={({ field }) => {
              const selected = field.value
                ? new Date(field.value + 'T00:00:00')
                : undefined;
              return (
                <FormItem>
                  <FormLabel>Issue Date</FormLabel>
                  <Popover open={dateOpen} onOpenChange={setDateOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          className='w-full justify-start font-normal'
                        >
                          <CalendarIcon className='mr-2 h-4 w-4 text-muted-foreground' />
                          {selected ? (
                            format(selected, 'MMM d, yyyy')
                          ) : (
                            <span className='text-muted-foreground'>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={selected}
                        onSelect={(d) => {
                          field.onChange(d ? format(d, 'yyyy-MM-dd') : '');
                          setDateOpen(false);
                        }}
                        captionLayout='dropdown'
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name='tax_rate'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax Rate (%)</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='1'
                    min='0'
                    max='100'
                    defaultValue={field.value ?? 0}
                    onChange={(e) => {
                      const n = parseFloat(e.target.value);
                      if (!isNaN(n)) field.onChange(n);
                    }}
                    onBlur={(e) => {
                      const n = parseFloat(e.target.value) || 0;
                      field.onChange(n);
                      e.target.value = String(n);
                      field.onBlur();
                    }}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <div className='mb-3 flex items-center justify-between'>
            <Text as='p' size='sm' className='font-medium'>
              Line Items
            </Text>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => append({ description: '', quantity: 1, rate: 0, amount: 0 })}
            >
              <Plus className='mr-1 h-3.5 w-3.5' />
              Add Row
            </Button>
          </div>

          <div className='overflow-x-auto border'>
            <div className='min-w-[540px]'>
            <div
              className='grid grid-cols-[3fr_1fr_1.5fr_1.5fr_40px] gap-px bg-border
                text-xs font-medium uppercase tracking-wide text-muted-foreground'
            >
              {['Description', 'Qty', 'Rate', 'Amount', ''].map((h) => (
                <div key={h} className='bg-muted/50 px-3 py-2'>
                  {h}
                </div>
              ))}
            </div>

            {fields.map((field, i) => (
              <div
                key={field.id}
                className='grid grid-cols-[3fr_1fr_1.5fr_1.5fr_40px] gap-px bg-border'
              >
                <div className='bg-background px-2 py-1.5'>
                  <FormField
                    control={form.control}
                    name={`line_items.${i}.description`}
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='Description'
                            className='h-8 border-0 px-1 shadow-none focus-visible:ring-0'
                          />
                        </FormControl>
                        <FormMessage className='px-1 text-xs' />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='bg-background px-2 py-1.5'>
                  <FormField
                    control={form.control}
                    name={`line_items.${i}.quantity`}
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormControl>
                          <Input
                            type='number'
                            step='1'
                            min='1'
                            defaultValue={field.value || 1}
                            onChange={(e) => {
                              const n = parseFloat(e.target.value);
                              if (!isNaN(n)) field.onChange(n);
                            }}
                            onBlur={(e) => {
                              const n = parseFloat(e.target.value) || 1;
                              field.onChange(n);
                              e.target.value = String(n);
                              field.onBlur();
                            }}
                            name={field.name}
                            className='h-8 border-0 px-1 text-right shadow-none
                              focus-visible:ring-0'
                          />
                        </FormControl>
                        <FormMessage className='px-1 text-xs' />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='bg-background px-2 py-1.5'>
                  <FormField
                    control={form.control}
                    name={`line_items.${i}.rate`}
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormControl>
                          <Input
                            type='number'
                            step='1'
                            min='0'
                            defaultValue={field.value ?? 0}
                            onChange={(e) => {
                              const n = parseFloat(e.target.value);
                              if (!isNaN(n)) field.onChange(n);
                            }}
                            onBlur={(e) => {
                              const n = parseFloat(e.target.value) || 0;
                              field.onChange(n);
                              e.target.value = String(n);
                              field.onBlur();
                            }}
                            name={field.name}
                            className='h-8 border-0 px-1 text-right shadow-none
                              focus-visible:ring-0'
                          />
                        </FormControl>
                        <FormMessage className='px-1 text-xs' />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='bg-background px-2 py-1.5'>
                  <Text
                    as='p'
                    size='sm'
                    variant='muted'
                    className='flex h-8 items-center justify-end pr-1'
                  >
                    ${(lineItems?.[i]?.amount ?? 0).toFixed(2)}
                  </Text>
                </div>
                <div className='flex items-center justify-center bg-background'>
                  <Button
                    disabled={fields.length === 1}
                    type='button'
                    variant='outline'
                    size='icon'
                    className='h-7 w-7 text-muted-foreground hover:text-destructive'
                    onClick={() => remove(i)}
                  >
                    <X className='h-3.5 w-3.5' />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          </div>

          {(lineItemArrayError || hasFieldErrors) && (
            <Text as='p' size='sm' className='mt-1 text-destructive'>
              {lineItemArrayError ?? 'Please fill in all required line item fields.'}
            </Text>
          )}
        </div>

        <div className='flex justify-end'>
          <div className='w-64 space-y-2 rounded-md border p-4'>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Tax ({taxRatePct ?? 0}%)</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
            <Separator />
            <div className='flex justify-between font-semibold'>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <FormField
          control={form.control}
          name='notes'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes / Payment Instructions</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Wire transfer details, payment terms, etc.'
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <Text as='p' size='sm' className='text-destructive'>
            {form.formState.errors.root.message}
          </Text>
        )}

        <div className='flex gap-3'>
          <Button type='submit' disabled={isPending}>
            {isPending && <Spinner />}
            {isPending ? 'Saving…' : invoice ? 'Save Changes' : 'Create Invoice'}
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
