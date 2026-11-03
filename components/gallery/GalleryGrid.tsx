'use client';

import Image from 'next/image';
import Masonry from 'react-masonry-css';

import { getDelayClass } from '@/utils/animations';

const images = [
  { src: '/don_3.jpg', alt: 'Anti Cattle Fencing' },
  { src: '/don_4.jpg', alt: 'Fencing for backyard' },
  { src: '/don_5.jpg', alt: 'Ranch fencing' },
  { src: '/don_6.jpg', alt: 'Highway fencing' },
  { src: '/don_7.jpg', alt: 'Fencing straight across the ranch to the centimeters' },
  { src: '/don_9.jpg', alt: 'Fence installation on a side cliff' },
  { src: '/don_10.jpg', alt: 'Proper fence installation' },
  { src: '/don_11.jpg', alt: 'Fence gate for a private property' },
  { src: '/don_12.jpg', alt: 'Ranch fencing with horse inside' },
  { src: '/don_13.jpg', alt: 'Fence installation in farm' },
  { src: '/don_14.jpg', alt: 'Fence installation with support' },
  { src: '/don_15.jpg', alt: 'Woven wire fence line running along a mowed pasture edge' },
];

const breakpointCols = {
  default: 3,
  1024: 2,
  640: 1,
};

export function GalleryGrid() {
  return (
    <Masonry
      breakpointCols={breakpointCols}
      className='masonry-grid'
      columnClassName='masonry-grid_column'
    >
      {images.map(({ src, alt }, index) => (
        <div
          key={src}
          className={`fade-in-scale mb-4 overflow-hidden rounded-lg
          ${getDelayClass(index)}`}
        >
          <Image
            src={src}
            alt={alt}
            width={800}
            height={600}
            className='w-full h-auto object-cover transition-transform duration-500
              hover:scale-105'
          />
        </div>
      ))}
    </Masonry>
  );
}
