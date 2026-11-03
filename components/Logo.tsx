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
        src='/dons_fences_logo_1x1.svg'
        alt="Don's Fences & Services"
        width={1200}
        height={1200}
        className='h-14 w-14 dark:invert'
      />
    </Link>
  );
}
