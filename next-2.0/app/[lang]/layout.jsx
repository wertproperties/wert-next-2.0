import { LangProvider } from '@/context/LangContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import CookieBanner from '@/components/CookieBanner';
import { SUPPORTED_LANGS, DEFAULT_LANG } from '@/lib/routes';

export async function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export default async function MultilingualLayout({ children, params }) {
  const resolvedParams = await params;
  const lang = SUPPORTED_LANGS.includes(resolvedParams?.lang) ? resolvedParams.lang : DEFAULT_LANG;

  return (
    <LangProvider initialLang={lang}>
      <Navbar />
      <div className="min-h-screen">{children}</div>
      <Footer />
      <Chatbot />
      <CookieBanner />
    </LangProvider>
  );
}
