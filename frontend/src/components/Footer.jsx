import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import { CONTACT_EMAIL, CONTACT_ADDRESS } from '../config/site';

export default function Footer() {
  const { t, lang } = useLang();
  const f = t.footer;
  const n = t.nav;

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

            <div className="mt-4 space-y-1">
              <a
                href="tel:+4915124261124"
                className="flex items-center gap-2 text-sm hover:text-accent transition-colors"
              >
                <span className="text-accent">✆</span>
                +49 151 24261124
              </a>

              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-2 text-sm hover:text-accent transition-colors"
              >
                <span className="text-accent">✉</span>
                {CONTACT_EMAIL}
              </a>

              <address className="flex items-start gap-2 text-sm not-italic pt-1">
                <span className="text-accent leading-6">⌂</span>
                <span className="leading-6">
                  {CONTACT_ADDRESS.street}<br />
                  {CONTACT_ADDRESS.city}<br />
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
                  to="/services"
                  className="hover:text-accent transition-colors"
                >
                  {n.services}
                </Link>
              </li>

              <li>
                <Link
                  to="/objects"
                  className="hover:text-accent transition-colors"
                >
                  {n.objects}
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
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
                  to="/impressum"
                  className="hover:text-accent transition-colors"
                >
                  {f.links.impressum}
                </Link>
              </li>

              <li>
                <Link
                  to="/datenschutz"
                  className="hover:text-accent transition-colors"
                >
                  {f.links.datenschutz}
                </Link>
              </li>

              <li>
                <Link
                  to="/forms/damage"
                  className="hover:text-accent transition-colors"
                >
                  {n.damageReport}
                </Link>
              </li>

              <li>
                <Link
                  to="/forms/key"
                  className="hover:text-accent transition-colors"
                >
                  {n.keyOrder}
                </Link>
              </li>

              <li>
                <Link
                  to="/forms/tenant-change"
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
            to="/login"
            className="text-xs text-accent hover:text-accent-light font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
          >
            {f.portal} →
          </Link>

        </div>
      </div>
    </footer>
  );
}