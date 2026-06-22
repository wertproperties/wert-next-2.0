import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const COOKIE_KEY = 'wert_cookie_consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState({
    necessary: true,   // always true
    functional: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(COOKIE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.timestamp && parsed.version) {
          return;
        }
      }
      localStorage.removeItem(COOKIE_KEY);
    } catch {
      localStorage.removeItem(COOKIE_KEY);
    }
    const timer = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const saveConsent = (accepted) => {
    const consent = {
      necessary: true,
      functional: accepted ? prefs.functional : false,
      analytics: accepted ? prefs.analytics : false,
      marketing: accepted ? prefs.marketing : false,
      timestamp: new Date().toISOString(),
      version: '1.0',
    };
    localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
    setVisible(false);
    window.dispatchEvent(new CustomEvent('cookieConsentSet', { detail: consent }));
  };

  const acceptAll = () => {
    const consent = {
      necessary: true, functional: true, analytics: true, marketing: true,
      timestamp: new Date().toISOString(), version: '1.0',
    };
    localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
    setVisible(false);
    window.dispatchEvent(new CustomEvent('cookieConsentSet', { detail: consent }));
  };

  const rejectAll = () => {
    setPrefs({ necessary: true, functional: false, analytics: false, marketing: false });
    saveConsent(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[200] flex justify-center items-end pb-4 px-4 pointer-events-none"
      style={{ zIndex: 9999 }}
    >
      <div
        className="pointer-events-auto w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden"
        style={{ animation: 'wertSlideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards' }}
      >
        <style>{`
    @keyframes wertSlideUp {
      from { opacity: 0; transform: translateY(30px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `}</style>
        {/* Header */}
        <div className="bg-amber-500 px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 14a6 6 0 110-12 6 6 0 010 12zm0-9a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1zm0-2a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-white font-bold text-base leading-tight">Datenschutz & Cookie-Einstellungen</h2>
            <p className="text-amber-100 text-xs">Privacy & Cookie Settings</p>
          </div>
        </div>

        <div className="px-6 py-5">
          <p className="text-stone-700 text-sm leading-relaxed mb-4">
            Wir verwenden Cookies und ähnliche Technologien auf unserer Website. Einige sind technisch notwendig, andere helfen uns, diese Website und Ihre Erfahrung zu verbessern. Personenbezogene Daten können verarbeitet werden (z.B. IP-Adressen), z.B. für personalisierte Anzeigen und Inhalte oder Anzeigen- und Inhaltsmessung.{' '}
            <span className="text-stone-500 text-xs">
              (We use cookies. Some are necessary, others improve your experience and may process personal data.)
            </span>
          </p>

          {/* Cookie Categories */}
          {showDetails && (
            <div className="mb-5 space-y-3 border border-stone-200 rounded-xl overflow-hidden">
              {[
                {
                  key: 'necessary',
                  label: 'Notwendig / Necessary',
                  desc: 'Diese Cookies sind für den Betrieb der Website unbedingt erforderlich. (Required for the website to function.)',
                  locked: true,
                },
                {
                  key: 'functional',
                  label: 'Funktional / Functional',
                  desc: 'Ermöglichen erweiterte Funktionalitäten wie Chat und Präferenzen. (Enable chat and preference features.)',
                  locked: false,
                },
                {
                  key: 'analytics',
                  label: 'Analyse / Analytics',
                  desc: 'Helfen uns zu verstehen, wie Besucher mit der Website interagieren. (Help understand visitor behavior.)',
                  locked: false,
                },
                {
                  key: 'marketing',
                  label: 'Marketing',
                  desc: 'Werden verwendet, um Besuchern relevante Werbung zu liefern. (Used to deliver relevant ads.)',
                  locked: false,
                },
              ].map(cat => (
                <div key={cat.key} className="flex items-start justify-between px-4 py-3 bg-stone-50 border-b border-stone-100 last:border-0">
                  <div className="pr-4 flex-1">
                    <p className="text-stone-800 font-semibold text-sm">{cat.label}</p>
                    <p className="text-stone-500 text-xs mt-0.5 leading-relaxed">{cat.desc}</p>
                  </div>
                  <div className="shrink-0 mt-0.5">
                    {cat.locked ? (
                      <span className="text-xs text-amber-600 font-bold bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">Immer aktiv</span>
                    ) : (
                      <button
                        onClick={() => setPrefs(p => ({ ...p, [cat.key]: !p[cat.key] }))}
                        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${prefs[cat.key] ? 'bg-amber-500' : 'bg-stone-300'}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${prefs[cat.key] ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Legal links */}
          <p className="text-xs text-stone-400 mb-5">
            Weitere Informationen finden Sie in unserer{' '}
            <Link to="/datenschutz" className="text-amber-600 hover:underline font-medium">Datenschutzerklärung</Link>
            {' '}und unserem{' '}
            <Link to="/impressum" className="text-amber-600 hover:underline font-medium">Impressum</Link>.
            {' '}Sie können Ihre Einwilligung jederzeit widerrufen. (You can withdraw consent at any time.)
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={acceptAll}
              className="flex-1 sm:flex-none bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2.5 text-sm uppercase tracking-wider rounded-lg transition-colors"
            >
              Alle akzeptieren / Accept All
            </button>
            <button
              onClick={() => saveConsent(true)}
              className="flex-1 sm:flex-none bg-stone-800 hover:bg-stone-700 text-white font-bold px-6 py-2.5 text-sm uppercase tracking-wider rounded-lg transition-colors"
            >
              Auswahl speichern / Save Selection
            </button>
            <button
              onClick={rejectAll}
              className="flex-1 sm:flex-none border border-stone-300 hover:border-stone-400 text-stone-600 hover:text-stone-800 font-bold px-6 py-2.5 text-sm uppercase tracking-wider rounded-lg transition-colors"
            >
              Ablehnen / Reject
            </button>
            <button
              onClick={() => setShowDetails(d => !d)}
              className="text-amber-600 hover:text-amber-700 text-sm font-medium underline underline-offset-2 ml-auto transition-colors"
            >
              {showDetails ? 'Weniger anzeigen ▲' : 'Einstellungen anpassen ▼'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
