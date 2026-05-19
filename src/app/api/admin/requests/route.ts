import { NextRequest, NextResponse } from 'next/server';
import { hasRequiredAdminRole, isAdminAuthenticated } from '@/src/lib/admin-auth';
import { createServiceRequest, listServiceRequests } from '@/src/lib/db';
import { sanitizeText } from '@/src/lib/anti-abuse';

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!(await hasRequiredAdminRole(['support', 'workspace_manager', 'org_admin', 'owner'], request))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const workspaceId = sanitizeText(request.nextUrl.searchParams.get('workspaceId'), 80) || undefined;
  const requests = await listServiceRequests(workspaceId);
  return NextResponse.json({ requests });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!(await hasRequiredAdminRole(['support', 'workspace_manager', 'org_admin', 'owner'], request))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const body = await request.json();
    const workspaceId = sanitizeText(body.workspaceId, 80);
    const organizationId = sanitizeText(body.organizationId, 80);
    const title = sanitizeText(body.title, 180);
    const description = sanitizeText(body.description, 4000) || undefined;
    const createdByEmail = sanitizeText(body.createdByEmail, 160) || undefined;
    const priority =
      body.priority === 'low' || body.priority === 'high' || body.priority === 'critical'
        ? body.priority
        : 'medium';
    if (!workspaceId || !organizationId || !title) {
      return NextResponse.json({ error: 'workspaceId, organizationId and title are required' }, { status: 400 });
    }
    const serviceRequest = await createServiceRequest({
      workspaceId,
      organizationId,
      title,
      description,
      createdByEmail,
      priority,
    });
    return NextResponse.json({ request: serviceRequest }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
