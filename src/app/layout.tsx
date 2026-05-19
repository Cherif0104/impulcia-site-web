import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IMPULCIA AFRIQUE | Enterprise Digital Systems for Africa',
  description:
    'COYA ERP — Plateforme enterprise pour la gouvernance, les opérations et la transformation digitale des organisations africaines.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
