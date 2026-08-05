import HomePage from '@/components/pages/HomePage';
import { LocalBusinessJsonLd, WebSiteJsonLd, ServicesJsonLd } from '@/components/JsonLd';
import { BASE_URL, SITE_NAME, getPageSeo, buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const seo = await getPageSeo('home', lang);
  const canonical = seo.canonical || `${BASE_URL}/${lang}`;

  return {
    ...buildPageMetadata({
      title: seo.title,
      description: seo.description,
      canonical,
      ogImage: seo.ogImage,
      noIndex: seo.noIndex,
      languages: {
        de: `${BASE_URL}/de`,
        en: `${BASE_URL}/en`,
        'x-default': `${BASE_URL}/de`,
      },
    }),
    other: {
      'og:site_name': SITE_NAME,
    },
  };
}

export default function Page() {
  return (
    <>
      <LocalBusinessJsonLd />
      <WebSiteJsonLd />
      <ServicesJsonLd />
      {/* Preload LCP hero background for Core Web Vitals */}
      <link
        rel="preload"
        as="image"
        href="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80"
        fetchPriority="high"
      />
      <HomePage />
    </>
  );
}
