import ContactPage from '@/components/pages/ContactPage';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { BASE_URL, PAGE_SEO, buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const slug = lang === 'de' ? 'kontakt' : 'contact';
  const canonical = `${BASE_URL}/${lang}/${slug}`;

  return buildPageMetadata({
    title: PAGE_SEO.contact.title,
    description: PAGE_SEO.contact.description,
    canonical,
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
