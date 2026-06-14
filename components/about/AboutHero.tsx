import Image from 'next/image';

import { Text } from '@/components/Text';

export function AboutHero() {
  return (
    <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
      <div className='grid grid-cols-1 items-start gap-10 lg:grid-cols-2'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='relative h-[500px] overflow-hidden rounded-lg'>
            <Image
              src='/don_1.jpg'
              alt="Don — Owner of Don's Fences & Services"
              fill
              className='object-cover object-top'
            />
          </div>
          <div className='relative h-[500px] overflow-hidden rounded-lg'>
            <Image
              src='/don_2.jpg'
              alt='Don at a fencing project in BC'
              fill
              className='object-cover object-top'
            />
          </div>
        </div>

        <div className='flex flex-col gap-6 lg:pt-8'>
          <Text variant='hd-xxl' className='font-display tracking-wide'>
            12 Years. One Standard.
          </Text>
          <Text size='lg' variant='muted'>
            I'm Don. I've spent over a decade building fences in the BC interior — from
            highway barriers along major routes to boundary fences deep in forestry land
            and installations for BC Parks.
          </Text>
          <Text size='lg' variant='muted'>
            Based in Enderby, I serve Vernon, Armstrong, Salmon Arm, and the broader
            Okanagan. I've worked on projects most contractors won't touch, and I've done
            them right.
          </Text>
          <Text size='lg' variant='muted'>
            My standard is simple: if it's off, we fix it. Down to the centimeter. Every
            time. No exceptions, no shortcuts, no "good enough."
          </Text>
        </div>
      </div>
    </section>
  );
}
