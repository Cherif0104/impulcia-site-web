import { NextResponse } from 'next/server';
import { listJobOffers } from '@/src/lib/db';

export async function GET() {
  const offers = await listJobOffers({ publishedOnly: true });
  return NextResponse.json({ offers });
}
