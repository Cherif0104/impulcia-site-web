import { NextRequest, NextResponse } from 'next/server';
import { hasRequiredAdminRole, isAdminAuthenticated } from '@/src/lib/admin-auth';
import { createWorkspace, listWorkspaces } from '@/src/lib/db';
import { sanitizeText } from '@/src/lib/anti-abuse';

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!(await hasRequiredAdminRole(['workspace_manager', 'org_admin', 'owner'], request))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const organizationId = sanitizeText(request.nextUrl.searchParams.get('organizationId'), 80) || undefined;
  const workspaces = await listWorkspaces(organizationId);
  return NextResponse.json({ workspaces });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!(await hasRequiredAdminRole(['workspace_manager', 'org_admin', 'owner'], request))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const body = await request.json();
    const organizationId = sanitizeText(body.organizationId, 80);
    const name = sanitizeText(body.name, 120);
    const slug = sanitizeText(body.slug, 80).toLowerCase();
    const status = body.status === 'paused' || body.status === 'archived' ? body.status : 'active';
    if (!organizationId || !name || !slug) {
      return NextResponse.json({ error: 'organizationId, name and slug are required' }, { status: 400 });
    }
    const workspace = await createWorkspace({ organizationId, name, slug, status });
    return NextResponse.json({ workspace }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
