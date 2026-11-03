import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  onClick?: () => void;
  className?: string;
}

export function Logo({ onClick, className }: LogoProps) {
  return (
    <Link href='/' className={cn('flex items-center', className)} onClick={onClick}>
      <Image
        src='/dons_fences_logo_horizontal.svg'
        alt="Don's Fences & Services"
        width={1000}
        height={1357}
        className='h-16 w-auto dark:invert'
      />
    </Link>
  );
}
