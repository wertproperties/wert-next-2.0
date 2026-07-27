import { LangProvider } from '@/context/LangContext';
import MainLayoutWrapper from '@/components/MainLayoutWrapper';
import { SUPPORTED_LANGS, DEFAULT_LANG } from '@/lib/routes';

export async function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export default async function MultilingualLayout({ children, params }) {
  const resolvedParams = await params;
  const lang = SUPPORTED_LANGS.includes(resolvedParams?.lang) ? resolvedParams.lang : DEFAULT_LANG;

  return (
    <LangProvider initialLang={lang}>
      <MainLayoutWrapper>{children}</MainLayoutWrapper>
    </LangProvider>
  );
}
