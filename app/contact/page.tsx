import type { Metadata } from 'next';

import { ContactForm } from '@/components/contact/ContactForm';
import { ContactInfo } from '@/components/contact/ContactInfo';
import { Text } from '@/components/Text';
import { getDelayClass } from '@/utils/animations';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    "Get a free quote for fence installation in Enderby, Vernon, Armstrong, Salmon Arm, and the Okanagan. Contact Don's Fences & Services — (250) 306-5064.",
  keywords: [
    'fence quote Enderby BC',
    'free fence estimate Okanagan',
    'contact fencing contractor BC',
    'fence installation quote Vernon',
    'fencing estimate Salmon Arm',
  ],
  alternates: { canonical: 'https://donsfences.ca/contact' },
  openGraph: {
    url: 'https://donsfences.ca/contact',
    title: "Contact | Don's Fences & Services",
    description:
      "Get a free fence installation quote for Enderby, Vernon, Armstrong, Salmon Arm, and the Okanagan. Call (250) 306-5064.",
  },
};

export default function ContactPage() {
  return (
    <div className='mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8'>
      <div className='mb-10'>
        <Text
          variant='hd-xxl'
          className={`font-display tracking-wide fade-in-from-bottom ${getDelayClass(1)}`}
        >
          Contact
        </Text>
        <Text
          variant='muted'
          size='lg'
          className={`mt-2 fade-in-from-bottom ${getDelayClass(2)}`}
        >
          Ready to get started? Reach out below.
        </Text>
      </div>

      <div className='grid grid-cols-1 gap-12 lg:grid-cols-2'>
        <ContactForm />
        <ContactInfo />
      </div>
    </div>
  );
}
