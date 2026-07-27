import DatenschutzPage from '@/components/pages/DatenschutzPage';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isGerman = lang === 'de';
  const baseUrl = 'https://www.hausverwaltungwert.de';
  const canonical = `${baseUrl}/${lang}/datenschutz`;

  return {
    title: isGerman ? 'Datenschutzerklärung | Hausverwaltung WERT' : 'Privacy Policy | Hausverwaltung WERT',
    description: isGerman
      ? 'Datenschutzerklärung von Hausverwaltung WERT – Informationen zum Schutz Ihrer Daten.'
      : 'Privacy policy of Hausverwaltung WERT – information about data protection.',
    alternates: {
      canonical,
      languages: {
        de: `${baseUrl}/de/datenschutz`,
        en: `${baseUrl}/en/datenschutz`,
        'x-default': `${baseUrl}/de/datenschutz`,
      },
    },
    openGraph: {
      title: isGerman ? 'Datenschutzerklärung | Hausverwaltung WERT' : 'Privacy Policy | Hausverwaltung WERT',
      description: isGerman
        ? 'Datenschutzerklärung von Hausverwaltung WERT.'
        : 'Privacy policy of Hausverwaltung WERT.',
      url: canonical,
      siteName: 'Hausverwaltung WERT',
      locale: lang === 'de' ? 'de_DE' : 'en_US',
      type: 'website',
    },
    robots: { index: true, follow: true },
  };
}

export default function Page() {
  return <DatenschutzPage />;
}
