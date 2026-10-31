import { Bar } from '../../Viewer';
import type { Lang } from '../../i18n';
import MoneyFlow from './MoneyFlow';

export const metadata = { title: '9Lab · Money flow' };

export default async function Page({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  return (
    <>
      <Bar lang={lang} page="money/" />
      <MoneyFlow lang={lang} />
    </>
  );
}
