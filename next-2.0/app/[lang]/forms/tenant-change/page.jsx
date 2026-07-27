import translations from '@/lib/translations';
import TenantChangePage from '@/components/pages/TenantChangePage';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const t = translations[lang] || translations.de;
  const tc = t.pages.forms.tenant;
  return {
    title: `${tc.title} | Hausverwaltung WERT`,
    description: tc.heroDesc,
    robots: { index: false, follow: true },
  };
}

export default function Page() {
  return <TenantChangePage />;
}
