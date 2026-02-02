import type { Metadata } from 'next';
import AiBuilderClient from '@/components/ai/AiBuilderClient';

export const metadata: Metadata = {
  title: 'Omega AI Website Builder',
  description:
    'A production-grade AI website builder UI for chat-driven site generation, live preview, file tree, and build logs.',
  openGraph: {
    title: 'Omega AI Website Builder',
    description:
      'Chat-driven website building with live preview, files, and build logs.',
    url: '/ai',
    type: 'website',
  },
};

export default function AiBuilderPage() {
  return <AiBuilderClient />;
}
