import type { Metadata } from 'next';

import { AboutTeaser } from '@/components/home/AboutTeaser';
import { GalleryPreview } from '@/components/home/GalleryPreview';
import { HeroSection } from '@/components/home/HeroSection';
import { ServicesPreview } from '@/components/home/ServicesPreview';

export const metadata: Metadata = {
  title: "Don's Fences & Services | Fence Contractor Enderby BC",
  description:
    "Don's Fences & Services — fence contractor in Enderby, BC since 2002. Ranch, highway, farm, and residential fencing across Vernon, Armstrong, Lake Country, Kelowna, and Salmon Arm.",
  alternates: { canonical: 'https://donsfences.ca' },
  openGraph: {
    url: 'https://donsfences.ca',
    title: "Don's Fences & Services | Fence Contractor Enderby BC",
    description:
      "Don's Fences & Services — fence contractor in Enderby, BC since 2002. Highway, ranch, and residential fencing across the BC interior.",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesPreview />
      <AboutTeaser />
      <GalleryPreview />
    </>
  );
}
