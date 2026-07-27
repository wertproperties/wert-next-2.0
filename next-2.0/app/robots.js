export default function robots() {
  const baseUrl = 'https://www.hausverwaltungwert.de';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/portal',
          '/login',
          '/signup',
          '/forms/',
          '/*/admin',
          '/*/portal',
          '/*/login',
          '/*/signup',
          '/*/forms/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
