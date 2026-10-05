'use client';
import { useEffect } from 'react';

// keeps <html lang> right when switching language without a full reload
export default function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  return null;
}
