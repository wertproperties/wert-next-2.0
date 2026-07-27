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

  // Admin and portal pages have their own layout (no Navbar/Footer/Chatbot/CookieBanner)
  const isAdmin = pathname?.startsWith('/de/admin') || pathname?.startsWith('/en/admin');
  const isPortal = pathname?.startsWith('/de/portal') || pathname?.startsWith('/en/portal');
  const hideLayout = isAdmin || isPortal;

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
