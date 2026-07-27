import translations from '@/lib/translations';
import ServicesPage from '@/components/pages/ServicesPage';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const t = translations[lang] || translations.de;
  const sp = t.pages.services;
  const baseUrl = 'https://www.hausverwaltungwert.de';
  const canonical = `${baseUrl}/${lang}/services`;

  return {
    title: `${sp.title} | Hausverwaltung WERT`,
    description: sp.heroDesc,
    alternates: {
      canonical,
      languages: {
        de: `${baseUrl}/de/leistungen`,
        en: `${baseUrl}/en/services`,
        'x-default': `${baseUrl}/de/leistungen`,
      },
    },
    openGraph: {
      title: `${sp.title} | Hausverwaltung WERT`,
      description: sp.heroDesc,
      url: canonical,
      siteName: 'Hausverwaltung WERT',
      locale: lang === 'de' ? 'de_DE' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${sp.title} | Hausverwaltung WERT`,
      description: sp.heroDesc,
    },
    robots: { index: true, follow: true },
  };
}

export default function Page() {
  return <ServicesPage />;
}
