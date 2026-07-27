import ImpressumPage from '@/components/pages/ImpressumPage';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isGerman = lang === 'de';
  const baseUrl = 'https://www.hausverwaltungwert.de';
  const canonical = `${baseUrl}/${lang}/impressum`;

  return {
    title: isGerman ? 'Impressum | Hausverwaltung WERT' : 'Imprint | Hausverwaltung WERT',
    description: isGerman
      ? 'Impressum und rechtliche Informationen von Hausverwaltung WERT.'
      : 'Legal notice and imprint of Hausverwaltung WERT property management.',
    alternates: {
      canonical,
      languages: {
        de: `${baseUrl}/de/impressum`,
        en: `${baseUrl}/en/impressum`,
        'x-default': `${baseUrl}/de/impressum`,
      },
    },
    openGraph: {
      title: isGerman ? 'Impressum | Hausverwaltung WERT' : 'Imprint | Hausverwaltung WERT',
      description: isGerman
        ? 'Impressum und rechtliche Informationen von Hausverwaltung WERT.'
        : 'Legal notice and imprint of Hausverwaltung WERT property management.',
      url: canonical,
      siteName: 'Hausverwaltung WERT',
      locale: lang === 'de' ? 'de_DE' : 'en_US',
      type: 'website',
    },
    robots: { index: true, follow: true },
  };
}

export default function Page() {
  return <ImpressumPage />;
}
