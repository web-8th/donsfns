import type { Metadata } from 'next';

import { AboutHero } from '@/components/about/AboutHero';
import { ExperienceHighlights } from '@/components/about/ExperienceHighlights';

export const metadata: Metadata = {
  title: "About | Don's Fences & Services — Enderby BC Contractor",
  description:
    "12+ years of professional fencing in Enderby, BC. BC Parks, highway, and forestry projects. Don's Fences & Services serves the entire Okanagan.",
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
