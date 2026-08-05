import translations from '@/lib/translations';
import DamageReportPage from '@/components/pages/DamageReportPage';
import { SITE_NAME } from '@/lib/seo';

export async function generateMetadata() {
  const d = translations.de.pages.forms.damage;
  return {
    title: `${d.title} | ${SITE_NAME}`,
    description: d.heroDesc,
    robots: { index: false, follow: true },
  };
}

export default function Page() {
  return <DamageReportPage />;
}
