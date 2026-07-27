'use client';

import { createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import translations from '@/lib/translations';
import { switchLangPath } from '@/lib/routes';

const LangContext = createContext();

export const LangProvider = ({ children, initialLang = 'de' }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Determine current lang from pathname or fallback to initialLang
  let lang = initialLang;
  if (pathname) {
    if (pathname.startsWith('/en')) {
      lang = 'en';
    } else if (pathname.startsWith('/de')) {
      lang = 'de';
    }
  }

  const t = translations[lang] || translations.de;

  const toggleLang = () => {
    const nextLang = lang === 'en' ? 'de' : 'en';
    const newPath = switchLangPath(pathname || `/${lang}`, nextLang);
    router.push(newPath);
  };

  const setLang = (targetLang) => {
    if (targetLang === lang) return;
    const newPath = switchLangPath(pathname || `/${lang}`, targetLang);
    router.push(newPath);
  };

  return (
    <LangContext.Provider
      value={{
        lang,
        language: lang,
        setLang,
        toggleLang,
        t,
      }}
    >
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
export default LangContext;
