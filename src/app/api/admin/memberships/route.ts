import { NextRequest, NextResponse } from 'next/server';
import { hasRequiredAdminRole, isAdminAuthenticated } from '@/src/lib/admin-auth';
import { createMembership, createUserProfile, listMemberships, listUserProfiles } from '@/src/lib/db';
import { sanitizeText } from '@/src/lib/anti-abuse';

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!(await hasRequiredAdminRole(['workspace_manager', 'org_admin', 'owner'], request))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const [memberships, users] = await Promise.all([listMemberships(), listUserProfiles()]);
  return NextResponse.json({ memberships, users });
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
    let userProfileId = sanitizeText(body.userProfileId, 80);

    if (!userProfileId) {
      const email = sanitizeText(body.email, 160).toLowerCase();
      const displayName = sanitizeText(body.displayName, 120);
      if (!email || !displayName) {
        return NextResponse.json({ error: 'userProfileId or email + displayName is required' }, { status: 400 });
      }
      const profile = await createUserProfile({ email, displayName, roleHint: sanitizeText(body.roleHint, 120) });
      userProfileId = profile.id;
    }

    const role = sanitizeText(body.role, 50);
    if (
      ![
        'owner',
        'org_admin',
        'workspace_manager',
        'project_manager',
        'engineer_fe',
        'engineer_be',
        'engineer_fullstack',
        'support',
        'viewer',
        'client',
      ].includes(role)
    ) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const membership = await createMembership({
      userProfileId,
      organizationId: sanitizeText(body.organizationId, 80) || undefined,
      workspaceId: sanitizeText(body.workspaceId, 80) || undefined,
      role: role as
        | 'owner'
        | 'org_admin'
        | 'workspace_manager'
        | 'project_manager'
        | 'engineer_fe'
        | 'engineer_be'
        | 'engineer_fullstack'
        | 'support'
        | 'viewer'
        | 'client',
    });
    return NextResponse.json({ membership }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
