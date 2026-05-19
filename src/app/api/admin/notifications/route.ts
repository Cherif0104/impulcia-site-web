import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/src/lib/admin-auth';
import { getAdminNotificationSummary } from '@/src/lib/db';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const summary = await getAdminNotificationSummary();
    return NextResponse.json(summary);
  } catch (error) {
    console.error('[admin/notifications] fallback to empty summary', error);
    return NextResponse.json({
      newLeads: 0,
      inboundMessages: 0,
      hasUpdates: false,
      degraded: true,
    });
  }
}
