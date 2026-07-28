'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import Chatbot from './Chatbot';
import CookieBanner from './CookieBanner';

export default function MainLayoutWrapper({ children }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR/hydration, render only children to avoid hydration mismatch
  // because usePathname returns null on server and real path on client
  if (!mounted) {
    return <>{children}</>;
  }

  // Auth and dashboard pages have their own layout (no Navbar/Footer/Chatbot/CookieBanner)
  const isAdmin = pathname?.startsWith('/de/admin') || pathname?.startsWith('/en/admin');
  const isPortal = pathname?.startsWith('/de/portal') || pathname?.startsWith('/en/portal');
  const isLogin = pathname?.startsWith('/de/login') || pathname?.startsWith('/en/login');
  const isSignup = pathname?.startsWith('/de/signup') || pathname?.startsWith('/en/signup');
  const hideLayout = isAdmin || isPortal || isLogin || isSignup;

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen">{children}</div>
      <Footer />
      <Chatbot />
      <CookieBanner />
    </>
  );
}
