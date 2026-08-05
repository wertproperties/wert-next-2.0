import translations from '@/lib/translations';
import KeyOrderPage from '@/components/pages/KeyOrderPage';
import { SITE_NAME } from '@/lib/seo';

export async function generateMetadata() {
  const k = translations.de.pages.forms.key;
  return {
    title: `${k.title} | ${SITE_NAME}`,
    description: k.heroDesc,
    robots: { index: false, follow: true },
  };
}

export default function Page() {
  return <KeyOrderPage />;
}
