'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import pa from '@/locales/pa.json';
import { useRouter, usePathname } from 'next/navigation';

type Locale = 'en' | 'hi' | 'pa';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const translations: Record<Locale, any> = { en, hi, pa };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedLocale = localStorage.getItem('krishi-locale') as Locale;
    if (storedLocale && ['en', 'hi', 'pa'].includes(storedLocale)) {
      setLocaleState(storedLocale);
    }
    setLoading(false);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('krishi-locale', newLocale);
  };

  const t = useCallback((key: string): string => {
    const keys = key.split('.');
    let result = translations[locale];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // Fallback to English if translation is missing
        let fallback = translations['en'];
        for (const fk of keys) {
          fallback = fallback?.[fk];
        }
        return fallback || key;
      }
    }
    return result || key;
  }, [locale]);

  const value = { locale, setLocale, t };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
