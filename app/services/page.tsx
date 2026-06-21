import type { Metadata } from 'next';

import { FencingSection } from '@/components/services/FencingSection';
import { SecondaryServices } from '@/components/services/SecondaryServices';
import { Text } from '@/components/Text';
import { getDelayClass } from '@/utils/animations';

export const metadata: Metadata = {
  title: 'Fence Installation & Services — Enderby BC',
  description:
    'Fencing & gates, wood milling, automotive, cold storage rental, and BC billboard installation in Enderby, BC. Serving the BC interior — Vernon, Armstrong, Lake Country, Kelowna, and Salmon Arm.',
  keywords: [
    'fence installation Enderby',
    'ranch fencing BC',
    'highway fencing contractor',
    'custom gates Okanagan',
    'wood milling Enderby BC',
    'cold storage rental BC',
    'automotive Enderby BC',
    'BC billboard installation',
    'highway billboard poster BC',
  ],
  alternates: { canonical: 'https://donsfences.ca/services' },
  openGraph: {
    url: 'https://donsfences.ca/services',
    title: "Services | Don's Fences & Services",
    description:
      'Fencing, custom gates, wood milling, automotive, and cold storage rental. Enderby, BC contractor serving the BC interior.',
    images: [
      { url: '/don_4.jpg', width: 1200, height: 630, alt: 'Fence installation by Don' },
    ],
  },
};

export default function ServicesPage() {
  return (
    <>
      <div className='mx-auto max-w-7xl px-4 pb-8 pt-28 sm:px-6 lg:px-8'>
        <Text
          variant='hd-xxl'
          className={`font-display tracking-wide fade-in-from-bottom ${getDelayClass(1)}`}
        >
          Services
        </Text>
        <Text
          variant='muted'
          size='lg'
          className={`mt-2 max-w-xl fade-in-from-bottom ${getDelayClass(2)}`}
        >
          Fencing is the core. Everything else gets the same attention.
        </Text>
      </div>
      <FencingSection />
      <SecondaryServices />
    </>
  );
}
