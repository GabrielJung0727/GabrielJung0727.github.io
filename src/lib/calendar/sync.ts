import ical, { VEvent } from 'node-ical';
import 'dotenv/config';
import axios from 'axios';
import { supabaseAdmin } from '@/lib/supabase/admin';

type Source = { id: string; ics_url: string; name: string };

// ✅ webcal → https 변환
function normalizeIcsUrl(url: string) {
  return url.replace(/^webcal:/i, 'https:');
}

// ✅ 동기화 범위: 지난 30일 ~ 앞으로 90일
function windowRange() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 30);
  const end = new Date(now);
  end.setDate(end.getDate() + 90);
  return { start, end };
}

// ✅ KST(+9h) 보정 함수
function toSeoulTime(date: Date | string | number | undefined): Date {
  if (!date) return new Date();
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return new Date(d.getTime() + 9 * 60 * 60 * 1000);
}

// =========================
// 메인 동기화 로직
// =========================
export async function syncAllSources() {
  const { data: sources, error } = await supabaseAdmin
    .from('calendar_sources')
    .select('id, ics_url, name')
    .eq('active', true);

  if (error) {
    console.error('❌ Supabase error:', error.message);
    return { synced: 0 };
  }

  if (!sources?.length) {
    console.log('⚠️ No active sources found.');
    return { synced: 0 };
  }

  console.log(`🌤️ Found ${sources.length} active iCloud sources`);

  let total = 0;
  for (const src of sources as Source[]) {
    try {
      const count = await syncOneSource(src);
      console.log(`✅ ${src.name}: synced ${count} events`);
      total += count;
    } catch (err) {
      console.error(`⚠️ ${src.name} failed:`, err);
    }
  }

  return { synced: total };
}

export async function syncOneSource(source: Source) {
  const feedUrl = normalizeIcsUrl(source.ics_url);
  const { start, end } = windowRange();

  try {
    const res = await axios.get(feedUrl, {
      responseType: 'text',
      headers: {
        'User-Agent': 'GabrielJung-SyncAgent',
        Accept: 'text/calendar, text/plain, */*',
      },
      maxRedirects: 5,
      timeout: 15000,
    });

    const data = ical.parseICS(res.data);
    let upserts = 0;

    for (const key of Object.keys(data)) {
      const comp = data[key];
      if (!comp || comp.type !== 'VEVENT') continue;

      const ev = comp as VEvent;
      const title = ev.summary || '(no title)';
      const location = ev.location || null;
      const uid = ev.uid as string;
      const isAllDay =
        (ev as any).datetype === 'date' ||
        (ev.start && (ev.start as any).isDate) ||
        false;

      // ✅ 반복 이벤트 (rrule)
      if (ev.rrule) {
        const between = ev.rrule.between(start, end, true);
        const exdates = new Set(
          Object.values(ev.exdate || {}).map((d: any) => +new Date(d as Date))
        );

        for (const dt of between) {
          const dtStart = toSeoulTime(dt);
          if (exdates.has(+dtStart)) continue;

          const duration = ev.end && ev.start ? +ev.end - +ev.start : 0;
          const dtEnd = toSeoulTime(dtStart.getTime() + duration);

          await upsertEvent({
            sourceId: source.id,
            uid,
            recurrenceId: dtStart.toISOString(),
            title,
            location,
            start: dtStart,
            end: dtEnd,
            allDay: isAllDay,
          });

          upserts++;
        }
      } else {
        // ✅ 단일 이벤트
        const s = toSeoulTime(ev.start as Date);
        const e = toSeoulTime(ev.end as Date);
        if (e < start || s > end) continue;

        await upsertEvent({
          sourceId: source.id,
          uid,
          recurrenceId: null,
          title,
          location,
          start: s,
          end: e,
          allDay: isAllDay,
        });
        upserts++;
      }
    }

    return upserts;
  } catch (err) {
    console.error(`❌ Sync error for ${source.name}:`, err);
    return 0;
  }
}

// ✅ Supabase Upsert
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
  const { error } = await supabaseAdmin.from('events').upsert(
    {
      source_id: p.sourceId,
      ics_uid: p.uid,
      recurrence_id: p.recurrenceId,
      title: p.title,
      location: p.location,
      start: p.start.toISOString(),
      end: p.end.toISOString(),
      all_day: p.allDay,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'source_id,ics_uid,recurrence_id' }
  );

  if (error) console.error('❌ upsertEvent error:', error.message);
}

// =========================
// CLI 실행 시 직접 동작
// =========================
(async () => {
  console.log('🔄 Starting calendar sync...');

  try {
    const { synced } = await syncAllSources();
    console.log(`✅ Sync complete. Total events updated: ${synced}`);
  } catch (err) {
    console.error('❌ Sync failed:', err);
  }

  console.log('🌙 Done.');
})();
