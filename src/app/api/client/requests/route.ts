import { NextRequest, NextResponse } from 'next/server';
import { createServiceRequest, listServiceRequests } from '@/src/lib/db';
import { sanitizeText } from '@/src/lib/anti-abuse';
import { readClientSession } from '@/src/lib/client-auth';

export async function GET(request: NextRequest) {
  const session = await readClientSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const workspaceId =
    sanitizeText(request.nextUrl.searchParams.get('workspaceId'), 80) || session.workspaceIds[0] || '';
  const createdByEmail = session.email;
  const organizationId =
    sanitizeText(request.nextUrl.searchParams.get('organizationId'), 80) || session.organizationIds[0] || undefined;
  const status = sanitizeText(request.nextUrl.searchParams.get('status'), 20) || undefined;

  if (!workspaceId) {
    return NextResponse.json({ error: 'workspaceId is required' }, { status: 400 });
  }
  if (!session.workspaceIds.includes(workspaceId)) {
    return NextResponse.json({ error: 'Forbidden workspace' }, { status: 403 });
  }
  if (organizationId && !session.organizationIds.includes(organizationId)) {
    return NextResponse.json({ error: 'Forbidden organization' }, { status: 403 });
  }

  const requests = await listServiceRequests({
    workspaceId,
    organizationId,
    status:
      status === 'new' || status === 'triaged' || status === 'in_progress' || status === 'blocked' || status === 'done'
        ? status
        : undefined,
    createdByEmail,
  });
  return NextResponse.json({ requests });
}

export async function POST(request: NextRequest) {
  const session = await readClientSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const workspaceId = sanitizeText(body.workspaceId, 80);
    const organizationId = sanitizeText(body.organizationId, 80);
    const title = sanitizeText(body.title, 180);
    const description = sanitizeText(body.description, 4000) || undefined;
    const createdByEmail = session.email;
    const priority =
      body.priority === 'low' || body.priority === 'high' || body.priority === 'critical'
        ? body.priority
        : 'medium';

    if (!workspaceId || !organizationId || !title || !description || !createdByEmail) {
      return NextResponse.json(
        { error: 'workspaceId, organizationId, title, description and createdByEmail are required' },
        { status: 400 }
      );
    }
    if (!session.workspaceIds.includes(workspaceId)) {
      return NextResponse.json({ error: 'Forbidden workspace' }, { status: 403 });
    }
    if (!session.organizationIds.includes(organizationId)) {
      return NextResponse.json({ error: 'Forbidden organization' }, { status: 403 });
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
