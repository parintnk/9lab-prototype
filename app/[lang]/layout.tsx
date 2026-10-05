import { LANGS, info, type Lang } from '../i18n';
import HtmlLang from './HtmlLang';

export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.map((l) => ({ lang: l.code }));
}

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  // root <html> is shared, so set its lang here (screen readers, fonts, line breaking)
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang=${JSON.stringify(info(lang as Lang).html)}` }} />
      <HtmlLang lang={info(lang as Lang).html} />
      {children}
    </>
  );
}
