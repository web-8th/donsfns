import Image from 'next/image';
import Link from 'next/link';

import { Text } from '@/components/Text';
import { Button } from '@/components/ui/button';

const previewImages = [
  { src: '/don_4.jpg', alt: "Fence installation — Don's Fences & Services" },
  { src: '/don_5.jpg', alt: 'Ranch fencing in the BC interior' },
  { src: '/don_6.jpg', alt: "Custom gate by Don's Fences & Services" },
];

export function GalleryPreview() {
  return (
    <section className='mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8'>
      <div className='mb-10 text-center'>
        <Text variant='hd-xxl' className='font-display mb-3 tracking-wide'>
          The Work Speaks for Itself
        </Text>
        <Text variant='muted' size='lg' className='mx-auto max-w-xl'>
          Fence installations across Enderby, Vernon, Armstrong, and the broader Okanagan.
        </Text>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        {previewImages.map(({ src, alt }) => (
          <div key={src} className='relative aspect-[4/3] overflow-hidden rounded-lg'>
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
        <Button variant='outline' size='lg' asChild>
          <Link href='/gallery'>View Full Gallery</Link>
        </Button>
      </div>
    </section>
  );
}
