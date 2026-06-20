import { Mail, MapPin, Phone } from 'lucide-react';
import { Badge } from '@/components/ui';

import { Text } from '@/components/Text';
import { Separator } from '@/components/ui/separator';
import { getDelayClass } from '@/utils/animations';

const serviceAreas = [
  'Enderby',
  'Vernon',
  'Armstrong',
  'Lake Country',
  'Kelowna',
  'Salmon Arm',
  'BC Interior',
];

export function ContactInfo() {
  return (
    <div className='flex flex-col gap-6'>
      <div className={`fade-in-from-bottom ${getDelayClass(0)}`}>
        <Text variant='hd-lg' className='mb-2 font-display tracking-wide'>
          Get in Touch
        </Text>
        <Text variant='muted'>
          Fill out the form and I'll get back to you. No run-around.
        </Text>
      </div>

      <Separator className={`fade-in-opacity ${getDelayClass(1)}`} />

      <div className='flex flex-col gap-5'>
        <div
          className={`fade-in-from-bottom ${getDelayClass(2)} flex items-center gap-3`}
        >
          <Phone className='h-5 w-5 shrink-0 text-muted-foreground' />
          <div className='flex flex-row gap-1'>
            <Text variant='label' size='sm'>
              Phone:
            </Text>
            <a
              href='tel:+12503065064'
              className='text-sm underline transition-colors hover:text-foreground'
            >
              (250) 306-5064
            </a>
          </div>
        </div>

        <div
          className={`fade-in-from-bottom ${getDelayClass(3)} flex items-center gap-3`}
        >
          <Mail className='h-5 w-5 shrink-0 text-muted-foreground' />
          <div className='flex flex-row gap-1'>
            <Text variant='label' size='sm'>
              Email:
            </Text>
            <a
              href='mailto:doncookbc@yahoo.ca'
              className='text-sm underline transition-colors hover:text-foreground'
            >
              doncookbc@yahoo.ca
            </a>
          </div>
        </div>

        <div
          className={`fade-in-from-bottom ${getDelayClass(4)} flex items-start gap-3`}
        >
          <MapPin className='mt-1 h-5 w-5 shrink-0 text-muted-foreground' />
          <div className='flex flex-col gap-1'>
            <Text variant='label' size='sm'>
              Address
            </Text>
            <a
              href='https://www.google.com/maps/place/Don%27s+Fences/@50.5501916,-119.1256252,17z/data=!4m16!1m9!3m8!1s0x537e8845ed7ef089:0x64f2599a99c8404c!2s67+Enderby+Mabel+Lk+Rd,+Enderby,+BC+V0E+1V4!3b1!8m2!3d50.5502895!4d-119.1256927!10e5!16s%2Fg%2F11c5pvk06n!3m5!1s0x537e8936c83c1faf:0xb3ca86e28c69c637!8m2!3d50.5501872!4d-119.1243997!16s%2Fg%2F11s5gzx4zf?entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D'
              target='_blank'
              rel='noopener noreferrer'
              className='text-sm underline transition-colors hover:text-foreground'
            >
              67 Enderby Mabel Lk Rd
              <br />
              Enderby, BC V0E 1V4
            </a>
          </div>
        </div>

        <div className={`fade-in-from-bottom ${getDelayClass(5)} flex items-start gap-3`}>
          <MapPin className='mt-1 h-5 w-5 shrink-0 text-muted-foreground' />
          <div className='flex flex-col gap-2'>
            <Text variant='label' size='sm'>
              Service Areas
            </Text>
            <div className='flex flex-wrap gap-1'>
              {serviceAreas.map((area) => (
                <Badge key={area} variant={'outline'}>
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
