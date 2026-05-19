import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/src/lib/admin-auth';
import { deleteFaqItem, updateFaqItem } from '@/src/lib/db';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const item = await updateFaqItem(id, body);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ item });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  await deleteFaqItem(id);
  return NextResponse.json({ success: true });
}
