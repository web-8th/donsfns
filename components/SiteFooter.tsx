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
            <Link href='/'>
              <Image
                src='/dons_fences_logo_horizontal.svg'
                alt="Don's Fences & Services"
                width={200}
                height={50}
                className='h-14 w-auto'
              />
            </Link>
            <Text size='sm' variant='muted' className='max-w-xs'>
              If you don't have <span className='font-bold'>Don's Fences</span>, you don't
              have a fence.
            </Text>
            <Text size='sm' variant='muted'>
              Enderby, BC · Serving the BC Interior
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
            <a
              href='tel:+12503065064'
              className='text-sm text-muted-foreground underline transition-colors
                hover:text-foreground'
            >
              (250) 306-5064
            </a>
            <a
              href='mailto:doncookbc@yahoo.ca'
              className='text-sm text-muted-foreground underline transition-colors
                hover:text-foreground'
            >
              doncookbc@yahoo.ca
            </a>
            <a
              href='https://www.google.com/maps/place/Don%27s+Fences/@50.5501916,-119.1256252,17z/data=!4m16!1m9!3m8!1s0x537e8845ed7ef089:0x64f2599a99c8404c!2s67+Enderby+Mabel+Lk+Rd,+Enderby,+BC+V0E+1V4!3b1!8m2!3d50.5502895!4d-119.1256927!10e5!16s%2Fg%2F11c5pvk06n!3m5!1s0x537e8936c83c1faf:0xb3ca86e28c69c637!8m2!3d50.5501872!4d-119.1243997!16s%2Fg%2F11s5gzx4zf?entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D'
              target='_blank'
              rel='noopener noreferrer'
              className='text-sm text-muted-foreground underline transition-colors
                hover:text-foreground'
            >
              67 Enderby Mabel Lk Rd
              <br />
              Enderby, BC V0E 1V4
            </a>
          </div>
        </div>

        <Separator className='my-8' />

        <div className='flex flex-col items-center gap-4'>
          <div
            className='flex flex-col gap-2 w-full sm:flex-row sm:items-center
              sm:justify-between'
          >
            <Text size='sm' variant='muted'>
              © {new Date().getFullYear()} Don's Fences & Services · donsfences.ca
            </Text>
            <Text size='sm' variant='muted'>
              Enderby · Vernon · Armstrong · Lake Country · Kelowna · Salmon Arm
            </Text>
          </div>

          <Link
            href='https://web8th.com'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-1.5 text-muted-foreground transition-opacity
              hover:opacity-70'
          >
            <Text size='sm' variant='muted'>
              built by
            </Text>
            <Image
              src='/icons/8th_svg.svg'
              alt='Web8th'
              width={40}
              height={40}
              className='not-dark:invert'
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}
