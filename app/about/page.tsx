import type { Metadata } from 'next';

import { AboutHero } from '@/components/about/AboutHero';
import { ExperienceHighlights } from '@/components/about/ExperienceHighlights';

export const metadata: Metadata = {
  title: 'About',
  description:
    "Don's Fences & Services — 12+ years of professional fencing in Enderby, BC. BC Parks, highway, and forestry projects. Serving Vernon, Armstrong, Salmon Arm, and the Okanagan.",
  keywords: [
    'about Don fencing Enderby',
    'BC fencing contractor 12 years',
    'BC Parks fencing contractor',
    'highway fencing BC interior',
    'forestry fencing contractor BC',
    'Enderby BC contractor',
  ],
  alternates: { canonical: 'https://donsfences.ca/about' },
  openGraph: {
    url: 'https://donsfences.ca/about',
    title: "About | Don's Fences & Services",
    description:
      "12+ years of professional fencing in Enderby, BC. BC Parks, highway, and forestry projects across the Okanagan.",
    images: [{ url: '/don_1.jpg', width: 1200, height: 630, alt: "Don — owner of Don's Fences & Services" }],
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
