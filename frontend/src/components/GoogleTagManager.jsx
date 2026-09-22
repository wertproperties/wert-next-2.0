import { useEffect } from 'react';
import { enforceSavedConsent, GTM_ID, readConsent, trackingAllowed, updateGoogleConsent } from '../utils/cookieConsent';

function injectGtm() {
  if (document.getElementById('gtm-script')) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  const script = document.createElement('script');
  script.id = 'gtm-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(script);
}

export default function GoogleTagManager() {
  useEffect(() => {
    enforceSavedConsent();

    const sync = (consent) => {
      updateGoogleConsent(consent);
      if (trackingAllowed(consent)) injectGtm();
    };

    sync(readConsent());
    const onConsent = (event) => sync(event.detail);
    window.addEventListener('cookieConsentSet', onConsent);
    return () => window.removeEventListener('cookieConsentSet', onConsent);
  }, []);

  return null;
}
