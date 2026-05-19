import { NextRequest, NextResponse } from 'next/server';
import { hasRequiredAdminRole, isAdminAuthenticated } from '@/src/lib/admin-auth';
import { createRequestInteraction, listRequestInteractions } from '@/src/lib/db';
import { sanitizeText } from '@/src/lib/anti-abuse';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!(await hasRequiredAdminRole(['support', 'workspace_manager', 'org_admin', 'owner'], request))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await params;
  const interactions = await listRequestInteractions(id);
  return NextResponse.json({ interactions });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!(await hasRequiredAdminRole(['support', 'workspace_manager', 'org_admin', 'owner'], request))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await params;
  try {
    const body = await request.json();
    const authorType =
      body.authorType === 'client' || body.authorType === 'system' ? body.authorType : 'staff';
    const message = sanitizeText(body.body, 4000);
    if (!message) {
      return NextResponse.json({ error: 'body is required' }, { status: 400 });
    }
    const interaction = await createRequestInteraction({
      requestId: id,
      authorType,
      body: message,
    });
    return NextResponse.json({ interaction }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
