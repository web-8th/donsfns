import type { Metadata } from 'next';
import { Bebas_Neue, IBM_Plex_Mono, Lora, Plus_Jakarta_Sans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';

import { MainWrapper } from '@/components/MainWrapper';
import { Navbar } from '@/components/Navbar';
import { SiteFooter } from '@/components/SiteFooter';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';

import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta-sans',
  subsets: ['latin'],
});
const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  style: ['normal', 'italic'],
});
const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  weight: ['400', '500', '700'],
  subsets: ['latin'],
});
const bebasNeue = Bebas_Neue({
  variable: '--font-bebas-neue',
  weight: '400',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://donsfences.ca'),
  title: {
    default: "Don's Fences & Services | Fence Contractor Enderby BC",
    template: "%s | Don's Fences & Services",
  },
  description:
    'Fence contractor based in Enderby, BC — serving the BC interior since 2002. Ranch, highway, farm, and residential fencing across Vernon, Kelowna, Salmon Arm, and beyond.',
  keywords: [
    'fence contractor Enderby BC',
    'fence installation Enderby BC',
    'fence contractor BC interior',
    'fence installation Vernon BC',
    'fence installation Kelowna BC',
    'fence installation Salmon Arm BC',
    'fence installation Armstrong BC',
    'fence installation Lake Country BC',
    'ranch fencing BC interior',
    'farm fencing BC',
    'highway fencing contractor BC',
    'agricultural fencing BC',
    'custom fence gates BC',
    'wood milling Enderby BC',
    'cold storage meat aging BC interior',
    "Don's Fences Enderby",
  ],
  icons: {
    icon: [
      { url: '/dons_fences_logo_1x1.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/dons_fences_logo_1x1.svg',
    apple: '/dons_fences_logo_1x1.svg',
  },
  authors: [{ name: "Don's Fences & Services", url: 'https://donsfences.ca' }],
  creator: "Don's Fences & Services",
  publisher: "Don's Fences & Services",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://donsfences.ca',
    siteName: "Don's Fences & Services",
    title: "Don's Fences & Services | Fence Contractor Enderby BC",
    description:
      'Fence contractor based in Enderby, BC — serving the BC interior since 2002. Ranch, highway, farm, and residential fencing across Vernon, Kelowna, Salmon Arm, and beyond.',
    images: [
      {
        url: '/don_3.jpg',
        width: 1200,
        height: 630,
        alt: "Don's Fences & Services — fence installation in Enderby, BC",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Don's Fences & Services | Fence Contractor Enderby BC",
    description:
      'Fence contractor based in Enderby, BC — serving the BC interior since 2002. Ranch, highway, farm, and residential fencing.',
    images: ['/don_3.jpg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  name: "Don's Fences & Services",
  alternateName: [
    "Dons Fences",
    "Don Fences",
    "Don's Fencing",
    "Dons Fencing",
    "Don's Fences and Services",
    "Don Cook Fencing",
    "Don Cook Fences",
    "Don's Fences Enderby",
    "Dons Fences Enderby",
  ],
  url: 'https://donsfences.ca',
  telephone: '+12503065064',
  email: 'doncookbc@yahoo.ca',
  foundingDate: '2002',
  description:
    'Fence contractor based in Enderby, BC. Serving the BC interior since 2002 — ranch, highway, farm, and residential fencing across Vernon, Armstrong, Lake Country, Kelowna, and Salmon Arm.',
  image: 'https://donsfences.ca/don_3.jpg',
  logo: 'https://donsfences.ca/dons_fences_logo_1x1.svg',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Enderby',
    addressRegion: 'BC',
    addressCountry: 'CA',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 50.5497,
    longitude: -119.1392,
  },
  areaServed: [
    { '@type': 'City', name: 'Enderby' },
    { '@type': 'City', name: 'Vernon' },
    { '@type': 'City', name: 'Armstrong' },
    { '@type': 'City', name: 'Lake Country' },
    { '@type': 'City', name: 'Kelowna' },
    { '@type': 'City', name: 'Salmon Arm' },
    { '@type': 'AdministrativeArea', name: 'BC Interior' },
  ],
  serviceType: [
    'Fence Installation',
    'Ranch Fencing',
    'Farm Fencing',
    'Highway Fencing',
    'Custom Gate Installation',
    'Wood Milling',
    'Automotive Repair',
    'Cold Storage Rental',
    'Billboard Installation',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Fencing & Gates',
          description:
            'Ranch, farm, highway, residential, and custom gate installation across the BC interior.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Wood Milling',
          description: 'Custom lumber cutting — boards, planks, and custom dimensions.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Automotive',
          description:
            'Full-service auto repair — routine maintenance to complex repairs.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Cold Storage Rental',
          description:
            'Refrigerated storage for hunters and ranchers to hang and age moose, beef, and game.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'BC Billboard Installation',
          description: 'Highway billboard poster installation and removal across BC.',
        },
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${lora.variable} ${ibmPlexMono.variable}
          ${bebasNeue.variable} antialiased`}
      >
        <ThemeProvider attribute='class' defaultTheme='light' enableSystem>
          <ToastProvider>
            <AuthProvider>
              <Navbar />
              <MainWrapper>{children}</MainWrapper>
              <SiteFooter />
              <Toaster />
              <Analytics />
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
