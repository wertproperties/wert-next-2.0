import { Playfair_Display, Lato } from 'next/font/google';
import { headers } from 'next/headers';
import { AuthProvider } from '@/context/AuthContext';
import GoogleTagManager from '@/components/GoogleTagManager';
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
      <body className="font-sans text-stone-700 bg-white antialiased">
        <GoogleTagManager />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
