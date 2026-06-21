import Image from 'next/image';
import Link from 'next/link';

import { Text } from '@/components/Text';
import { Button } from '@/components/ui/button';
import { getDelayClass } from '@/utils/animations';

export function AboutTeaser() {
  return (
    <section className='bg-muted/30'>
      <div className='mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 items-center gap-10 md:grid-cols-2'>
          <div
            className={`fade-in-editorial ${getDelayClass(0)} relative h-[480px]
              overflow-hidden rounded-lg`}
          >
            <Image
              src='/don_1.jpg'
              alt="Don — Owner of Don's Fences & Services"
              fill
              className='object-cover object-top'
            />
          </div>

          <div className='flex flex-col gap-6'>
            <Text
              as='h2'
              variant='hd-xxl'
              className={`fade-in-from-right ${getDelayClass(1)} font-display
                tracking-wide`}
            >
              Building Fences Since 2002. Not Cutting Corners.
            </Text>
            <Text
              size='lg'
              variant='muted'
              className={`fade-in-from-right ${getDelayClass(3)}`}
            >
              I'm Don. I've been building fences in the BC interior since 2002 — from
              highway barriers and BC Parks projects to ranch fences and residential gates
              across the Okanagan.
            </Text>
            <Text
              size='lg'
              variant='muted'
              className={`fade-in-from-right ${getDelayClass(4)}`}
            >
              If something's off by a centimeter, we fix it. That's not a slogan — it's
              just how I work.
            </Text>
            <Button
              asChild
              className={`fade-in-from-right ${getDelayClass(5)} self-start`}
            >
              <Link href='/about'>More About Don</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
