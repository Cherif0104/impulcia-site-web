import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { getClientAuthSecretForRuntime } from '@/src/lib/env';
import { getSupabaseAdmin } from '@/src/lib/supabase/server';
import { listMemberships, listUserProfiles, updateUserProfile } from '@/src/lib/db';
import type { Membership, UserProfile } from '@/src/types/crm';

export const CLIENT_COOKIE = 'impulcia_client_session';

export type ClientStatus = 'pending' | 'active' | 'disabled';

type ClientRoleHintPayload = {
  kind: 'client_auth';
  status: ClientStatus;
  passwordHash?: string;
  updatedAt: string;
};

export type ClientAuthMeta = {
  status: ClientStatus;
  hasPassword: boolean;
  updatedAt?: string;
};

export type ClientSession = {
  email: string;
  userProfileId: string;
  organizationIds: string[];
  workspaceIds: string[];
};

type ActionPurpose = 'activate' | 'reset';

type ActionTokenPayload = {
  email: string;
  purpose: ActionPurpose;
  exp: number;
};

function toBase64Url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function fromBase64Url(input: string): Buffer {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '==='.slice((normalized.length + 3) % 4);
  return Buffer.from(padded, 'base64');
}

function getClientAuthSecret(): string {
  return getClientAuthSecretForRuntime();
}

function sign(value: string): string {
  return createHmac('sha256', getClientAuthSecret()).update(value).digest('hex');
}

function safeEq(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) return false;
  try {
    return timingSafeEqual(aBuffer, bBuffer);
  } catch {
    return false;
  }
}

