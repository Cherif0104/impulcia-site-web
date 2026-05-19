import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/src/lib/admin-auth';
import AdminShell from '@/src/components/crm/AdminShell';

export default async function AdminPanelLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(await isAdminAuthenticated())) {
    redirect(`/${locale}/admin/login`);
  }
  return <AdminShell>{children}</AdminShell>;
}
