import { NextRequest, NextResponse } from 'next/server';
import { createRequestInteraction, getServiceRequest, listRequestInteractions } from '@/src/lib/db';
import { sanitizeText } from '@/src/lib/anti-abuse';
import { readClientSession } from '@/src/lib/client-auth';

async function canAccessRequest(
  requestId: string,
  email: string,
  allowedWorkspaces: string[],
  allowedOrganizations: string[]
): Promise<boolean> {
  const serviceRequest = await getServiceRequest(requestId);
  if (!serviceRequest) return false;
  if ((serviceRequest.created_by_email ?? '').toLowerCase() !== email.toLowerCase()) return false;
  if (!allowedWorkspaces.includes(serviceRequest.workspace_id)) return false;
  if (!allowedOrganizations.includes(serviceRequest.organization_id)) return false;
  return true;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await readClientSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const allowed = await canAccessRequest(
    id,
    session.email,
    session.workspaceIds,
    session.organizationIds
  );
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const interactions = await listRequestInteractions(id);
  return NextResponse.json({ interactions });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await readClientSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  try {
    const body = await request.json();
    const message = sanitizeText(body.body, 4000);
    if (!message) {
      return NextResponse.json({ error: 'body is required' }, { status: 400 });
    }

    const allowed = await canAccessRequest(
      id,
      session.email,
      session.workspaceIds,
      session.organizationIds
    );
    if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const interaction = await createRequestInteraction({
      requestId: id,
      authorType: 'client',
      body: message,
    });
    return NextResponse.json({ interaction }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
