'use client';

import { ArrowRight, ChevronDown, Receipt } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui';
import { LoginDialog } from './LoginDialog';
import { ModeToggle } from './ModeToggle';
import { Logo } from './Logo';
import { NavbarMobile } from './NavbarMobile';
import { useAuth } from '@/hooks/use-auth';
import { getDelayClass } from '@/utils/animations';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <nav className='fixed z-50 w-full border-b bg-background t200e'>
      <div className='mx-auto flex max-w-7xl flex-col px-4 sm:px-6 lg:px-8'>
        {/* Main row */}
        <div className='flex items-center justify-between py-4'>
          <Logo
            className={`fade-in-from-right ${getDelayClass(1)}`}
            onClick={() => setOpen(false)}
          />

          <div className='hidden items-center gap-4 lg:flex t200e'>
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={
                        navLinks.some((link) => link.href === pathname)
                          ? 'default'
                          : 'outline'
                      }
                      className={`fade-in-from-right ${getDelayClass(2)}`}
                    >
                      Pages <ChevronDown className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    {navLinks.map((link) => (
                      <DropdownMenuItem key={link.href} asChild>
                        <Link href={link.href}>{link.label}</Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href='/contact'>
                        Get a Quote <ArrowRight className='ml-auto h-4 w-4' />
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant={pathname.startsWith('/invoicing') ? 'default' : 'outline'}
                  className={`fade-in-from-right ${getDelayClass(3)}`}
                  asChild
                >
                  <Link href='/invoicing'>
                    <Receipt className='h-4 w-4' />
                    Invoicing
                  </Link>
                </Button>
              </>
            ) : (
              navLinks.map((link, index) => (
                <Button
                  key={link.href}
                  variant={pathname === link.href ? 'default' : 'outline'}
                  className={`fade-in-from-right ${getDelayClass(index + 2)}`}
                  asChild
                >
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))
            )}
            {!user && (
              <Button
                asChild
                className={`bg-accent text-accent-foreground hover:bg-accent/90
                fade-in-from-right ${getDelayClass(navLinks.length + 2)}`}
              >
                <Link href='/contact'>
                  Get a Quote <ArrowRight />
                </Link>
              </Button>
            )}
            <ModeToggle
              className={`fade-in-from-right ${getDelayClass(navLinks.length + 3)}`}
            />
            <div
              className={`h-5 w-px bg-border fade-in-from-right
                ${getDelayClass(navLinks.length + 3)}`}
            />
            <LoginDialog
              className={`fade-in-from-right ${getDelayClass(navLinks.length + 4)}`}
            />
          </div>

          <NavbarMobile open={open} onOpenChange={setOpen} />
        </div>
      </div>
    </nav>
  );
}
