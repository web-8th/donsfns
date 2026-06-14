import type { Metadata } from 'next';

import { FencingSection } from '@/components/services/FencingSection';
import { SecondaryServices } from '@/components/services/SecondaryServices';
import { Text } from '@/components/Text';

export const metadata: Metadata = {
  title: "Services | Don's Fences & Services — Fencing Contractor Enderby BC",
  description:
    'Fencing, gates, wood milling, automotive, and cold storage rental. Professional contractor services in Enderby, BC and the Okanagan.',
};

export default function ServicesPage() {
  return (
    <>
      <div className='mx-auto max-w-7xl px-4 pb-8 pt-28 sm:px-6 lg:px-8'>
        <Text variant='hd-xxl' className='font-display tracking-wide'>
          Services
        </Text>
        <Text variant='muted' size='lg' className='mt-2 max-w-xl'>
          Fencing is the core. Everything else gets the same attention.
        </Text>
      </div>
      <FencingSection />
      <SecondaryServices />
    </>
  );
}
