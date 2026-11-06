'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn, LogOut } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@/components/ui';
import { useAuth, signInWithEmail } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginDialog({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Logged out successfully');
  };

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginValues) => {
    const { data, error } = await signInWithEmail(values.email, values.password);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Signed in successfully as ${data.user?.email ?? values.email}`);
      setOpen(false);
      form.reset();
    }
  };

  if (user) {
    return (
      <>
        <Button
          variant='outline'
          onClick={() => setConfirmOpen(true)}
          className={className}
          aria-label='Sign out'
        >
          Log out?
          <LogOut className='h-4 w-4' />
        </Button>
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sign out?</AlertDialogTitle>
              <AlertDialogDescription>
                You will be signed out of your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSignOut}>Sign out</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' className={className} aria-label='Sign in'>
          Log in
          <LogIn className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-sm'>
        <DialogHeader>
          <DialogTitle>Sign in</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 pt-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
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
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder='••••••••' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type='submit'
              className='w-full'
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
