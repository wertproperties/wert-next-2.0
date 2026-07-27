import translations from '@/lib/translations';
import DamageReportPage from '@/components/pages/DamageReportPage';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const t = translations[lang] || translations.de;
  const d = t.pages.forms.damage;
  return {
    title: `${d.title} | Hausverwaltung WERT`,
    description: d.heroDesc,
    robots: { index: false, follow: true },
  };
}

export default function Page() {
  return <DamageReportPage />;
}
