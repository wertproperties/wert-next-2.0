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
          '/formulare/',
          '/*/admin',
          '/*/portal',
          '/*/login',
          '/*/signup',
          '/*/forms/',
          '/*/formulare/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
