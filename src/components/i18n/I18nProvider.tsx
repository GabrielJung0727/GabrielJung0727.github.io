'use client';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { LOCALES, type Locale } from './locales';
import { dictionaries } from './dictionaries';

type Ctx = {
    locale: Locale;
    setLocale: (l: Locale) => void;
    t: (path: string) => string;
};

const I18nCtx = createContext<Ctx | null>(null);

function getByPath(obj: any, path: string) {
    return path.split('.').reduce((acc, k) => (acc ? acc[k] : undefined), obj);
}

export default function I18nProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocale] = useState<Locale>('en');

    useEffect(() => {
        const saved = (typeof window !== 'undefined' && localStorage.getItem('locale')) as Locale | null;
        if (saved && LOCALES.some(l => l.code === saved)) setLocale(saved);
        else {
            const nav = typeof navigator !== 'undefined' ? navigator.language : 'en';
            if (nav.startsWith('ko')) setLocale('ko');
            else if (nav.startsWith('zh')) setLocale('zh');
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') localStorage.setItem('locale', locale);
        if (typeof document !== 'undefined') document.documentElement.lang = locale;
    }, [locale]);

    const t = useMemo(() => {
        const dict = dictionaries[locale];
        return (path: string) => getByPath(dict, path) ?? path;
    }, [locale]);
    const value = useMemo<Ctx>(() => ({ locale, setLocale, t }), [locale, t]);

    return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
    const ctx = useContext(I18nCtx);
    if (!ctx) throw new Error('useI18n must be used within <I18nProvider>');
    return ctx;
}
