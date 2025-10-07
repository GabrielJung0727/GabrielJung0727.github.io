'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useI18n } from '@/components/i18n/I18nProvider';

/* ── Small UI helpers ── */
function TechPill({ label }: { label: string }) {
  return (
    <span className="px-3 py-1 rounded-full text-xs border border-slate-700/70 bg-slate-900/60 text-slate-300">
      {label}
    </span>
  );
}

function NeonButton({
  href,
  children,
  variant = 'primary',
}: {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'ghost';
}) {
  const base =
    'relative inline-flex items-center justify-center px-5 py-3 rounded-xl font-medium transition';
  return variant === 'ghost' ? (
    <Link
      href={href}
      className={`${base} text-slate-100 bg-slate-900/60 border border-slate-700 hover:bg-slate-800`}
    >
      {children}
    </Link>
  ) : (
    <Link
      href={href}
      className={`${base} text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-[0_10px_30px_-12px_rgba(34,211,238,.45)]`}
    >
      {children}
    </Link>
  );
}

/* ── Glass Cube v2 (CSS는 globals.css에 정의) ── */
function GlassCube({ faces }: { faces: string[] }) {
  return (
    <div className="relative mx-auto grid place-items-center">
      {/* ambient glow + floor shadow */}
      <div className="pointer-events-none absolute -inset-6 rounded-[2rem] blur-3xl
        bg-[radial-gradient(60%_60%_at_30%_0%,rgba(59,130,246,.20),transparent_60%),
            radial-gradient(50%_50%_at_90%_20%,rgba(34,211,238,.18),transparent_60%)]" />
      <div className="absolute bottom-[-28px] h-10 w-48 rounded-full bg-black/40 blur-xl opacity-50" />

      <div className="glass-cube">
        <div className="cube">
          <div className="face face--front"><span>{faces[0]}</span></div>
          <div className="face face--back"><span>{faces[1]}</span></div>
          <div className="face face--right"><span>{faces[2]}</span></div>
          <div className="face face--left"><span>{faces[3]}</span></div>
          <div className="face face--top"><span>{faces[4]}</span></div>
          <div className="face face--bottom"><span>{faces[5]}</span></div>
        </div>
      </div>
    </div>
  );
}

/* ── Page ── */
export default function HomePage() {
  const { t } = useI18n();
  const faces = [
    t('cube.face1'), // Builder
    t('cube.face2'), // AI Engineer
    t('cube.face3'), // Daily Log
    t('cube.face4'), // Open Source
    t('cube.face5'), // Write & Teach
    t('cube.face6'), // Ship Fast
  ];

  return (
    <div
      className="relative"
      onMouseMove={(e) => {
        // glare position (client-only)
        const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        (e.currentTarget as HTMLDivElement).style.setProperty('--mx', `${e.clientX - r.left}px`);
        (e.currentTarget as HTMLDivElement).style.setProperty('--my', `${e.clientY - r.top}px`);
      }}
    >
      {/* backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_400px_at_20%_-10%,rgba(59,130,246,.18),transparent),radial-gradient(800px_400px_at_90%_10%,rgba(34,211,238,.15),transparent)]" />

      <div className="max-w-6xl mx-auto px-4 pt-16">
        {/* HERO */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-balance text-5xl md:text-6xl font-extrabold tracking-tight">
              <span className="relative inline-block">
                <span className="shimmer bg-gradient-to-r from-sky-300 via-cyan-200 to-blue-400 bg-clip-text text-transparent">
                  {t('hero.title')}
                </span>
                <span className="pointer-events-none absolute -inset-x-6 -inset-y-3 rounded-3xl blur-3xl bg-[conic-gradient(from_180deg_at_50%_50%,rgba(59,130,246,.15),rgba(34,211,238,.15),transparent_60%)]" />
              </span>
            </h1>
            <p className="mt-4 text-slate-300 text-lg">{t('hero.subtitle')}</p>
            <p className="mt-3 text-slate-400">{t('hero.tagline')}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <NeonButton href="/tracker">{t('links.daily')}</NeonButton>
              <NeonButton href="/reports" variant="ghost">
                {t('links.builds')}
              </NeonButton>
              <NeonButton href="mailto:hello@gabrieljung.dev" variant="ghost">
                {t('links.contact')}
              </NeonButton>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <TechPill label="Full-Stack" />
              <TechPill label="AI Systems" />
              <TechPill label="Clean UX" />
              <TechPill label="Open Source" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-6 backdrop-blur">
            <div className="text-xs text-slate-400 mb-2">{t('cube.caption')}</div>
            <GlassCube faces={faces} />
            <p className="mt-4 text-center text-xs text-slate-500">{t('cube.helper')}</p>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 mb-20 text-center">
          <h3 className="text-2xl font-semibold">
            {t('cta.title')}{' '}
            <span className="text-slate-400">{t('cta.subtitle')}</span>
          </h3>
          <p className="mt-2 text-slate-400">{t('cta.body')}</p>
          <div className="mt-6 flex justify-center gap-3">
            <NeonButton href="/tracker">{t('links.daily')}</NeonButton>
            <NeonButton href="/reports" variant="ghost">
              {t('links.builds')}
            </NeonButton>
          </div>
        </section>
      </div>
    </div>
  );
}
