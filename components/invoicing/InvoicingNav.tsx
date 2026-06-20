'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const links = [
  { href: '/invoicing/invoices', label: 'Invoices' },
  { href: '/invoicing/clients', label: 'Clients' },
];

export function InvoicingNav() {
  const path = usePathname();

  return (
    <nav className='mb-6 flex gap-1 border-b pb-0'>
      {links.map(({ href, label }) => {
        const active = path.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'relative px-4 py-2 text-sm font-medium transition-colors',
              active
                ? 'text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
