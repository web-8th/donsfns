import Image from 'next/image';
import Link from 'next/link';

import { Text } from '@/components/Text';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className='relative flex min-h-svh items-center justify-center'>
      <Image
        src='/don_3.jpg'
        alt='Fence installation by Don in the BC interior'
        fill
        className='object-cover'
        priority
      />
      <div className='absolute inset-0 bg-black/60' />

      <div className='relative z-10 mx-auto max-w-4xl px-4 text-center text-white sm:px-6'>
        <Text
          as='p'
          variant='default'
          size='sm'
          className='mb-4 uppercase tracking-[0.25em] text-white/70'
        >
          Enderby, BC · Est. 12+ Years
        </Text>

        <Text
          variant='hd-xxl'
          className='font-display mb-6 leading-none tracking-wide text-white text-5xl
            md:text-7xl lg:text-9xl'
        >
          Don's Fences
          <br />& Services
        </Text>

        <Text
          as='p'
          variant='default'
          size='xl'
          className='mx-auto mb-10 max-w-2xl italic leading-relaxed text-white/90'
        >
          "If you don't have Don's fences, you don't have a fence."
        </Text>

        <div className='flex flex-col gap-4 sm:flex-row sm:justify-center'>
          <Button size='lg' asChild>
            <Link href='/contact'>Get a Free Quote</Link>
          </Button>
          <Button size='lg' variant='outline' asChild>
            <Link href='/gallery'>See Our Work</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
