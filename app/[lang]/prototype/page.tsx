import Viewer from '../../Viewer';
import type { Lang } from '../../i18n';

export const metadata = { title: '9Lab · Prototype' };

export default async function Page({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  return <Viewer lang={lang} page="prototype/" file="prototype" title="9Lab Prototype" />;
}
