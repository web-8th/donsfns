import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Expose the Turnstile site key (public by design) to client components
  env: { NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.CLOUDFLARE_SITE_KEY ?? '' },
  serverExternalPackages: ['@react-pdf/renderer'],
};

export default nextConfig;
