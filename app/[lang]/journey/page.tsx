import { Bar } from '../../Viewer';
import type { Lang } from '../../i18n';
import Journey from './Journey';

export const metadata = { title: '9Lab · Customer journey' };

export default async function Page({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  return (
    <>
      <Bar lang={lang} page="journey/" />
      <Journey lang={lang} />
    </>
  );
}
