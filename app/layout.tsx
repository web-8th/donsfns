import type { Metadata } from 'next';
import { Bebas_Neue, IBM_Plex_Mono, Lora, Plus_Jakarta_Sans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';

import { Navbar } from '@/components/Navbar';
import { SiteFooter } from '@/components/SiteFooter';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
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
  title: "Don's Fences & Services | Fence Installation Enderby BC",
  description:
    'Professional fence installation in Enderby, BC. Serving Vernon, Armstrong, Salmon Arm, and the Okanagan. 12+ years experience including BC Parks and highway fencing.',
  keywords: [
    'fencing Enderby BC',
    'fence installation Okanagan',
    'BC fencing contractor',
    'contractor Enderby',
    "Don's Fences",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body
        className={`${plusJakartaSans.variable} ${lora.variable} ${ibmPlexMono.variable}
          ${bebasNeue.variable} antialiased`}
      >
        <ThemeProvider attribute='class' defaultTheme='light' enableSystem>
          <ToastProvider>
            <Navbar />
            <main>{children}</main>
            <SiteFooter />
            <Toaster />
            <Analytics />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
