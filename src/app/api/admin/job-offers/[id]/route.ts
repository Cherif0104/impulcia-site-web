import { NextRequest, NextResponse } from 'next/server';
import { hasRequiredAdminRole, isAdminAuthenticated } from '@/src/lib/admin-auth';
import { deleteJobOffer, updateJobOffer } from '@/src/lib/db';
import { sanitizeText } from '@/src/lib/anti-abuse';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!(await hasRequiredAdminRole(['workspace_manager', 'org_admin', 'owner'], request))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await params;
  try {
    const body = await request.json();
    const offer = await updateJobOffer(id, {
      title: body.title !== undefined ? sanitizeText(body.title, 180) : undefined,
      slug: body.slug !== undefined ? sanitizeText(body.slug, 120).toLowerCase() : undefined,
      location: body.location !== undefined ? sanitizeText(body.location, 120) : undefined,
      team: body.team !== undefined ? sanitizeText(body.team, 120) : undefined,
      description: body.description !== undefined ? sanitizeText(body.description, 12000) : undefined,
      employmentType:
        body.employmentType === 'part_time' ||
        body.employmentType === 'contract' ||
        body.employmentType === 'internship' ||
        body.employmentType === 'full_time'
          ? body.employmentType
          : undefined,
      published: body.published === undefined ? undefined : body.published === true,
    });
    if (!offer) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ offer });
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!(await hasRequiredAdminRole(['org_admin', 'owner'], request))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await params;
  await deleteJobOffer(id);
  return NextResponse.json({ success: true });
}
