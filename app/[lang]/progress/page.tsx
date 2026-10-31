import { Bar } from '../../Viewer';
import type { Lang } from '../../i18n';
import Progress from './Progress';

export const metadata = { title: '9Lab · Progress' };

export default async function Page({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  return (
    <>
      <Bar lang={lang} page="progress/" />
      <Progress lang={lang} />
    </>
  );
}
