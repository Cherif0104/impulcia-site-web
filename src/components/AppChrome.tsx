'use client';

import { usePathname } from 'next/navigation';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import CrmClientProviders from '@/src/components/crm/CrmClientProviders';

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = /^\/(fr|en)\/admin(\/|$)/.test(pathname || '');
  const isClientPortal = /^\/(fr|en)\/(client-space|client\/login)(\/|$)/.test(pathname || '');

  if (isAdmin || isClientPortal) {
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
