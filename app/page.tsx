import type { Metadata } from 'next';

import { AboutTeaser } from '@/components/home/AboutTeaser';
import { GalleryPreview } from '@/components/home/GalleryPreview';
import { HeroSection } from '@/components/home/HeroSection';
import { ServicesPreview } from '@/components/home/ServicesPreview';

export const metadata: Metadata = {
  title: "Don's Fences & Services | Fence Contractor Okanagan & Kamloops BC",
  description:
    "Don's Fences & Services — fence contractor in Enderby, BC since 2002. Ranch, highway, farm, and residential fencing across the Okanagan, Kamloops, and Revelstoke.",
  alternates: { canonical: 'https://donsfences.ca' },
  openGraph: {
    url: 'https://donsfences.ca',
    title: "Don's Fences & Services | Fence Contractor Okanagan & Kamloops BC",
    description:
      "Don's Fences & Services — fence contractor in Enderby, BC since 2002. Highway, ranch, and residential fencing across the Okanagan, Kamloops, and Revelstoke.",
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
