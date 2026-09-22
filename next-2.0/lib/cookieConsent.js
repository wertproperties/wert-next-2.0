export const COOKIE_CONSENT_KEY = 'wert_cookie_consent';
export const CONSENT_VERSION = '1.0';
export const GTM_ID = 'GTM-WP56MFSJ';

/** Login session. This is localStorage, not an HTTP cookie, and must survive Reject. */
export const LOGIN_STORAGE_KEY = 'wert_token';

/**
 * HTTP cookies that stay after Reject.
 * Login does not use a cookie; `wert_token` lives in localStorage.
 */
const NECESSARY_COOKIES = new Set();

const ANALYTICS_PREFIXES = ['_ga', '_gid', '_gat', '_dc_gtm', 'AMP_TOKEN', '_gac_'];
const MARKETING_PREFIXES = ['_gcl_', '_fbp', '_fbc', 'IDE', 'fr', '_uetsid', '_uetvid', 'muc_ads', '_ttp', 'ttcsid'];

export function readConsent() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.timestamp || !parsed.version) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function isCategoryAllowed(category) {
  if (category === 'necessary') return true;
  const consent = readConsent();
  return !!(consent && consent[category]);
}

export function trackingAllowed(consent) {
  return !!(consent && (consent.analytics || consent.marketing));
}

function readCookieNames() {
  if (typeof document === 'undefined' || !document.cookie) return [];
  return document.cookie
    .split(';')
    .map((part) => part.split('=')[0].trim())
    .filter(Boolean);
}

function deleteCookie(name) {
  if (NECESSARY_COOKIES.has(name)) return;
  const hostname = window.location.hostname;
  const bare = hostname.replace(/^www\./, '');
  const domains = ['', hostname, `.${hostname}`, bare, `.${bare}`];
  const parts = bare.split('.');
  if (parts.length > 2) {
    const parent = parts.slice(-2).join('.');
    domains.push(parent, `.${parent}`);
  }
  const expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
  [...new Set(domains)].forEach((domain) => {
    const domainPart = domain ? `; domain=${domain}` : '';
    const base = `${name}=; expires=${expires}; max-age=0; path=/${domainPart}`;
    document.cookie = base;
    document.cookie = `${base}; Secure`;
    document.cookie = `${base}; SameSite=Lax`;
    document.cookie = `${base}; Secure; SameSite=None`;
  });
}

function deleteCookiesByPrefix(prefixes) {
  readCookieNames().forEach((name) => {
    if (prefixes.some((prefix) => name === prefix || name.startsWith(prefix))) {
      deleteCookie(name);
    }
  });
}

function deleteAllCookies() {
  readCookieNames().forEach(deleteCookie);
}

const PROTECTED_LOCAL_KEYS = new Set([LOGIN_STORAGE_KEY, COOKIE_CONSENT_KEY]);

function removeLocal(key) {
  if (PROTECTED_LOCAL_KEYS.has(key)) return;
  try { localStorage.removeItem(key); } catch { /* ignore */ }
}

function clearFunctionalStorage() {
  removeLocal('wert_chat_visitor');
  try { sessionStorage.removeItem('wert_chat_session'); } catch { /* ignore */ }
}

/** Remove storage the visitor did not allow. Never touches the login token. */
export function purgeForConsent(consent) {
  if (typeof document === 'undefined') return;
  const analytics = !!consent?.analytics;
  const marketing = !!consent?.marketing;
  const functional = !!consent?.functional;
  const rejectedOptional = consent && !analytics && !marketing && !functional;

  if (!analytics) deleteCookiesByPrefix(ANALYTICS_PREFIXES);
  if (!marketing) deleteCookiesByPrefix(MARKETING_PREFIXES);
  if (rejectedOptional) deleteAllCookies();
  if (!functional) clearFunctionalStorage();
}

export function updateGoogleConsent(consent) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
  const flag = (on) => (on ? 'granted' : 'denied');
  const payload = {
    ad_storage: flag(consent?.marketing),
    ad_user_data: flag(consent?.marketing),
    ad_personalization: flag(consent?.marketing),
    analytics_storage: flag(consent?.analytics),
    functionality_storage: flag(consent?.functional),
    personalization_storage: flag(consent?.marketing),
    security_storage: 'granted',
  };
  window.gtag('consent', 'default', { ...payload, wait_for_update: 500 });
  window.gtag('consent', 'update', payload);
}

/** On load: drop tracking cookies when there is no opt-in yet, or when saved consent denies them. */
export function enforceSavedConsent() {
  const consent = readConsent();
  updateGoogleConsent(consent);
  if (!consent) {
    deleteCookiesByPrefix([...ANALYTICS_PREFIXES, ...MARKETING_PREFIXES]);
    return;
  }
  purgeForConsent(consent);
}

export function persistConsent(partial) {
  const consent = {
    necessary: true,
    functional: !!partial.functional,
    analytics: !!partial.analytics,
    marketing: !!partial.marketing,
    timestamp: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
  purgeForConsent(consent);
  updateGoogleConsent(consent);
  window.dispatchEvent(new CustomEvent('cookieConsentSet', { detail: consent }));
  if (!trackingAllowed(consent) && document.getElementById('gtm-script')) {
    window.location.reload();
  }
  return consent;
}
