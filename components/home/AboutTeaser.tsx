import Image from 'next/image';
import Link from 'next/link';

import { Text } from '@/components/Text';
import { Button } from '@/components/ui/button';

export function AboutTeaser() {
  return (
    <section className='bg-muted/30'>
      <div className='mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 items-center gap-10 md:grid-cols-2'>
          <div className='relative h-[480px] overflow-hidden rounded-lg'>
            <Image
              src='/don_1.jpg'
              alt="Don — Owner of Don's Fences & Services"
              fill
              className='object-cover object-top'
            />
          </div>

          <div className='flex flex-col gap-6'>
            <Text variant='hd-xxl' className='font-display tracking-wide'>
              Built on 12 Years of Not Cutting Corners
            </Text>
            <Text size='lg' variant='muted'>
              I'm Don. I've been building fences in the BC interior for over 12 years —
              from highway barriers and BC Parks projects to ranch fences and residential
              gates across the Okanagan.
            </Text>
            <Text size='lg' variant='muted'>
              If something's off by a centimeter, we fix it. That's not a slogan — it's
              just how I work.
            </Text>
            <Button asChild className='self-start'>
              <Link href='/about'>More About Don</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
