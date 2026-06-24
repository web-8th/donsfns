'use client';

import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { useMemo, useState, useTransition } from 'react';

import { useRouter } from 'next/navigation';

import type { Client } from '@/types/database';
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
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

import { ClientDialog } from './ClientDialog';

type SearchBy = 'name' | 'email' | 'phone';

export function ClientsTable({ clients }: { clients: Client[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Client | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Client | undefined>();
  const [isPending, startTransition] = useTransition();
  const [searchBy, setSearchBy] = useState<SearchBy>('name');
  const [searchValue, setSearchValue] = useState('');

  const hasSearch = searchValue.trim() !== '';

  const filtered = useMemo(() => {
    if (!hasSearch) return clients;
    const q = searchValue.trim().toLowerCase();
    return clients.filter((c) => {
      if (searchBy === 'name') return c.name.toLowerCase().includes(q);
      if (searchBy === 'email') return (c.email ?? '').toLowerCase().includes(q);
      if (searchBy === 'phone') return (c.phone ?? '').toLowerCase().includes(q);
      return true;
    });
  }, [clients, searchBy, searchValue, hasSearch]);

  function handleSearchByChange(v: string) {
    setSearchBy(v as SearchBy);
    setSearchValue('');
  }

  function clearSearch() {
    setSearchValue('');
  }

  function openCreate() {
    setEditTarget(undefined);
    setDialogOpen(true);
  }

  function openEdit(client: Client) {
    setEditTarget(client);
    setDialogOpen(true);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const res = await fetch(`/api/invoicing/clients/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (result.error) {
        toast.error('Something went wrong. Please try again or refresh.');
        return;
      }
      setDeleteTarget(undefined);
      router.refresh();
      toast.success('Client deleted.');
    });
  }

  return (
    <>
      <div className='space-y-4'>
        <div className='flex items-center gap-2'>
          <Select value={searchBy} onValueChange={handleSearchByChange}>
            <SelectTrigger className='w-32'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='name'>Name</SelectItem>
              <SelectItem value='email'>Email</SelectItem>
              <SelectItem value='phone'>Phone</SelectItem>
            </SelectContent>
          </Select>

          <div className='relative flex-1'>
            <Input
              placeholder={
                searchBy === 'name'
                  ? 'Search by name…'
                  : searchBy === 'email'
                    ? 'Search by email…'
                    : 'Search by phone…'
              }
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {hasSearch && (
              <Button
                variant='ghost'
                size='icon'
                className='absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2
                  text-muted-foreground hover:text-foreground'
                onClick={clearSearch}
              >
                <X className='h-3.5 w-3.5' />
              </Button>
            )}
          </div>
        </div>

        <div className='flex items-center justify-between'>
          <Text size='sm' variant='muted'>
            {hasSearch
              ? `${filtered.length} of ${clients.length} client${clients.length !== 1 ? 's' : ''}`
              : `${clients.length} client${clients.length !== 1 ? 's' : ''}`}
          </Text>
          <Button size='sm' onClick={openCreate}>
            <Plus className='mr-1.5 h-4 w-4' />
            New Client
          </Button>
        </div>
      </div>

      <div className='mt-4 rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className='w-20' />
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className='py-10 text-center text-muted-foreground'
                >
                  No clients yet. Add your first client to get started.
                </TableCell>
              </TableRow>
            )}
            {filtered.length === 0 && clients.length > 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className='py-10 text-center text-muted-foreground'
                >
                  No clients match your search.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((c) => (
              <TableRow key={c.id}>
                <TableCell className='font-medium'>{c.name}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell className='text-muted-foreground'>{c.phone ?? '—'}</TableCell>
                <TableCell className='max-w-[200px] truncate text-muted-foreground'>
                  {c.address ?? '—'}
                </TableCell>
                <TableCell>
                  <div className='flex gap-1'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8'
                            onClick={() => openEdit(c)}
                          >
                            <Pencil className='h-3.5 w-3.5' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit client</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-destructive hover:text-destructive'
                            onClick={() => setDeleteTarget(c)}
                          >
                            <Trash2 className='h-3.5 w-3.5' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete client</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ClientDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditTarget(undefined);
        }}
        client={editTarget}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete client?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{deleteTarget?.name}</strong>. Any
              invoices linked to this client will be <strong>deleted</strong> as well.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isPending}
              className='bg-destructive text-destructive-foreground
                hover:bg-destructive/90'
            >
              {isPending && <Spinner />}
              {isPending ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
