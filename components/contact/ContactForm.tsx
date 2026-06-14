'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from 'lucide-react';
import { z } from 'zod';

import { Text } from '@/components/Text';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { getDelayClass } from '@/utils/animations';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.email('Enter a valid email address'),
  phone: z.string().optional(),
  service: z.string().min(1, 'Please select a service'),
  preferredDate: z.date().optional(),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const serviceOptions = [
  'Fencing & Gates',
  'Wood Milling',
  'Automotive',
  'Cold Storage Rental',
  'Other / Not Sure',
];

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      service: '',
      preferredDate: undefined,
      message: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          preferredDate: values.preferredDate
            ? format(values.preferredDate, 'PPP')
            : undefined,
        }),
      });

      if (!res.ok) throw new Error('Failed to send');

      toast.success("Message sent — I'll be in touch soon.");
      form.reset();
    } catch {
      toast.error('Something went wrong. Try again or call directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5'>
        <div
          className={`fade-in-from-bottom ${getDelayClass(1)} grid grid-cols-1 gap-4
            sm:grid-cols-2`}
        >
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder='John' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder='Smith' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem className={`fade-in-from-bottom ${getDelayClass(1)}`}>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='email' placeholder='you@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem className={`fade-in-from-bottom ${getDelayClass(2)}`}>
              <FormLabel>
                Phone{' '}
                <Text as='span' size='sm' variant='muted' className='font-normal'>
                  (optional)
                </Text>
              </FormLabel>
              <FormControl>
                <Input type='tel' placeholder='XXX-XXX-XXX' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div
          className={`fade-in-from-bottom ${getDelayClass(3)} grid grid-cols-1 gap-4 sm:grid-cols-2`}
        >
          <FormField
            control={form.control}
            name='service'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Service Needed</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select a service' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {serviceOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
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
            name='preferredDate'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
              <FormLabel>
                Preferred Date{' '}
                <Text as='span' size='sm' variant='muted' className='font-normal'>
                  (optional)
                </Text>
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant='outline'
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>

        <FormField
          control={form.control}
          name='message'
          render={({ field }) => (
            <FormItem className={`fade-in-from-bottom ${getDelayClass(5)}`}>
              <FormLabel>
                Message{' '}
                <Text as='span' size='sm' variant='muted' className='font-normal'>
                  (optional)
                </Text>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Tell me about your project — location, scope, any specifics.'
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          size='lg'
          disabled={isSubmitting}
          className={`fade-in-from-bottom ${getDelayClass(6)} self-start`}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </Form>
  );
}
