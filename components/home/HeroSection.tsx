import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Quote } from 'lucide-react';

import { Text } from '@/components/Text';
import { Button } from '@/components/ui/button';
import { getDelayClass } from '@/utils/animations';

export function HeroSection() {
  return (
    <section className='relative flex min-h-svh items-center justify-center'>
      <Image
        src='/don_3.jpg'
        alt='Fence installation by Don in the BC interior'
        fill
        className={`object-cover fade-in-opacity ${getDelayClass(1)}`}
        priority
      />
      <div className='absolute inset-0 bg-black/60' />

      <div className='relative z-10 mx-auto max-w-4xl px-4 text-center text-white sm:px-6'>
        <Text
          as='p'
          variant='default'
          size='sm'
          className={`fade-in-from-bottom ${getDelayClass(0)} mb-4 uppercase font-mono
            font-bold tracking-[0.25em] text-white/70`}
        >
          Enderby, BC · Est. 2002
        </Text>

        <Text
          variant='hd-xxl'
          className={`fade-in-from-bottom ${getDelayClass(2)} font-display mb-6
            leading-none tracking-wide text-white text-6xl md:text-7xl lg:text-9xl`}
        >
          Don&apos;s Fences
          <br />& Services
        </Text>

        <Text
          as='p'
          variant='default'
          size='xl'
          className={`fade-in-from-bottom ${getDelayClass(4)} mx-auto mb-6 max-w-2xl
            italic leading-relaxed text-white/90`}
        >
          &quot;If you don&apos;t have{' '}
          <span className='font-bold'>Don&apos;s Fences</span>, you don&apos;t have a
          fence.&quot;
        </Text>

        <div
          className={`fade-in-from-bottom ${getDelayClass(6)} flex gap-4 items-center
            flex-wrap flex-row justify-center`}
        >
          <Button size='lg' className='' asChild>
            <Link href='/contact'>
              Get a Free Quote <Quote />
            </Link>
          </Button>
          <Button
            size='lg'
            variant='outline'
            className='text-white bg-transparent'
            asChild
          >
            <Link href='/gallery'>
              See Our Work <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
