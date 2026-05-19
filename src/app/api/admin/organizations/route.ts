import { NextRequest, NextResponse } from 'next/server';
import { hasRequiredAdminRole, isAdminAuthenticated } from '@/src/lib/admin-auth';
import { createOrganization, listOrganizations } from '@/src/lib/db';
import { sanitizeText } from '@/src/lib/anti-abuse';

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!(await hasRequiredAdminRole(['org_admin', 'owner'], request))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const organizations = await listOrganizations();
  return NextResponse.json({ organizations });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!(await hasRequiredAdminRole(['org_admin', 'owner'], request))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const name = sanitizeText(body.name, 120);
    const slug = sanitizeText(body.slug, 80).toLowerCase();
    const type = body.type === 'parent' ? 'parent' : 'client';
    const parentOrgId = sanitizeText(body.parentOrgId, 80) || null;
    if (!name || !slug) {
      return NextResponse.json({ error: 'name and slug are required' }, { status: 400 });
    }
    const organization = await createOrganization({ name, slug, type, parentOrgId });
    return NextResponse.json({ organization }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
