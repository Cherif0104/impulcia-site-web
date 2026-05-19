export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'won' | 'lost';

export interface Lead {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  activity?: string | null;
  domain?: string | null;
  message?: string | null;
  source?: string | null;
  status: LeadStatus;
  whatsapp_clicked: boolean;
  locale?: string | null;
  score?: number | null;
  priority?: 'low' | 'medium' | 'high' | 'critical' | null;
  potential?: 'low' | 'medium' | 'high' | null;
  urgency?: 'low' | 'medium' | 'high' | null;
  scoring_details?: string | null;
}

export interface Message {
  id: string;
  lead_id?: string | null;
  channel: 'web' | 'email' | 'whatsapp' | 'phone' | 'internal';
  body: string;
  direction: 'inbound' | 'outbound';
  created_at: string;
}

export interface FaqItem {
  id: string;
  locale: string;
  question: string;
  answer: string;
  order: number;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

export interface VisitorSession {
  id: string;
  session_id: string;
  first_seen: string;
  last_seen: string;
  pages: { path: string; at: string }[];
  consent_analytics: boolean;
}

export interface PageViewPayload {
  page: string;
  locale?: string;
  referrer?: string;
  sessionId: string;
}

export interface LeadInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  activity?: string;
  domain?: string;
  message?: string;
  source?: string;
  locale?: string;
  scoring?: {
    budget?: string;
    timeline?: string;
    maturity?: string;
    source?: string;
    requestType?: string;
    partnerModel?: string[];
    activity?: string;
  };
}

export type OrganizationType = 'parent' | 'client';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  type: OrganizationType;
  parent_org_id?: string | null;
  active: boolean;
  created_at: string;
}

export interface Workspace {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  status: 'active' | 'paused' | 'archived';
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  role_hint?: string | null;
  created_at: string;
}

export type MembershipRole =
  | 'owner'
  | 'org_admin'
  | 'workspace_manager'
  | 'project_manager'
  | 'engineer_fe'
  | 'engineer_be'
  | 'engineer_fullstack'
  | 'support'
  | 'viewer'
  | 'client';

export interface Membership {
  id: string;
  user_profile_id: string;
  organization_id?: string | null;
  workspace_id?: string | null;
  role: MembershipRole;
  created_at: string;
  user_profile?: UserProfile | null;
  organization?: Organization | null;
  workspace?: Workspace | null;
}

export type RequestStatus = 'new' | 'triaged' | 'in_progress' | 'blocked' | 'done';
export type RequestPriority = 'low' | 'medium' | 'high' | 'critical';

export interface ServiceRequest {
  id: string;
  workspace_id: string;
  organization_id: string;
  title: string;
  description?: string | null;
  status: RequestStatus;
  priority: RequestPriority;
  created_by_email?: string | null;
  assigned_membership_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface RequestInteraction {
  id: string;
  request_id: string;
  author_type: 'client' | 'staff' | 'system';
  body: string;
  created_at: string;
}

export interface JobOffer {
  id: string;
  title: string;
  slug: string;
  location?: string | null;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'internship';
  team?: string | null;
  description: string;
  published: boolean;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}
