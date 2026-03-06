import type { Metadata } from 'next';
import OmegaChatApiClient from '@/components/products/OmegaChatApiClient';

export const metadata: Metadata = {
  title: 'Omega Chat API | Signup, Pay, and Get Auth Token',
  description:
    'Launch with Omega Chat Completion API in minutes. Sign up, pay via Razorpay, and start using your auth token immediately.',
  alternates: { canonical: '/omega-chat-api' },
  openGraph: {
    title: 'Omega Chat Completion API',
    description:
      'A guided onboarding flow for account creation, Razorpay checkout, and instant API token access.',
    url: '/omega-chat-api',
    type: 'website',
  },
};

export default function OmegaChatApiPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900">
      <OmegaChatApiClient />
    </main>
  );
}
