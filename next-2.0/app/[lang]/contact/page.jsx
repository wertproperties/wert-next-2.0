import translations from '@/lib/translations';
import ContactPage from '@/components/pages/ContactPage';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const t = translations[lang] || translations.de;
  const cp = t.pages.contact;
  const baseUrl = 'https://www.hausverwaltungwert.de';
  const canonical = `${baseUrl}/${lang}/contact`;

  return {
    title: `${cp.title} | Hausverwaltung WERT`,
    description: cp.heroDesc,
    alternates: {
      canonical,
      languages: {
        de: `${baseUrl}/de/kontakt`,
        en: `${baseUrl}/en/contact`,
        'x-default': `${baseUrl}/de/kontakt`,
      },
    },
    openGraph: {
      title: `${cp.title} | Hausverwaltung WERT`,
      description: cp.heroDesc,
      url: canonical,
      siteName: 'Hausverwaltung WERT',
      locale: lang === 'de' ? 'de_DE' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${cp.title} | Hausverwaltung WERT`,
      description: cp.heroDesc,
    },
    robots: { index: true, follow: true },
  };
}

export default function Page() {
  return <ContactPage />;
}
