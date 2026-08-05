import { Playfair_Display, Lato } from 'next/font/google';
import Script from 'next/script';
import { headers } from 'next/headers';
import { AuthProvider } from '@/context/AuthContext';
import { HOME_SEO, SITE_NAME, OG_IMAGE, BASE_URL } from '@/lib/seo';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-serif',
  display: 'swap',
  preload: true,
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

export const metadata = {
  title: HOME_SEO.title,
  description: HOME_SEO.description,
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: HOME_SEO.title,
    description: HOME_SEO.description,
    siteName: SITE_NAME,
    locale: 'de_DE',
    type: 'website',
    images: [{ url: OG_IMAGE, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_SEO.title,
    description: HOME_SEO.description,
    images: [OG_IMAGE],
  },
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({ children }) {
  const headersList = await headers();
  const lang = headersList.get('x-lang') || 'de';

  return (
    <html lang={lang} className={`${playfair.variable} ${lato.variable}`}>
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-WP56MFSJ');`,
          }}
        />
      </head>
      <body className="font-sans text-stone-700 bg-white antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WP56MFSJ"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
