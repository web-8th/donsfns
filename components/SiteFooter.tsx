import Image from 'next/image';
import Link from 'next/link';

import { Text } from '@/components/Text';
import { Separator } from '@/components/ui/separator';

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function SiteFooter() {
  return (
    <footer className='mt-16 border-t bg-muted/40'>
      <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          <div className='flex flex-col gap-3'>
            <Link href='/' className='flex items-center gap-2'>
              <Image
                src='/dons_fences_icon_1x1.svg'
                alt="Don's Fences & Services"
                width={36}
                height={36}
                className='h-9 w-9'
              />
              <span className='font-display text-xl leading-none tracking-wide'>
                Don's Fences
              </span>
            </Link>
            <Text size='sm' variant='muted' className='max-w-xs'>
              If you don't have Don's fences, you don't have a fence.
            </Text>
            <Text size='sm' variant='muted'>
              Enderby, BC · Serving the Okanagan
            </Text>
          </div>

          <div className='flex flex-col gap-2'>
            <Text variant='label' size='sm' className='mb-1 uppercase tracking-wider'>
              Pages
            </Text>
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className='text-sm text-muted-foreground transition-colors
                  hover:text-foreground'
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className='flex flex-col gap-2'>
            <Text variant='label' size='sm' className='mb-1 uppercase tracking-wider'>
              Contact
            </Text>
            <Text size='sm' variant='muted'>
              Phone: [PHONE]
            </Text>
            <Text size='sm' variant='muted'>
              Email: [EMAIL]
            </Text>
            <Text size='sm' variant='muted'>
              Service Areas: [SERVICE_AREAS]
            </Text>
          </div>
        </div>

        <Separator className='my-8' />

        <div
          className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'
        >
          <Text size='sm' variant='muted'>
            © {new Date().getFullYear()} Don's Fences & Services · donsfences.ca
          </Text>
          <Text size='sm' variant='muted'>
            Enderby · Vernon · Armstrong · Salmon Arm · Okanagan
          </Text>
        </div>
      </div>
    </footer>
  );
}
