import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

import { Text } from '@/components/Text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getDelayClass } from '@/utils/animations';

const fenceTypes = [
  'Ranch & Farm Fencing',
  'Highway Fencing',
  'BC Parks Projects',
  'Forestry Fencing',
  'Residential Fencing',
  'Custom Gates',
  'Chain Link Fencing',
  'Chain Link Gates',
  'Barbed Wire Fencing',
  'Agricultural Fencing',
  'Commercial Fencing',
];

const highlights = [
  'Fencing since 2002 — 24 years hands-on',
  'BC Parks & highway-scale projects',
  'Precision work — fixed to the centimeter',
  'Enderby-based, serving the BC interior',
];

export function FencingSection() {
  return (
    <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
      <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-2'>
        <div className='flex flex-col gap-6'>
          <div>
            <Badge className={`fade-in-from-bottom mb-4 ${getDelayClass(1)}`}>
              Flagship Service
            </Badge>
            <Text
              as='h2'
              variant='hd-xxl'
              className={`fade-in-from-bottom ${getDelayClass(2)} mb-4 font-display
                tracking-wide`}
            >
              Fencing & Gates
            </Text>
            <Text
              size='lg'
              variant='muted'
              className={`fade-in-from-bottom ${getDelayClass(3)}`}
            >
              From a single residential gate to kilometres of highway barrier — if it
              needs a fence, I build it right. Based in Enderby, BC, serving the entire
              interior.
            </Text>
          </div>

          <div className='flex flex-col gap-2'>
            {highlights.map((h, index) => (
              <div
                key={h}
                className={`fade-in-from-bottom flex items-center gap-2
                ${getDelayClass(index + 4)}`}
              >
                <CheckCircle className='h-4 w-4 shrink-0 text-primary' />
                <Text size='sm'>{h}</Text>
              </div>
            ))}
          </div>

          <div className={`fade-in-up ${getDelayClass(8)} flex flex-wrap gap-2`}>
            {fenceTypes.map((type) => (
              <Badge key={type} variant='secondary'>
                {type}
              </Badge>
            ))}
          </div>

          <Button
            asChild
            className={`fade-in-from-bottom ${getDelayClass(9)} self-start`}
          >
            <Link href='/contact'>Get a Quote</Link>
          </Button>
        </div>

        <div
          className={`fade-in-editorial ${getDelayClass(2)} relative h-[480px]
            overflow-hidden rounded-lg`}
        >
          <Image
            src='/don_4.jpg'
            alt="Professional fence installation by Don's Fences & Services"
            fill
            className='object-cover'
          />
        </div>
      </div>
    </section>
  );
}
