import { cookies } from 'next/headers';
import { createHash, timingSafeEqual } from 'crypto';
import type { NextRequest } from 'next/server';

export const ADMIN_COOKIE = 'impulcia_admin_session';
export const ADMIN_ROLE_COOKIE = 'impulcia_admin_role';

const ROLE_RANK: Record<string, number> = {
  owner: 100,
  org_admin: 90,
  workspace_manager: 80,
  project_manager: 70,
  engineer_fullstack: 60,
  engineer_be: 55,
  engineer_fe: 50,
  support: 40,
  viewer: 20,
  client: 10,
};

export function getAdminSecret(): string | undefined {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
}

export function hashToken(secret: string): string {
  return createHash('sha256').update(`impulcia-admin:${secret}`).digest('hex');
}

export function verifyAdminPassword(password: string): boolean {
  const secret = getAdminSecret();
  if (!secret) return false;
  try {
    const a = Buffer.from(hashToken(password));
    const b = Buffer.from(hashToken(secret));
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return password === secret;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const secret = getAdminSecret();
  if (!secret) return false;

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return false;

  try {
    const a = Buffer.from(token);
    const b = Buffer.from(hashToken(secret));
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function getAdminSessionToken(): string {
  const secret = getAdminSecret();
  if (!secret) throw new Error('ADMIN_SECRET not configured');
  return hashToken(secret);
}

export function getAdminDefaultRole(): string {
  return process.env.ADMIN_DEFAULT_ROLE?.trim() || 'owner';
}

function isRoleEnforcementEnabled(): boolean {
  return process.env.ADMIN_ENFORCE_ROLES === '1' || process.env.ADMIN_ENFORCE_ROLES === 'true';
}

async function readRoleCookieFromServer(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_ROLE_COOKIE)?.value ?? null;
}

function readRoleCookieFromRequest(request: NextRequest): string | null {
  return request.cookies.get(ADMIN_ROLE_COOKIE)?.value ?? null;
}

export async function getCurrentAdminRole(request?: NextRequest): Promise<string> {
  const roleFromCookie = request ? readRoleCookieFromRequest(request) : await readRoleCookieFromServer();
  if (roleFromCookie) return roleFromCookie;

  return getAdminDefaultRole();
}

export async function hasRequiredAdminRole(
  allowedRoles: string[],
  request?: NextRequest
): Promise<boolean> {
  if (!isRoleEnforcementEnabled()) {
    return true;
  }

  const currentRole = await getCurrentAdminRole(request);
  const currentRank = ROLE_RANK[currentRole];
  if (!Number.isFinite(currentRank)) return false;

  return allowedRoles.some((role) => {
    const rank = ROLE_RANK[role];
    return Number.isFinite(rank) && currentRank >= rank;
  });
}
