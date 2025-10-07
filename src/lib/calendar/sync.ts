import ical, { VEvent } from 'node-ical';
import { supabaseAdmin } from '@/lib/supabase/admin';

type Source = { id: string; ics_url: string; name: string };

function normalizeIcsUrl(url: string) {
  // webcal:// -> https:// 로 변환하여 fetch
  return url.replace(/^webcal:/i, 'https:');
}

// 전개 기간(오늘-30일 ~ +90일)만 저장
function windowRange() {
  const now = new Date();
  const start = new Date(now); start.setDate(start.getDate() - 30);
  const end = new Date(now);   end.setDate(end.getDate() + 90);
  return { start, end };
}

export async function syncAllSources() {
  const { data: sources } = await supabaseAdmin
    .from('calendar_sources')
    .select('id, ics_url, name')
    .eq('active', true);

  if (!sources?.length) return { synced: 0 };

  let count = 0;
  for (const s of sources as Source[]) {
    count += await syncOneSource(s);
  }
  return { synced: count };
}

export async function syncOneSource(source: Source) {
  const feedUrl = normalizeIcsUrl(source.ics_url);
  const { start, end } = windowRange();

  const data = await ical.async.fromURL(feedUrl, { headers: { 'user-agent': 'gabrieljung.dev sync' } });
  // data: { [key: string]: CalendarComponent }
  let upserts = 0;

  for (const k of Object.keys(data)) {
    const comp = data[k];
    if (comp.type !== 'VEVENT') continue;

    const ev = comp as VEvent;
    const title = ev.summary || '(no title)';
    const location = ev.location || null;
    const uid = ev.uid as string;

    // allDay & dates
    const isAllDay = !!(ev.datetype === 'date' || (ev.start && ev.start.isDate));
    // recurrence 처리
    if (ev.rrule) {
      // 반복 이벤트는 window 범위로 전개
      const between = ev.rrule.between(start, end, true);
      // EXDATE 고려
      const exdates = new Set(Object.values(ev.exdate || {}).map((d: any) => +new Date(d as Date)));
      for (const dt of between) {
        const dtStart = new Date(dt);
        if (exdates.has(+dtStart)) continue;

        // DTSTART와 같은 길이로 종료 계산
        const duration = ev.end && ev.start ? (+ev.end - +ev.start) : 0;
        const dtEnd = new Date(+dtStart + duration);

        const recurrenceId = dtStart.toISOString();
        await upsertEvent({
          sourceId: source.id, uid, recurrenceId, title, location,
          start: dtStart, end: dtEnd, allDay: isAllDay
        });
        upserts++;
      }
    } else {
      // 단일 이벤트
      const s = new Date(ev.start as Date);
      const e = new Date(ev.end as Date);
      if (e < start || s > end) continue;

      await upsertEvent({
        sourceId: source.id, uid, recurrenceId: null, title, location,
        start: s, end: e, allDay: isAllDay
      });
      upserts++;
    }
  }
  return upserts;
}

async function upsertEvent(p: {
  sourceId: string;
  uid: string;
  recurrenceId: string | null;
  title: string;
  location: string | null;
  start: Date;
  end: Date;
  allDay: boolean;
}) {
  await supabaseAdmin.from('events').upsert({
    source_id: p.sourceId,
    ics_uid: p.uid,
    recurrence_id: p.recurrenceId,
    title: p.title,
    location: p.location,
    start: p.start.toISOString(),
    end: p.end.toISOString(),
    all_day: p.allDay,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'source_id,ics_uid,recurrence_id' });
}
