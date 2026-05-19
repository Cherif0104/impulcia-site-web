import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/src/lib/admin-auth';
import { listMessages } from '@/src/lib/db';

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const leadId = request.nextUrl.searchParams.get('leadId') ?? undefined;
  const messages = await listMessages(leadId);
  return NextResponse.json({ messages });
}
