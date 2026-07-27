const baseUrl = 'https://www.hausverwaltungwert.de';

export default async function sitemap() {
  const langs = ['de', 'en'];

  const publicRoutes = [
    { path: { de: '/', en: '/' }, priority: 1.0, changeFrequency: 'monthly' },
    { path: { de: '/leistungen', en: '/services' }, priority: 0.9, changeFrequency: 'monthly' },
    { path: { de: '/kontakt', en: '/contact' }, priority: 0.8, changeFrequency: 'yearly' },
    { path: { de: '/objekte', en: '/objects' }, priority: 0.7, changeFrequency: 'monthly' },
    { path: { de: '/impressum', en: '/impressum' }, priority: 0.3, changeFrequency: 'yearly' },
    { path: { de: '/datenschutz', en: '/datenschutz' }, priority: 0.3, changeFrequency: 'yearly' },
  ];

  const entries = [];

  for (const route of publicRoutes) {
    for (const lang of langs) {
      const url = `${baseUrl}/${lang}${route.path[lang] === '/' ? '' : route.path[lang]}`;
      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: {
            de: `${baseUrl}/de${route.path.de === '/' ? '' : route.path.de}`,
            en: `${baseUrl}/en${route.path.en === '/' ? '' : route.path.en}`,
            'x-default': `${baseUrl}/de${route.path.de === '/' ? '' : route.path.de}`,
          },
        },
      });
    }
  }

  // Fetch properties from the API
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
    const res = await fetch(`${apiUrl}/properties`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    if (res.ok) {
      const data = await res.json();
      const properties = data.data || [];
      for (const property of properties) {
        if (property._id) {
          for (const lang of langs) {
            const slug = lang === 'de' ? 'objekte' : 'objects';
            entries.push({
              url: `${baseUrl}/${lang}/${slug}/${property._id}`,
              lastModified: new Date(property.updatedAt || property.createdAt || Date.now()),
              changeFrequency: 'monthly',
              priority: 0.6,
              alternates: {
                languages: {
                  de: `${baseUrl}/de/objekte/${property._id}`,
                  en: `${baseUrl}/en/objects/${property._id}`,
                  'x-default': `${baseUrl}/de/objekte/${property._id}`,
                },
              },
            });
          }
        }
      }
    }
  } catch {
    // If API is unavailable, skip property entries
  }

  return entries;
}
