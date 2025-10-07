import type { Metadata } from 'next';
import './globals.css';
import I18nProvider from '@/components/i18n/I18nProvider';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Gabriel Jung',
  description: 'Full-Stack & AI Engineer · CEO, DoubleJ',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[linear-gradient(180deg,#0A0F1A,#0E1726)] text-slate-100">
        <I18nProvider>
          <header className="border-b border-slate-800/60 sticky top-0 backdrop-blur bg-slate-950/40">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
              <Link href="/" className="font-semibold tracking-tight">GJ</Link>
              <nav className="flex items-center gap-4 text-sm">
                <Link href="/tracker" className="text-slate-300 hover:text-white">Tracker</Link>
                <Link href="/reports" className="text-slate-300 hover:text-white">Reports</Link>
                <Link href="/settings" className="text-slate-300 hover:text-white">Settings</Link>
                <LanguageSwitcher />
              </nav>
            </div>
          </header>
          <main>{children}</main>
          <footer className="mt-16 py-8 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Gabriel Jung
          </footer>
        </I18nProvider>
      </body>
    </html>
  );
}
