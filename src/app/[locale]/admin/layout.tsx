import type { Metadata } from 'next';
import { createAdminNoindexMetadata } from '@/src/lib/seo/metadata';

export const metadata: Metadata = createAdminNoindexMetadata();

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
