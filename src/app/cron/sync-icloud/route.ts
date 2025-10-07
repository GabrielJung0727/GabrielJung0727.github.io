import { NextResponse } from 'next/server';
import { syncAllSources } from '@/lib/calendar/sync';

export const dynamic = 'force-dynamic'; // cron 호출용

export async function GET() {
  const res = await syncAllSources();
  return NextResponse.json(res);
}
