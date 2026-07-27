/**
 * Multilingual route helpers.
 *
 * German and English use different URL slugs.
 * English: /en/services, /en/contact, /en/objects, /en/forms/damage ...
 * German:  /de/leistungen, /de/kontakt, /de/objekte, /de/formulare/schaden ...
 *
 * The [lang] prefix is the source of truth for language.
 */

export const SUPPORTED_LANGS = ['de', 'en'];
export const DEFAULT_LANG = 'de';

/**
 * Map of page keys to their language-specific slugs.
 * The key is the canonical page identifier.
 */
export const SLUG_MAP = {
  '/':                { de: '/',                en: '/' },
  '/services':        { de: '/leistungen',      en: '/services' },
  '/contact':         { de: '/kontakt',         en: '/contact' },
  '/objects':          { de: '/objekte',         en: '/objects' },
  '/impressum':       { de: '/impressum',       en: '/impressum' },
  '/datenschutz':     { de: '/datenschutz',     en: '/datenschutz' },
  '/login':           { de: '/login',           en: '/login' },
  '/signup':          { de: '/signup',          en: '/signup' },
  '/portal':          { de: '/portal',          en: '/portal' },
  '/admin':           { de: '/admin',           en: '/admin' },
  '/forms/damage':        { de: '/formulare/schaden',        en: '/forms/damage' },
  '/forms/key':           { de: '/formulare/schluessel',     en: '/forms/key' },
  '/forms/tenant-change': { de: '/formulare/mieterwechsel',  en: '/forms/tenant-change' },
};

/**
 * Reverse lookup: given a language and a slug, return the canonical page key.
 */
const REVERSE_MAP = {};
for (const [key, langs] of Object.entries(SLUG_MAP)) {
  for (const [lang, slug] of Object.entries(langs)) {
    if (!REVERSE_MAP[lang]) REVERSE_MAP[lang] = {};
    REVERSE_MAP[lang][slug] = key;
  }
}

/**
 * Build a localized path using the correct slug for the target language.
 * @param {string} lang - 'de' or 'en'
 * @param {string} canonicalPath - canonical path like '/services', '/contact'
 * @returns {string} e.g. '/de/leistungen' or '/en/services'
 */
export function localePath(lang, canonicalPath = '/') {
  const slug = SLUG_MAP[canonicalPath]?.[lang] || canonicalPath;
  return `/${lang}${slug === '/' ? '' : slug}`;
}

/**
 * Get the equivalent path in the other language.
 * Used by the language switcher in the Navbar.
 *
 * @param {string} currentPath - full path e.g. '/de/leistungen' or '/en/services'
 * @param {string} targetLang - 'de' or 'en'
 * @returns {string} e.g. '/en/services' or '/de/leistungen'
 */
export function switchLangPath(currentPath, targetLang) {
  // Extract current lang and slug
  const match = currentPath.match(/^\/(de|en)(\/.*)?$/);
  if (!match) return `/${targetLang}`;

  const currentLang = match[1];
  const currentSlug = match[2] || '/';

  // Find the canonical key from the current language's slug
  const canonicalKey = REVERSE_MAP[currentLang]?.[currentSlug] || currentSlug;

  // Get the slug for the target language
  const targetSlug = SLUG_MAP[canonicalKey]?.[targetLang] || currentSlug;

  return `/${targetLang}${targetSlug === '/' ? '' : targetSlug}`;
}

/**
 * Extract language from pathname.
 * @param {string} pathname - e.g. '/de/leistungen'
 * @returns {string} 'de' or 'en', defaults to 'de'
 */
export function getLangFromPath(pathname) {
  const match = pathname.match(/^\/(de|en)/);
  return match ? match[1] : DEFAULT_LANG;
}

/**
 * Get the German slug for a canonical path.
 */
export function deSlug(canonicalPath) {
  return SLUG_MAP[canonicalPath]?.de || canonicalPath;
}

/**
 * Get the English slug for a canonical path.
 */
export function enSlug(canonicalPath) {
  return SLUG_MAP[canonicalPath]?.en || canonicalPath;
}
