import { NextRequest, NextResponse } from 'next/server';
import { hasRequiredAdminRole, isAdminAuthenticated } from '@/src/lib/admin-auth';
import { createJobOffer, listJobOffers } from '@/src/lib/db';
import { sanitizeText } from '@/src/lib/anti-abuse';

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!(await hasRequiredAdminRole(['workspace_manager', 'org_admin', 'owner'], request))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const offers = await listJobOffers();
  return NextResponse.json({ offers });
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
    const title = sanitizeText(body.title, 180);
    const slug = sanitizeText(body.slug, 120).toLowerCase();
    const location = sanitizeText(body.location, 120) || undefined;
    const team = sanitizeText(body.team, 120) || undefined;
    const description = sanitizeText(body.description, 12000);
    const employmentType =
      body.employmentType === 'part_time' ||
      body.employmentType === 'contract' ||
      body.employmentType === 'internship'
        ? body.employmentType
        : 'full_time';
    const published = body.published === true;
    if (!title || !slug || !description) {
      return NextResponse.json({ error: 'title, slug and description are required' }, { status: 400 });
    }
    const offer = await createJobOffer({
      title,
      slug,
      location,
      team,
      description,
      employmentType,
      published,
    });
    return NextResponse.json({ offer }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
