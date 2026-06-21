import Image from 'next/image';
import Link from 'next/link';

import { Text } from '@/components/Text';
import { Button } from '@/components/ui/button';
import { getDelayClass } from '@/utils/animations';

const previewImages = [
  { src: '/don_4.jpg', alt: 'Backyard fence installation' },
  { src: '/don_7.jpg', alt: 'Farm fencing in the BC interior' },
  { src: '/don_11.jpg', alt: 'Fence gate installation for private property' },
];

export function GalleryPreview() {
  return (
    <section className='mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8'>
      <div className='mb-10 text-center'>
        <Text
          as='h2'
          variant='hd-xxl'
          className='fade-in-from-bottom mb-3 font-display tracking-wide'
        >
          The Work Speaks for Itself
        </Text>
        <Text
          variant='muted'
          size='lg'
          className={`fade-in-from-bottom ${getDelayClass(1)} mx-auto max-w-xl`}
        >
          Fence installations across Enderby, Vernon, Armstrong, Lake Country, Kelowna,
          and Salmon Arm.
        </Text>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        {previewImages.map(({ src, alt }, index) => (
          <div
            key={src}
            className={`fade-in-scale relative h-80 overflow-hidden rounded-lg
            ${getDelayClass(index + 2)}`}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className='object-cover transition-transform duration-500 hover:scale-105'
            />
          </div>
        ))}
      </div>

      <div className='mt-10 text-center'>
        <Button
          variant='outline'
          size='lg'
          className={`fade-in-from-bottom ${getDelayClass(5)}`}
          asChild
        >
          <Link href='/gallery'>View Full Gallery</Link>
        </Button>
      </div>
    </section>
  );
}
