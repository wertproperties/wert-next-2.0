import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';


const ChevronDown = () => (
  <svg className="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
  </svg>
);
const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const XIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const GlobeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function Navbar() {
  const { t, lang, toggleLang } = useLang();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const location = useLocation();
  const navRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMobileOpen(false); setActiveDropdown(null); }, [location]);

  useEffect(() => {
    const handler = (e) => { if (navRef.current && !navRef.current.contains(e.target)) setActiveDropdown(null); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const n = t.nav;
  const isHome = location.pathname === '/';
  const navBg = scrolled || !isHome ? 'bg-stone-900 shadow-lg py-3' : 'bg-transparent py-5';

  return (
    <header ref={navRef} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${navBg}`}>
      {/* Top bar */}
      <div className={`border-b border-white/10 ${scrolled || !isHome ? 'hidden' : 'hidden lg:block'}`}>
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-end items-center gap-6">
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="py-2">
          <img
            src={logo}
            alt="WERT Logo"
            className="h-16 w-auto object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Lang toggle */}
          <button
            onClick={toggleLang}
            className="hidden md:flex items-center gap-1.5 border border-white/30 hover:border-sky-300 text-white/80 hover:text-sky-500 text-xs font-bold px-3 py-2 transition-all duration-200 uppercase tracking-wider"
            title={lang === 'en' ? 'Switch to German' : 'Wechseln zu Englisch'}
          >
            <GlobeIcon />
            <span>{lang === 'en' ? 'DE' : 'EN'}</span>
          </button>

          <Link
            to="/contact"
            className="hidden md:flex items-center gap-2 bg-sky-300 hover:bg-sky-400 text-slate-900 font-bold text-xs px-5 py-2.5 uppercase tracking-wider transition-all duration-200"
          >
            {n.contact}
          </Link>

          <Link
            to={user ? (user.role === 'admin' ? '/admin' : '/portal') : '/login'}
            className="hidden lg:flex items-center gap-2 border border-white/30 hover:border-sky-300 text-white/80 hover:text-sky-500 text-xs font-medium px-4 py-2.5 transition-all"
          >
            {user ? (lang === 'en' ? 'My Portal' : 'Mein Portal') : n.customerPortal}
          </Link>

          {/* Mobile toggle */}
          <button className="lg:hidden text-white p-1" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-stone-900 border-t border-white/10 max-h-[80vh] overflow-y-auto">
          <div className="px-6 py-4 space-y-1">
            {/* {navItems.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <>
                    <button
                      className="flex items-center justify-between w-full py-3 text-white/85 font-medium text-sm border-b border-white/10"
                      onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                    >
                      {item.label}
                      <ChevronDown />
                    </button>
                    {mobileExpanded === item.label && (
                      <div className="pl-4 py-2 space-y-1">
                        {item.children.map((c) => (
                          <Link key={c.label} to={c.href} className="block py-2 text-sm text-white/60 hover:text-accent transition-colors">
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link to={item.href} className="block py-3 text-white/85 font-medium text-sm border-b border-white/10 hover:text-accent transition-colors">
                    {item.label}
                  </Link>
                )}
              </div>
            ))} */}
            <div className="pt-4 flex flex-col gap-3">
              <button onClick={toggleLang} className="flex items-center gap-2 text-white/70 text-sm py-2">
                <GlobeIcon />{lang === 'en' ? 'Deutsch' : 'English'}
              </button>
              <Link to="/contact" className="btn-primary text-center text-xs">{n.contact}</Link>
              <Link
                to={user ? (user.role === 'admin' ? '/admin' : '/portal') : '/login'}
                className="border border-white/20 text-white/70 text-xs text-center py-2.5 px-4 uppercase tracking-wider"
              >
                {user ? (lang === 'en' ? 'My Portal' : 'Mein Portal') : n.customerPortal}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
