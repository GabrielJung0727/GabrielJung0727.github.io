'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { DAILY_TEMPLATE } from '@/lib/checklistTemplate';
import {
  fetchDay,
  fetchMonthSnapshot,
  saveNotes,
  toggleCheck,
  fetchEventsByDate,
} from './actions';

type DayMap = Record<
  string,
  { date: string; checks: Record<string, boolean>; notes: string | null }
>;

function dateKey(d: Date) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
  }).format(d);
}
function monthTitle(y: number, m0: number) {
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(Date.UTC(y, m0, 1)));
}
function daysInMonth(y: number, m0: number) {
  return new Date(Date.UTC(y, m0 + 1, 0)).getUTCDate();
}

export default function DailyTrackerClient(props: {
  year: number;
  monthIndex0: number; // 0~11
  initialMonthMap: DayMap;
}) {
  const [year, setYear] = useState(props.year);
  const [m0, setM0] = useState(props.monthIndex0);
  const [monthMap, setMonthMap] = useState<DayMap>(props.initialMonthMap);
  const [selected, setSelected] = useState<string>(() => {
    const today = new Date();
    return dateKey(today);
  });
  const [notes, setNotes] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const [events, setEvents] = useState<any[]>([]);

  const grid = useMemo(() => {
    const total = daysInMonth(year, m0);
    const firstDow = new Date(Date.UTC(year, m0, 1)).getUTCDay(); // 0 = Sun
    const cells: (string | null)[] = Array(firstDow)
      .fill(null)
      .concat(
        Array.from({ length: total }, (_, i) =>
          dateKey(new Date(Date.UTC(year, m0, i + 1)))
        )
      );
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [year, m0]);

  // load selected day + events
  useEffect(() => {
    startTransition(async () => {
      const d = await fetchDay(selected);
      setNotes(d?.notes ?? '');
      const ev = await fetchEventsByDate(selected);
      setEvents(ev);
    });
  }, [selected]);

  // month nav
  async function changeMonth(delta: number) {
    startTransition(async () => {
      const nextM = m0 + delta;
      const dt = new Date(Date.UTC(year, nextM, 1));
      const ym = await fetchMonthSnapshot(
        dt.getUTCFullYear(),
        dt.getUTCMonth()
      );
      setYear(dt.getUTCFullYear());
      setM0(dt.getUTCMonth());
      setMonthMap(ym);
    });
  }

  const selectedDay =
    monthMap[selected] ?? { date: selected, checks: {}, notes: null };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Daily</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeMonth(-1)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700"
          >
            ◀
          </button>
          <div className="min-w-[12rem] text-center text-slate-300">
            {monthTitle(year, m0)}
          </div>
          <button
            onClick={() => changeMonth(1)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700"
          >
            ▶
          </button>
        </div>
      </div>

      {/* calendar */}
      <div className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-4 mb-6">
        <div className="grid grid-cols-7 text-center text-xs text-slate-400 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {grid.map((dk, idx) =>
            dk ? (
              <button
                key={dk}
                onClick={() => setSelected(dk)}
                className={[
                  'aspect-square rounded-xl border text-sm transition',
                  selected === dk
                    ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-200'
                    : 'border-slate-800 bg-slate-900/50 text-slate-200 hover:bg-slate-900',
                ].join(' ')}
              >
                <div className="mt-1">{new Date(dk).getUTCDate()}</div>
                {/* dot if record exists */}
                {monthMap[dk] && (
                  <div className="mt-1 mx-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
                )}
              </button>
            ) : (
              <div key={`e-${idx}`} />
            )
          )}
        </div>
      </div>

      {/* checklist + notes + agenda */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* checklist */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800/60 bg-slate-950/40 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Checklist — {selected}</h3>
            {isPending && <span className="text-xs text-slate-500">Saving…</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DAILY_TEMPLATE.map((sec) => (
              <div
                key={sec.title}
                className="rounded-xl border border-slate-800 bg-slate-900/50 p-3"
              >
                <div className="text-slate-300 text-sm mb-2">{sec.title}</div>
                <ul className="space-y-2">
                  {sec.items.map((it) => {
                    const checked = !!selectedDay.checks[it.id];
                    return (
                      <li key={it.id} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const v = e.currentTarget.checked;
                            // optimistic update
                            setMonthMap((prev) => ({
                              ...prev,
                              [selected]: {
                                ...selectedDay,
                                checks: { ...selectedDay.checks, [it.id]: v },
                              },
                            }));
                            startTransition(async () => {
                              await toggleCheck(selected, it.id, v);
                            });
                          }}
                          className="h-5 w-5 rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-0"
                        />
                        <span
                          className={
                            checked
                              ? 'line-through text-slate-500'
                              : 'text-slate-200'
                          }
                        >
                          {it.text}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* notes */}
        <div className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Notes</h3>
            <button
              onClick={() =>
                startTransition(async () => {
                  await saveNotes(selected, notes);
                })
              }
              className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm"
            >
              Save
            </button>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.currentTarget.value)}
            placeholder="What did I learn today? What will I do better tomorrow?"
            className="w-full h-48 bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500"
          />
        </div>

        {/* agenda */}
        <div className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Agenda</h3>
            <span className="text-xs text-slate-500">{selected}</span>
          </div>
          {events.length === 0 ? (
            <div className="text-slate-500 text-sm">No events</div>
          ) : (
            <ul className="space-y-2">
              {events.map((e, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-slate-800 bg-slate-900/60 p-3"
                >
                  <div className="text-slate-200 text-sm font-medium">
                    {e.title}
                  </div>
                  <div className="text-slate-400 text-xs mt-1">
                    {new Date(e.start).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {' – '}
                    {new Date(e.end).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {e.all_day ? ' (All day)' : ''}
                    {e.location ? ` · ${e.location}` : ''}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
