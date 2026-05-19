import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/src/lib/admin-auth';
import { createFaqItem, listFaq } from '@/src/lib/db';

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const locale = request.nextUrl.searchParams.get('locale') ?? undefined;
  const items = await listFaq(locale);
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  if (!body.question || !body.answer) {
    return NextResponse.json({ error: 'question and answer required' }, { status: 400 });
  }
  const item = await createFaqItem({
    locale: body.locale || 'fr',
    question: String(body.question),
    answer: String(body.answer),
    order: Number(body.order ?? 0),
    published: body.published !== false,
  });
  return NextResponse.json({ item }, { status: 201 });
}
