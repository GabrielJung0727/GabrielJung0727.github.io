'use client';
import { LOCALES } from '@/components/i18n/locales';
import { useI18n } from '@/components/i18n/I18nProvider';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as any)}
      className="bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-3 py-2"
      aria-label="Language"
    >
      {LOCALES.map(l => (
        <option key={l.code} value={l.code}>{l.label}</option>
      ))}
    </select>
  );
}
