'use client';

import { usePathname } from 'next/navigation';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import CrmClientProviders from '@/src/components/crm/CrmClientProviders';

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = /^\/(fr|en)\/admin(\/|$)/.test(pathname || '');

  if (isAdmin) {
    return <main>{children}</main>;
  }

  return (
    <>
      <CrmClientProviders />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
