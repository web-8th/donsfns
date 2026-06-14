import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  onClick?: () => void;
}

export function Logo({ onClick }: LogoProps) {
  return (
    <Link href='/' className='flex items-center gap-2' onClick={onClick}>
      <Image
        src='/dons_fences_icon_1x1.svg'
        alt="Don's Fences & Services"
        width={36}
        height={36}
        className='h-9 w-9'
      />
      <span className='font-display hidden text-xl leading-none tracking-wide sm:block'>
        Don's Fences
      </span>
    </Link>
  );
}
