import { NextRequest, NextResponse } from 'next/server';
import { hasRequiredAdminRole, isAdminAuthenticated } from '@/src/lib/admin-auth';
import { updateServiceRequestStatus } from '@/src/lib/db';
import { sanitizeText } from '@/src/lib/anti-abuse';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!(await hasRequiredAdminRole(['support', 'workspace_manager', 'org_admin', 'owner'], request))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await params;
  try {
    const body = await request.json();
    const status = sanitizeText(body.status, 20);
    if (!['new', 'triaged', 'in_progress', 'blocked', 'done'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    const updated = await updateServiceRequestStatus(id, status as 'new' | 'triaged' | 'in_progress' | 'blocked' | 'done');
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ request: updated });
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
