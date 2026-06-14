import Link from 'next/link';
import { Car, Fence, Layers, Snowflake } from 'lucide-react';

import { Text } from '@/components/Text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getDelayClass } from '@/utils/animations';

const services = [
  {
    icon: Fence,
    title: 'Fencing & Gates',
    description:
      'Ranch fences, highway barriers, BC Parks projects, residential and farm fencing. Built to last decades.',
    featured: true,
  },
  {
    icon: Layers,
    title: 'Wood Milling',
    description:
      'Raw lumber cut and shaped to your spec. Boards, planks, custom dimensions — straight from the source.',
    featured: false,
  },
  {
    icon: Car,
    title: 'Automotive',
    description: 'Mechanical work handled with the same precision I bring to every job.',
    featured: false,
  },
  {
    icon: Snowflake,
    title: 'Cold Storage Rental',
    description:
      'Refrigerated units for meat aging, cattle storage, and agricultural cold storage rental.',
    featured: false,
  },
];

export function ServicesPreview() {
  return (
    <section className='mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8'>
      <div className='mb-12 text-center'>
        <Text
          variant='hd-xxl'
          className='fade-in-from-bottom mb-3 font-display tracking-wide'
        >
          What We Do
        </Text>
        <Text
          variant='muted'
          size='lg'
          className={`fade-in-from-bottom ${getDelayClass(1)} mx-auto max-w-xl`}
        >
          Fencing is the flagship. Everything else we do, we do right.
        </Text>
      </div>

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        {services.map(({ icon: Icon, title, description, featured }, index) => (
          <Card
            key={title}
            className={`fade-in-scale ${getDelayClass(index + 2)}
            ${featured ? 'border-primary/30 bg-primary/5' : ''}`}
          >
            <CardHeader className='pb-2'>
              <Icon
                className={`mb-2 h-8 w-8
                ${featured ? 'text-primary' : 'text-muted-foreground'}`}
              />
              <Text variant='hd-sm'>{title}</Text>
            </CardHeader>
            <CardContent>
              <Text variant='muted' size='sm'>
                {description}
              </Text>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className='mt-10 text-center'>
        <Button
          variant='outline'
          size='lg'
          className={`fade-in-from-bottom ${getDelayClass(6)}`}
          asChild
        >
          <Link href='/services'>View All Services</Link>
        </Button>
      </div>
    </section>
  );
}
