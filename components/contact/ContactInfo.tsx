import { Mail, MapPin, Phone } from 'lucide-react';

import { Text } from '@/components/Text';
import { Separator } from '@/components/ui/separator';

const serviceAreas = [
  'Enderby',
  'Vernon',
  'Armstrong',
  'Salmon Arm',
  'Okanagan Valley',
  'BC Interior',
];

export function ContactInfo() {
  return (
    <div className='flex flex-col gap-6'>
      <div>
        <Text variant='hd-lg' className='font-display mb-2 tracking-wide'>
          Get in Touch
        </Text>
        <Text variant='muted'>
          Fill out the form and I'll get back to you. No run-around.
        </Text>
      </div>

      <Separator />

      <div className='flex flex-col gap-5'>
        <div className='flex items-center gap-3'>
          <Phone className='h-5 w-5 shrink-0 text-muted-foreground' />
          <div>
            <Text variant='label' size='sm'>
              Phone
            </Text>
            <Text>[PHONE]</Text>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <Mail className='h-5 w-5 shrink-0 text-muted-foreground' />
          <div>
            <Text variant='label' size='sm'>
              Email
            </Text>
            <Text>[EMAIL]</Text>
          </div>
        </div>

        <div className='flex items-start gap-3'>
          <MapPin className='mt-1 h-5 w-5 shrink-0 text-muted-foreground' />
          <div className='flex flex-col gap-2'>
            <Text variant='label' size='sm'>
              Service Areas
            </Text>
            <Text>[SERVICE_AREAS]</Text>
            <div className='flex flex-wrap gap-1'>
              {serviceAreas.map((area) => (
                <span
                  key={area}
                  className='rounded border px-2 py-0.5 text-xs text-muted-foreground'
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
