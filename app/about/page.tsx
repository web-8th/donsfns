import type { Metadata } from 'next';

import { AboutHero } from '@/components/about/AboutHero';
import { ExperienceHighlights } from '@/components/about/ExperienceHighlights';

export const metadata: Metadata = {
  title: 'About Don — Fence Contractor Since 2002',
  description:
    "Don's Fences & Services — fencing the BC interior since 2002. Highway, farm, and forestry projects across Enderby, Vernon, Armstrong, Lake Country, Kelowna, and Salmon Arm.",
  keywords: [
    'about Don fencing Enderby',
    'BC fencing contractor since 2002',
    'highway fencing BC interior',
    'farm fencing BC',
    'forestry fencing contractor BC',
    'Enderby BC contractor',
  ],
  alternates: { canonical: 'https://donsfences.ca/about' },
  openGraph: {
    url: 'https://donsfences.ca/about',
    title: "About | Don's Fences & Services",
    description:
      'Fencing the BC interior since 2002. Highway, farm, and forestry projects across Enderby, Vernon, Armstrong, Lake Country, Kelowna, and Salmon Arm.',
    images: [
      {
        url: '/don_1.jpg',
        width: 1200,
        height: 630,
        alt: "Don — owner of Don's Fences & Services",
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <>
      <div className='pt-24' />
      <AboutHero />
      <ExperienceHighlights />
    </>
  );
}
