import translations from '@/lib/translations';
import ObjectsPage from '@/components/pages/ObjectsPage';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const t = translations[lang] || translations.de;
  const op = t.pages.objects;
  const baseUrl = 'https://www.hausverwaltungwert.de';
  const canonical = `${baseUrl}/${lang}/objects`;

  return {
    title: `${op.title} | Hausverwaltung WERT`,
    description: op.heroDesc,
    alternates: {
      canonical,
      languages: {
        de: `${baseUrl}/de/objekte`,
        en: `${baseUrl}/en/objects`,
        'x-default': `${baseUrl}/de/objekte`,
      },
    },
    openGraph: {
      title: `${op.title} | Hausverwaltung WERT`,
      description: op.heroDesc,
      url: canonical,
      siteName: 'Hausverwaltung WERT',
      locale: lang === 'de' ? 'de_DE' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${op.title} | Hausverwaltung WERT`,
      description: op.heroDesc,
    },
    robots: { index: true, follow: true },
  };
}

export default function Page() {
  return <ObjectsPage />;
}
