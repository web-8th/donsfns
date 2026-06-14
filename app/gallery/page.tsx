import type { Metadata } from 'next';

import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { Text } from '@/components/Text';

export const metadata: Metadata = {
  title: "Gallery | Don's Fences & Services — BC Fencing Contractor",
  description:
    "Photos of fence installations and projects completed by Don's Fences & Services in Enderby, Vernon, Armstrong, and the Okanagan.",
};

export default function GalleryPage() {
  return (
    <div className='mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8'>
      <div className='mb-10'>
        <Text variant='hd-xxl' className='font-display tracking-wide'>
          Gallery
        </Text>
        <Text variant='muted' size='lg' className='mt-2 max-w-xl'>
          Work done across Enderby, Vernon, Armstrong, Salmon Arm, and the BC interior.
        </Text>
      </div>
      <GalleryGrid />
    </div>
  );
}
