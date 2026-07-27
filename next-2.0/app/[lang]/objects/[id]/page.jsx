import ObjectDetailPage from '@/components/pages/ObjectDetailPage';

export async function generateMetadata({ params }) {
  const { lang, id } = await params;
  const isGerman = lang === 'de';
  const baseUrl = 'https://www.hausverwaltungwert.de';
  const slug = isGerman ? 'objekte' : 'objects';
  const canonical = `${baseUrl}/${lang}/${slug}/${id}`;

  return {
    title: isGerman ? 'Objektdetails | Hausverwaltung WERT' : 'Property Details | Hausverwaltung WERT',
    description: isGerman
      ? 'Details zum verwalteten Objekt von Hausverwaltung WERT.'
      : 'Details about the managed property from Hausverwaltung WERT.',
    alternates: {
      canonical,
      languages: {
        de: `${baseUrl}/de/objekte/${id}`,
        en: `${baseUrl}/en/objects/${id}`,
        'x-default': `${baseUrl}/de/objekte/${id}`,
      },
    },
    openGraph: {
      title: isGerman ? 'Objektdetails | Hausverwaltung WERT' : 'Property Details | Hausverwaltung WERT',
      url: canonical,
      siteName: 'Hausverwaltung WERT',
      locale: lang === 'de' ? 'de_DE' : 'en_US',
      type: 'website',
    },
    robots: { index: true, follow: true },
  };
}

export default function Page() {
  return <ObjectDetailPage />;
}