function unique(values: Array<string | null | undefined>): string[] {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

function parseClientRoleHint(roleHint?: string | null): ClientRoleHintPayload | null {
  if (!roleHint || !roleHint.startsWith('client_auth:')) return null;
  try {
    const encoded = roleHint.slice('client_auth:'.length);
    const parsed = JSON.parse(fromBase64Url(encoded).toString('utf8')) as ClientRoleHintPayload;
    if (parsed?.kind !== 'client_auth') return null;
    if (!['pending', 'active', 'disabled'].includes(parsed.status)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function readClientAuthMeta(roleHint?: string | null): ClientAuthMeta {
  const parsed = parseClientRoleHint(roleHint);
  return {
    status: parsed?.status ?? 'active',
    hasPassword: Boolean(parsed?.passwordHash),
    updatedAt: parsed?.updatedAt,
  };
}

function stringifyClientRoleHint(payload: ClientRoleHintPayload): string {
  return `client_auth:${toBase64Url(JSON.stringify(payload))}`;
}

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${hash}`;
}

function verifyPassword(password: string, storedHash?: string): boolean {
  if (!storedHash) return false;
  const [algo, salt, hash] = storedHash.split('$');
  if (algo !== 'scrypt' || !salt || !hash) return false;
  const computed = scryptSync(password, salt, 64).toString('hex');
  return safeEq(computed, hash);
}

export function buildClientSessionToken(session: ClientSession): string {
  const payload = toBase64Url(JSON.stringify(session));
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function verifyClientSessionToken(token: string): ClientSession | null {
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  if (!safeEq(sign(payload), signature)) return null;
  try {
    const parsed = JSON.parse(fromBase64Url(payload).toString('utf8')) as ClientSession;
    if (!parsed?.email || !parsed?.userProfileId) return null;
    return {
      email: parsed.email.toLowerCase(),
      userProfileId: parsed.userProfileId,
      organizationIds: unique(parsed.organizationIds ?? []),
      workspaceIds: unique(parsed.workspaceIds ?? []),
    };
  } catch {
    return null;
  }
}

export async function readClientSession(): Promise<ClientSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CLIENT_COOKIE)?.value;
  if (!token) return null;
  return verifyClientSessionToken(token);
}

function findClientMemberships(profileId: string, memberships: Membership[]): Membership[] {
  return memberships.filter((item) => item.user_profile_id === profileId && item.role === 'client');
}

async function findProfileByEmail(email: string): Promise<UserProfile | null> {
  const users = await listUserProfiles();
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
}

async function resolveClientIdentity(email: string): Promise<{
  profile: UserProfile;
  memberships: Membership[];
  status: ClientStatus;
  passwordHash?: string;
} | null> {
  const profile = await findProfileByEmail(email);
  if (!profile) return null;

  const memberships = findClientMemberships(profile.id, await listMemberships());
  if (memberships.length === 0) return null;

  const parsed = parseClientRoleHint(profile.role_hint);
  return {
    profile,
    memberships,
    status: parsed?.status ?? 'active',
    passwordHash: parsed?.passwordHash,
  };
}

function getSupabasePublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function hasSupabaseAdminAuth(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function authenticateClient(
  email: string,
  password: string
): Promise<{ ok: true; session: ClientSession } | { ok: false; reason: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const identity = await resolveClientIdentity(normalizedEmail);
  if (!identity) {
    return { ok: false, reason: 'Compte client introuvable pour cet espace.' };
  }
  if (identity.status !== 'active') {
    return { ok: false, reason: 'Compte client désactivé ou en attente d activation.' };
  }

  let authenticated = false;
  const supabasePublic = getSupabasePublicClient();
  if (supabasePublic) {
    const { error } = await supabasePublic.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });
    authenticated = !error;
  }

  if (!authenticated) {
    authenticated = verifyPassword(password, identity.passwordHash);
  }

  if (!authenticated) {
    return { ok: false, reason: 'Identifiants invalides.' };
  }

  const session: ClientSession = {
    email: normalizedEmail,
    userProfileId: identity.profile.id,
    organizationIds: unique(identity.memberships.map((item) => item.organization_id)),
    workspaceIds: unique(identity.memberships.map((item) => item.workspace_id)),
  };

  return { ok: true, session };
}

export async function setClientCredentials(
  userProfileId: string,
  options: { status?: ClientStatus; plainPassword?: string }
): Promise<UserProfile | null> {
  const users = await listUserProfiles();
  const profile = users.find((item) => item.id === userProfileId);
  if (!profile) return null;

  const existing = parseClientRoleHint(profile.role_hint);
  const payload: ClientRoleHintPayload = {
    kind: 'client_auth',
    status: options.status ?? existing?.status ?? 'active',
    passwordHash: options.plainPassword
      ? hashPassword(options.plainPassword)
      : existing?.passwordHash,
    updatedAt: new Date().toISOString(),
  };

  return updateUserProfile(userProfileId, {
    roleHint: stringifyClientRoleHint(payload),
  });
}

export function createClientActionToken(email: string, purpose: ActionPurpose, ttlSeconds = 60 * 60 * 24): string {
  const payload: ActionTokenPayload = {
    email: email.trim().toLowerCase(),
    purpose,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  const encoded = toBase64Url(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

export function verifyClientActionToken(token: string, expectedPurpose: ActionPurpose): ActionTokenPayload | null {
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  if (!safeEq(sign(payload), signature)) return null;
  try {
    const parsed = JSON.parse(fromBase64Url(payload).toString('utf8')) as ActionTokenPayload;
    if (parsed.purpose !== expectedPurpose) return null;
    if (parsed.exp < Math.floor(Date.now() / 1000)) return null;
    if (!parsed.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function consumeClientPasswordToken(token: string, password: string): Promise<boolean> {
  const activation = verifyClientActionToken(token, 'activate') ?? verifyClientActionToken(token, 'reset');
  if (!activation) return false;
  const profile = await findProfileByEmail(activation.email);
  if (!profile) return false;
  const updated = await setClientCredentials(profile.id, { status: 'active', plainPassword: password });
  return Boolean(updated);
}

export async function ensureSupabaseClientUser(input: {
  email: string;
  displayName: string;
  password?: string;
}): Promise<void> {
  if (!hasSupabaseAdminAuth()) return;
  const admin = getSupabaseAdmin();
  if (!admin) return;
  const authAdmin = (admin.auth.admin as any);
  if (!authAdmin?.createUser) return;

  const result = await authAdmin.createUser({
    email: input.email.trim().toLowerCase(),
    password: input.password,
    email_confirm: true,
    user_metadata: {
      full_name: input.displayName,
    },
  });

  if (result?.error && !/already|exists|registered/i.test(String(result.error.message || ''))) {
    throw new Error(result.error.message || 'Supabase auth user creation failed');
  }
}

export async function createSupabaseRecoveryLink(input: {
  email: string;
  redirectTo: string;
  type: 'recovery' | 'invite';
}): Promise<string | null> {
  if (!hasSupabaseAdminAuth()) return null;
  const admin = getSupabaseAdmin();
  if (!admin) return null;
  const authAdmin = (admin.auth.admin as any);
  if (!authAdmin?.generateLink) return null;
  const result = await authAdmin.generateLink({
    type: input.type,
    email: input.email.trim().toLowerCase(),
    options: { redirectTo: input.redirectTo },
  });
  if (result?.error) return null;
  return (
    result?.data?.properties?.action_link ||
    result?.data?.properties?.email_otp ||
    result?.data?.action_link ||
    null
  );
}
