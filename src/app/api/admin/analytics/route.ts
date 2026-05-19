import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/src/lib/admin-auth';
import { getAnalyticsSummary } from '@/src/lib/db';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const stats = await getAnalyticsSummary();
  return NextResponse.json({ stats });
}
