'use client';

import Link from 'next/link';
import { useLang } from '@/context/LangContext';
import PageHero from '@/components/PageHero';
import { LOCATIONS } from '@/lib/locations';
import { localePath } from '@/lib/routes';

/**
 * Location hub or city detail — mirrors existing PageHero + section patterns
 * so visual language stays consistent with other public pages.
 */
export default function LocationPage({ location = null }) {
  const { lang, t } = useLang();
  const isDe = lang === 'de';
  const isHub = !location;

  const title = isHub
    ? isDe
      ? 'Standorte & Servicegebiet'
      : 'Locations & Service Area'
    : isDe
      ? `Hausverwaltung ${location.name}`
      : `Property Management ${location.nameEn}`;

  const desc = isHub
    ? isDe
      ? 'Hausverwaltung WERT betreut Immobilien in Nürnberg und der gesamten Metropolregion.'
      : 'Hausverwaltung WERT manages properties in Nuremberg and the entire metropolitan region.'
    : location.description[lang] || location.description.de;

  const tag = isDe ? 'Servicegebiet' : 'Service Area';

  const breadcrumbs = isHub
    ? [{ label: isDe ? 'Standorte' : 'Locations' }]
    : [
        { label: isDe ? 'Standorte' : 'Locations', href: '/locations' },
        { label: isDe ? location.name : location.nameEn },
      ];

  return (
    <main>
      <PageHero
        tag={tag}
        title={title}
        desc={desc}
        bgImage="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1400&q=80"
        breadcrumbs={breadcrumbs}
      />

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {isHub ? (
            <>
              <div className="text-center mb-14">
                <h2 className="section-title mb-4">
                  {isDe
                    ? 'Metropolregion Nürnberg'
                    : 'Nuremberg Metropolitan Region'}
                </h2>
                <p className="text-stone-500 max-w-2xl mx-auto leading-relaxed">
                  {isDe
                    ? 'Wählen Sie Ihren Standort, um mehr über unsere Hausverwaltung vor Ort zu erfahren.'
                    : 'Choose your location to learn more about our local property management services.'}
                </p>
              </div>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {LOCATIONS.map((loc) => (
                  <li key={loc.slug}>
                    <Link
                      href={localePath(lang, `/locations/${loc.slug}`)}
                      className="block border border-stone-200 p-6 hover:border-accent hover:shadow-lg transition-all duration-300 h-full"
                    >
                      <h3 className="text-stone-900 font-bold text-lg mb-2">
                        {isDe ? loc.name : loc.nameEn}
                      </h3>
                      <p className="text-stone-500 text-sm leading-relaxed line-clamp-3">
                        {loc.description[lang] || loc.description.de}
                      </p>
                      <span className="inline-block mt-4 text-amber-600 text-xs font-bold uppercase tracking-wider">
                        {isDe ? 'Mehr erfahren' : 'Learn more'} →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <div className="max-w-3xl mx-auto mb-16">
                <h2 className="section-title mb-6">
                  {isDe
                    ? `Unsere Leistungen in ${location.name}`
                    : `Our services in ${location.nameEn}`}
                </h2>
                <p className="text-stone-600 leading-relaxed mb-6">
                  {location.description[lang] || location.description.de}
                </p>
                <p className="text-stone-600 leading-relaxed">
                  {isDe
                    ? 'Als Hausverwaltung mit Sitz in Zirndorf betreuen wir Eigentümergemeinschaften, Mietobjekte und Gewerbeimmobilien in der gesamten Metropolregion Nürnberg — persönlich, transparent und zuverlässig.'
                    : 'Based in Zirndorf, we manage owner associations, rental properties and commercial real estate across the Nuremberg Metropolitan Region — personally, transparently and reliably.'}
                </p>
              </div>

              <div className="text-center mb-10">
                <h2 className="section-title mb-4">
                  {isDe ? 'Weitere Standorte' : 'Other locations'}
                </h2>
              </div>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                {LOCATIONS.filter((l) => l.slug !== location.slug).map((loc) => (
                  <li key={loc.slug}>
                    <Link
                      href={localePath(lang, `/locations/${loc.slug}`)}
                      className="block border border-stone-200 px-4 py-3 text-sm font-medium text-stone-700 hover:border-accent hover:text-accent transition-colors"
                    >
                      {isDe ? loc.name : loc.nameEn}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="flex flex-wrap justify-center gap-4 pt-8 border-t border-stone-100">
            <Link href={localePath(lang, '/services')} className="btn-primary inline-flex items-center gap-2">
              {t.nav.services}
            </Link>
            <Link href={localePath(lang, '/contact')} className="btn-dark inline-flex items-center gap-2">
              {t.nav.contact}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
