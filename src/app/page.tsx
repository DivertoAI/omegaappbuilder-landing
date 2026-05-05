import type { Metadata } from 'next';
import HomePageClient from '@/components/HomePageClient';

export const metadata: Metadata = {
  title: 'Omega — AI Agents, 3D Websites & Apps',
  description: 'We build AI SDRs and 3D funnels that increase demo bookings and conversion rates — or we don\'t charge. Founder-focused studio for SaaS, DevTools, AI, and fintech. Book a free 20-min scoping call.',
  alternates: {
    canonical: 'https://omegaappbuilder.com',
  },
  openGraph: {
    title: 'Omega — AI Agents, 3D Websites & Apps',
    description: 'AI SDRs and 3D funnels that increase demo bookings — or we don\'t charge. Book a free scoping call.',
    url: 'https://omegaappbuilder.com',
    type: 'website',
  },
};

export default function Home() {
  return <HomePageClient />;
}
