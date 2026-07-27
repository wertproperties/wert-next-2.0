import translations from '@/lib/translations';
import KeyOrderPage from '@/components/pages/KeyOrderPage';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const t = translations[lang] || translations.de;
  const k = t.pages.forms.key;
  return {
    title: `${k.title} | Hausverwaltung WERT`,
    description: k.heroDesc,
    robots: { index: false, follow: true },
  };
}

export default function Page() {
  return <KeyOrderPage />;
}
