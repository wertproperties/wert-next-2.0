import translations from '@/lib/translations';
import HomePage from '@/components/pages/HomePage';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const t = translations[lang] || translations.de;
  const baseUrl = 'https://www.hausverwaltungwert.de';
  const canonical = `${baseUrl}/${lang}`;

  return {
    title: `${t.hero.title} | ${t.hero.subtitle}`,
    description: t.hero.bullets[0],
    alternates: {
      canonical,
      languages: {
        de: `${baseUrl}/de`,
        en: `${baseUrl}/en`,
        'x-default': `${baseUrl}/de`,
      },
    },
    openGraph: {
      title: `${t.hero.title} | ${t.hero.subtitle}`,
      description: t.hero.bullets[0],
      url: canonical,
      siteName: 'Hausverwaltung WERT',
      locale: lang === 'de' ? 'de_DE' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t.hero.title} | ${t.hero.subtitle}`,
      description: t.hero.bullets[0],
    },
    robots: { index: true, follow: true },
  };
}

export default function Page() {
  return <HomePage />;
}
