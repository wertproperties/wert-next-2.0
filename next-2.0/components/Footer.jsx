'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from '@/context/LangContext';
import { CONTACT_EMAIL, CONTACT_ADDRESS } from '@/lib/site';
import { localePath } from '@/lib/routes';

export default function Footer() {
  const { t, lang } = useLang();
  const pathname = usePathname();
  const f = t.footer;
  const n = t.nav;
  const contactPath = localePath(lang, '/contact');

  const handleInquiryClick = (e) => {
    if (pathname !== contactPath) return;
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 bg-accent flex items-center justify-center font-black text-slate-900 text-base">
                W
              </div>

              <div>
                <p className="text-accent text-xs tracking-[0.2em] uppercase font-light">
                  Hausverwaltung
                </p>
                <p className="text-white font-black text-xl tracking-tighter">
                  WERT
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-500 leading-relaxed whitespace-nowrap max-sm:whitespace-normal">
              {f.desc}
            </p>
            <p className="text-sm text-slate-400 font-medium mt-1 max-w-md">
              {f.tagline}
            </p>
            <p className="text-sm text-slate-500 mt-3 max-w-md">
              {f.ctaQuestion}
            </p>
            <Link
              href={contactPath}
              onClick={handleInquiryClick}
              className="inline-block text-sm text-accent hover:text-accent-light font-semibold mt-1 mb-4 transition-colors"
            >
              {f.ctaAction}
            </Link>

            <div className="mt-4 space-y-2">

              {/* Office Phone */}
              <a
                href="tel:+4991130024389"
                className="flex items-center gap-2 text-sm hover:text-accent transition-colors"
              >
                <span className="text-accent">☎</span>
                <span>
                  <strong>{lang === 'de' ? 'Telefon:' : 'Phone:'}</strong> 0911 30024389
                </span>
              </a>

              {/* Mobile */}
              <a
                href="tel:+4915124261124"
                className="flex items-center gap-2 text-sm hover:text-accent transition-colors"
              >
                <span className="text-accent">📱</span>
                <span>
                  <strong>{lang === 'de' ? 'Mobil:' : 'Mobile:'}</strong> 0151 24261124
                </span>
              </a>

              {/* Email */}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-2 text-sm hover:text-accent transition-colors"
              >
                <span className="text-accent">✉</span>
                {CONTACT_EMAIL}
              </a>

              {/* Address */}
              <address className="flex items-start gap-2 text-sm not-italic pt-1">
                <span className="text-accent leading-6">⌂</span>
                <span className="leading-6">
                  {CONTACT_ADDRESS.street}
                  <br />
                  {CONTACT_ADDRESS.city}
                  <br />
                  {lang === 'de' ? 'Deutschland' : 'Germany'}
                </span>
              </address>

            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-5">
              {f.navigation}
            </h4>

            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href={localePath(lang, '/')}
                  className="hover:text-accent transition-colors"
                >
                  {lang === 'de' ? 'Startseite' : 'Home'}
                </Link>
              </li>

              <li>
                <Link
                  href={localePath(lang, '/services')}
                  className="hover:text-accent transition-colors"
                >
                  {lang === 'de'
                    ? 'Hausverwaltung Leistungen'
                    : 'Property Management Services'}
                </Link>
              </li>

              <li>
                <Link
                  href={localePath(lang, '/locations')}
                  className="hover:text-accent transition-colors"
                >
                  {lang === 'de'
                    ? 'Standorte Metropolregion Nürnberg'
                    : 'Nuremberg Metro Locations'}
                </Link>
              </li>

              <li>
                <Link
                  href={localePath(lang, '/objects')}
                  className="hover:text-accent transition-colors"
                >
                  {n.objects}
                </Link>
              </li>

              <li>
                <Link
                  href={localePath(lang, '/contact')}
                  className="hover:text-accent transition-colors"
                >
                  {n.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-5">
              {f.legal}
            </h4>

            <ul className="space-y-2.5 text-sm">

              <li>
                <Link
                  href={localePath(lang, '/impressum')}
                  className="hover:text-accent transition-colors"
                >
                  {f.links.impressum}
                </Link>
              </li>

              <li>
                <Link
                  href={localePath(lang, '/datenschutz')}
                  className="hover:text-accent transition-colors"
                >
                  {f.links.datenschutz}
                </Link>
              </li>

              <li>
                <Link
                  href={localePath(lang, '/forms/damage')}
                  className="hover:text-accent transition-colors"
                >
                  {n.damageReport}
                </Link>
              </li>

              <li>
                <Link
                  href={localePath(lang, '/forms/key')}
                  className="hover:text-accent transition-colors"
                >
                  {n.keyOrder}
                </Link>
              </li>

              <li>
                <Link
                  href={localePath(lang, '/forms/tenant-change')}
                  className="hover:text-accent transition-colors"
                >
                  {n.tenantChange}
                </Link>
              </li>

            </ul>
          </div>

        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">

          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Hausverwaltung WERT . {f.rights}
          </p>

          <Link
            href={localePath(lang, '/login')}
            className="text-xs text-accent hover:text-accent-light font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
          >
            {f.portal} →
          </Link>

        </div>
      </div>
    </footer>
  );
}
