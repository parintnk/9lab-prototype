import { Bar } from '../../Viewer';
import type { Lang } from '../../i18n';
import Checklist from './Checklist';

export const metadata = { title: '9Lab · Brief checklist' };

export default async function Page({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  return (
    <>
      <Bar lang={lang} page="checklist/" />
      <Checklist lang={lang} />
    </>
  );
}
