import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';

export default function Footer() {
  const { t } = useLang();
  const f = t.footer;
  const n = t.nav;

  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 bg-accent flex items-center justify-center font-black text-slate-900 text-base">W</div>
              <div>
                <p className="text-white font-black text-xl tracking-tighter">WERT</p>
                <p className="text-accent text-xs tracking-[0.2em] uppercase font-light">Property Management</p>
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <a href="tel:123456790" className="flex items-center gap-2 text-sm hover:text-accent transition-colors">
                <span className="text-accent">✆</span> +4915124261124
              </a>
              <a href="mailto:wertimmoverwaltung@outlook.com" className="flex items-center gap-2 text-sm hover:text-accent transition-colors">
                <span className="text-accent">✉</span> wertimmoverwaltung@outlook.com
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-5">{f.navigation}</h4>
            <ul className="space-y-2.5 text-sm">
              {/* <li><Link to="/company" className="hover:text-accent transition-colors">{n.company}</Link></li> */}
              <li><Link to="/services" className="hover:text-accent transition-colors">{n.services}</Link></li>
              <li><Link to="/objects" className="hover:text-accent transition-colors">{n.objects}</Link></li>
              {/* <li><Link to="/bvi" className="hover:text-accent transition-colors">{n.bvi}</Link></li>
              <li><Link to="/vdiv" className="hover:text-accent transition-colors">{n.vdiv}</Link></li> */}
              <li><Link to="/contact" className="hover:text-accent transition-colors">{n.contact}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div className="">
              <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-5">{t.nav.forms}</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/forms/damage" className="hover:text-accent transition-colors">{n.damageReport}</Link></li>
                <li><Link to="/forms/key" className="hover:text-accent transition-colors">{n.keyOrder}</Link></li>
                <li><Link to="/forms/tenant-change" className="hover:text-accent transition-colors">{n.tenantChange}</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} WERT Property Management GmbH. {f.rights}
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
