import Image from 'next/image';

import { Text } from '@/components/Text';
import { getDelayClass } from '@/utils/animations';

export function AboutHero() {
  return (
    <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
      <div className='grid grid-cols-1 items-start gap-10 lg:grid-cols-2'>
        <div className='grid grid-cols-2 gap-4'>
          <div
            className={`fade-in-editorial ${getDelayClass(1)} relative h-[500px]
              overflow-hidden rounded-lg`}
          >
            <Image
              src='/don_1.jpg'
              alt="Don — Owner of Don's Fences & Services"
              fill
              className='object-cover object-top'
            />
          </div>
          <div
            className={`fade-in-editorial ${getDelayClass(2)} relative h-[500px]
              overflow-hidden rounded-lg`}
          >
            <Image
              src='/don_2.jpg'
              alt='Don at a fencing project in BC'
              fill
              className='object-cover object-top'
            />
          </div>
        </div>

        <div className='flex flex-col gap-6 lg:pt-8'>
          <Text
            variant='hd-xxl'
            className={`fade-in-from-right ${getDelayClass(3)} font-display tracking-wide`}
          >
            Since 2002. One Standard.
          </Text>
          <Text
            size='lg'
            variant='muted'
            className={`fade-in-from-right ${getDelayClass(4)}`}
          >
            I&apos;m Don. I&apos;ve been building fences in the BC interior since 2002 —
            from highway barriers along major routes to boundary fences deep in forestry
            land and fencing for farms and agricultural properties across the region.
          </Text>
          <Text
            size='lg'
            variant='muted'
            className={`fade-in-from-right ${getDelayClass(5)}`}
          >
            Based in Enderby, I serve the BC interior — Vernon, Armstrong, Lake Country,
            Kelowna, Salmon Arm, and everywhere in between. I&apos;ve worked on projects
            most contractors won&apos;t touch, and I&apos;ve done them right.
          </Text>
          <Text
            size='lg'
            variant='muted'
            className={`fade-in-from-right ${getDelayClass(6)}`}
          >
            My standard is simple: if it&apos;s off, we fix it. Down to the centimeter.
            Every time. No exceptions, no shortcuts, no &quot;good enough.&quot;
          </Text>
        </div>
      </div>
    </section>
  );
}
