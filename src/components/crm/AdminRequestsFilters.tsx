'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { OPEN_REQUESTS_QUERY } from '@/src/lib/crm-labels';

export type AdminRequestsFilterValues = {
  organizationId: string;
  workspaceId: string;
  status: string;
  priority: string;
  q: string;
};

type AdminRequestsFiltersProps = {
  locale: string;
  values: AdminRequestsFilterValues;
  organizations: { id: string; name: string }[];
  workspaces: { id: string; name: string }[];
  statusOptions: { value: string; label: string }[];
  priorityOptions: { value: string; label: string }[];
  labels: {
    title: string;
    allOrganizations: string;
    allWorkspaces: string;
    allStatuses: string;
    allPriorities: string;
    openStatus: string;
    searchPlaceholder: string;
    apply: string;
    clear: string;
    quickOpen: string;
    quickAll: string;
  };
};

export default function AdminRequestsFilters({
  locale,
  values,
  organizations,
  workspaces,
  statusOptions,
  priorityOptions,
  labels,
}: AdminRequestsFiltersProps) {
  const router = useRouter();
  const basePath = `/${locale}/admin/requests`;

  function buildQuery(updates: Partial<AdminRequestsFilterValues>) {
    const next = {
      organizationId: values.organizationId,
      workspaceId: values.workspaceId,
      status: values.status,
      priority: values.priority,
      q: values.q,
      ...updates,
    };
    const params = new URLSearchParams();
    if (next.organizationId) params.set('organizationId', next.organizationId);
    if (next.workspaceId) params.set('workspaceId', next.workspaceId);
    if (next.status) params.set('status', next.status);
    if (next.priority) params.set('priority', next.priority);
    if (next.q) params.set('q', next.q);
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const organizationId = String(new FormData(form).get('organizationId') || '').trim();
    const workspaceId = String(new FormData(form).get('workspaceId') || '').trim();
    const status = String(new FormData(form).get('status') || '').trim();
    const priority = String(new FormData(form).get('priority') || '').trim();
    const q = String(new FormData(form).get('q') || '').trim();
    router.push(
      buildQuery({
        organizationId,
        workspaceId,
        status,
        priority,
        q,
      })
    );
  }

  const hasFilters =
    Boolean(values.organizationId) ||
    Boolean(values.workspaceId) ||
    Boolean(values.status) ||
    Boolean(values.priority) ||
    Boolean(values.q);

  const quickLinks = [
    { href: buildQuery({ status: OPEN_REQUESTS_QUERY }), label: labels.quickOpen, active: values.status === OPEN_REQUESTS_QUERY },
    { href: basePath, label: labels.quickAll, active: !hasFilters },
  ];

  return (
    <div className="glass-panel rounded-xl border border-brand-border/50 p-5 space-y-4">
      <h2 className="text-white font-semibold">{labels.title}</h2>

      <div className="flex flex-wrap gap-2">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              link.active
                ? 'border-brand-accent bg-brand-accent/15 text-brand-accent'
                : 'border-brand-border/60 text-brand-muted hover:text-white hover:border-brand-accent/40'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <select
            name="organizationId"
            defaultValue={values.organizationId}
            className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white min-w-0"
          >
            <option value="">{labels.allOrganizations}</option>
            {organizations.map((organization) => (
              <option key={organization.id} value={organization.id}>
                {organization.name}
              </option>
            ))}
          </select>
          <select
            name="workspaceId"
            defaultValue={values.workspaceId}
            className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white min-w-0"
          >
            <option value="">{labels.allWorkspaces}</option>
            {workspaces.map((workspace) => (
              <option key={workspace.id} value={workspace.id}>
                {workspace.name}
              </option>
            ))}
          </select>
          <select
            name="status"
            defaultValue={values.status}
            className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white min-w-0"
          >
            <option value="">{labels.allStatuses}</option>
            <option value={OPEN_REQUESTS_QUERY}>{labels.openStatus}</option>
            {statusOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <select
            name="priority"
            defaultValue={values.priority}
            className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white min-w-0"
          >
            <option value="">{labels.allPriorities}</option>
            {priorityOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <input
            name="q"
            type="search"
            defaultValue={values.q}
            placeholder={labels.searchPlaceholder}
            className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white min-w-0 xl:col-span-2"
          />
          <button
            type="submit"
            className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-brand-navy sm:col-span-2 lg:col-span-1"
          >
            {labels.apply}
          </button>
        </div>
        {hasFilters ? (
          <Link
            href={basePath}
            className="inline-block text-xs text-brand-accent hover:text-brand-accent-hover"
            onClick={(event) => {
              event.preventDefault();
              router.push(basePath);
            }}
          >
            {labels.clear}
          </Link>
        ) : null}
      </form>

    </div>
  );
}
