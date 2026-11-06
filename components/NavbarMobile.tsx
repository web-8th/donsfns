'use client';

import { ArrowRight, Menu, Receipt } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Button,
  Separator,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui';
import { LoginDialog } from './LoginDialog';
import { ModeToggle } from './ModeToggle';
import { Logo } from './Logo';
import { useAuth } from '@/hooks/use-auth';
import { getDelayClass } from '@/utils/animations';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

interface NavbarMobileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NavbarMobile({ open, onOpenChange }: NavbarMobileProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <div className='lg:hidden'>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button
            variant='outline'
            className={`fade-in-from-right ${getDelayClass(2)}`}
            size='icon'
          >
            <Menu className='h-6 w-6' />
            <span className='sr-only'>Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='right' className='w-75 overflow-y-auto sm:w-100'>
          <SheetHeader>
            <SheetTitle>
              <Logo onClick={() => onOpenChange(false)} />
            </SheetTitle>
          </SheetHeader>
          <div className='mt-6 flex flex-col items-center gap-4 pb-8'>
            {navLinks.map((link, index) => (
              <Button
                key={link.href}
                variant={pathname === link.href ? 'secondary' : 'outline'}
                className={`w-1/2 fade-in-from-right ${getDelayClass(index + 2)}`}
                asChild
              >
                <Link href={link.href} onClick={() => onOpenChange(false)}>
                  {link.label}
                </Link>
              </Button>
            ))}
            <Button
              asChild
              className={`w-1/2 bg-accent text-accent-foreground hover:bg-accent/90
                fade-in-from-right ${getDelayClass(navLinks.length + 2)}`}
            >
              <Link href='/contact' onClick={() => onOpenChange(false)}>
                Get a Quote <ArrowRight />
              </Link>
            </Button>
            <ModeToggle
              className={`fade-in-from-right ${getDelayClass(navLinks.length + 3)}`}
            />
            <Separator
              className={`w-full fade-in-from-right ${getDelayClass(navLinks.length + 4)}`}
            />
            {user && (
              <Button
                variant={pathname === '/invoicing' ? 'default' : 'outline'}
                asChild
                className={`w-1/2 fade-in-from-right ${getDelayClass( navLinks.length + 5
                )}`}
              >
                <Link href='/invoicing' onClick={() => onOpenChange(false)}>
                  <Receipt className='h-4 w-4' /> Invoicing
                </Link>
              </Button>
            )}
            <LoginDialog
              className={`fade-in-from-right ${getDelayClass(navLinks.length + 5)}`}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
