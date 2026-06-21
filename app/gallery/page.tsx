import type { Metadata } from 'next';

import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { Text } from '@/components/Text';
import { getDelayClass } from '@/utils/animations';

export const metadata: Metadata = {
  title: 'Fence Installation Gallery — BC Interior',
  description:
    "Photos of fence installations completed by Don's Fences & Services across Enderby, Vernon, Armstrong, Lake Country, Kelowna, Salmon Arm, and the BC interior.",
  keywords: [
    'fence photos BC',
    'fencing gallery Okanagan',
    'fence installation photos Enderby',
    'ranch fence photos BC',
    'custom gate photos',
  ],
  alternates: { canonical: 'https://donsfences.ca/gallery' },
  openGraph: {
    url: 'https://donsfences.ca/gallery',
    title: "Gallery | Don's Fences & Services",
    description:
      "Fence installations across Enderby, Vernon, Armstrong, Lake Country, Kelowna, and Salmon Arm by Don's Fences & Services.",
    images: [
      {
        url: '/don_5.jpg',
        width: 1200,
        height: 630,
        alt: 'Ranch fence in the BC interior',
      },
    ],
  },
};

export default function GalleryPage() {
  return (
    <div className='mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8'>
      <div className='mb-10'>
        <Text
          variant='hd-xxl'
          className={`font-display tracking-wide fade-in-from-bottom ${getDelayClass(1)}`}
        >
          Gallery
        </Text>
        <Text
          variant='muted'
          size='lg'
          className={`mt-2 max-w-xl fade-in-from-bottom ${getDelayClass(2)}`}
        >
          Work done across Enderby, Vernon, Armstrong, Lake Country, Kelowna, Salmon Arm,
          and the BC interior.
        </Text>
      </div>
      <GalleryGrid />
    </div>
  );
}
