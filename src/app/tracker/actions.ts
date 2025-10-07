'use server';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { ALL_ITEM_IDS } from '@/lib/checklistTemplate';

type Checks = Record<string, boolean>;
export type DayRow = { date: string; checks: Checks; notes: string | null };
export type CalSource = { id: string; name: string; color: string | null; slug: string | null; active: boolean };


function isoToDateStr(d: Date) {
  // YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(d);
}

export async function fetchMonthSnapshot(year: number, monthIndex0: number) {
  // monthIndex0: 0~11
  const first = new Date(Date.UTC(year, monthIndex0, 1));
  const last  = new Date(Date.UTC(year, monthIndex0 + 1, 0));
  const { data, error } = await supabaseAdmin
    .from('days')
    .select('date, checks, notes')
    .gte('date', isoToDateStr(first))
    .lte('date', isoToDateStr(last))
    .order('date', { ascending: true });

  if (error) throw error;
  const map: Record<string, DayRow> = {};
  (data ?? []).forEach((r) => map[r.date] = r as DayRow);
  return map;
}

export async function fetchDay(dateStr: string): Promise<DayRow | null> {
  const { data, error } = await supabaseAdmin
    .from('days')
    .select('date, checks, notes')
    .eq('date', dateStr)
    .maybeSingle();
  if (error && error.code !== 'PGRST116') throw error;
  return (data as DayRow) ?? null;
}

export async function toggleCheck(dateStr: string, key: string, value: boolean) {
  if (!ALL_ITEM_IDS.includes(key)) throw new Error('Unknown checklist key');
  const existing = await fetchDay(dateStr);
  const nextChecks: Checks = { ...(existing?.checks ?? {}), [key]: value };

  const { error } = await supabaseAdmin
    .from('days')
    .upsert({ date: dateStr, checks: nextChecks }, { onConflict: 'date' });
  if (error) throw error;
  return nextChecks;
}

export async function saveNotes(dateStr: string, notes: string) {
  const { error } = await supabaseAdmin
    .from('days')
    .upsert({ date: dateStr, notes }, { onConflict: 'date' });
  if (error) throw error;
  return true;
}

export async function fetchEventsByDate(dateStr: string) {
  // dateStr: YYYY-MM-DD (Asia/Seoul 기준)
  const start = new Date(`${dateStr}T00:00:00+09:00`);
  const end   = new Date(`${dateStr}T23:59:59+09:00`);

  const { data, error } = await supabaseAdmin
    .from('events')
    .select('title, start, end, location, all_day')
    .gte('start', start.toISOString())
    .lte('end', end.toISOString())
    .order('start', { ascending: true });

  if (error) throw error;
  return data ?? [];
}