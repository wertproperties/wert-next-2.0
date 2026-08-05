import ContactPage from '@/components/pages/ContactPage';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { BASE_URL, getPageSeo, buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const seo = await getPageSeo('contact', lang);
  const pathSlug = lang === 'de' ? 'kontakt' : 'contact';
  const canonical = seo.canonical || `${BASE_URL}/${lang}/${pathSlug}`;

  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    canonical,
    ogImage: seo.ogImage,
    noIndex: seo.noIndex,
    languages: {
      de: `${BASE_URL}/de/kontakt`,
      en: `${BASE_URL}/en/contact`,
      'x-default': `${BASE_URL}/de/kontakt`,
    },
  });
}

export default async function Page({ params }) {
  const { lang } = await params;
  const slug = lang === 'de' ? 'kontakt' : 'contact';

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: `${BASE_URL}/${lang}` },
          {
            name: lang === 'de' ? 'Kontakt' : 'Contact',
            url: `${BASE_URL}/${lang}/${slug}`,
          },
        ]}
      />
      <ContactPage />
    </>
  );
}
