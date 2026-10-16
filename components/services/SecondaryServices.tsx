import { Car, Layers, Megaphone, Snowflake } from 'lucide-react';

import { Text } from '@/components/Text';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getDelayClass } from '@/utils/animations';

const services = [
  {
    icon: Layers,
    title: 'Wood Milling',
    description:
      'Raw lumber cut and shaped to spec. Boards, planks, custom dimensions for construction or sale. Straight from the source, priced accordingly.',
  },
  {
    icon: Car,
    title: 'Automotive',
    description:
      'Full-service shop with mechanics who have years of expertise. Routine maintenance to complex repairs — done right.',
  },
  {
    icon: Snowflake,
    title: 'Cold Storage Rental',
    description:
      'Refrigerated storage units for rent. Hunters and ranchers store moose, beef, and game — hang it, age it, pick it up when ready. Contact for availability and daily rates.',
  },
  {
    icon: Megaphone,
    title: 'BC Billboards',
    description:
      'Installation and removal of advertising posters on highway billboard structures across BC. Experienced with roadside billboard maintenance along major BC corridors.',
  },
];

export function SecondaryServices() {
  return (
    <section className='bg-muted/30'>
      <div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
        <div className='mb-10'>
          <Text
            variant='hd-xl'
            className='fade-in-from-bottom mb-2 font-display tracking-wide'
          >
            Additional Services
          </Text>
          <Text
            variant='muted'
            size='lg'
            className={`fade-in-from-bottom ${getDelayClass(1)}`}
          >
            Fencing is what I&apos;m known for. These are the other ways I can help.
          </Text>
        </div>

        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {services.map(({ icon: Icon, title, description }, index) => (
            <Card key={title} className={`fade-in-scale ${getDelayClass(index + 2)}`}>
              <CardHeader className='pb-2'>
                <Icon className='mb-2 h-7 w-7 text-muted-foreground' />
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
      </div>
    </section>
  );
}
