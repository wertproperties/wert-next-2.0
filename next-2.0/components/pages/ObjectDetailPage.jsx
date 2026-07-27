'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLang } from '@/context/LangContext';
import PageHero from '@/components/PageHero';
import { propertiesAPI } from '@/lib/api';
import { localePath } from '@/lib/routes';

export default function ObjectDetailPage() {
  const { lang, t } = useParams();
  const { t: translations } = useLang();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = useParams();
  const id = params.id;

  useEffect(() => {
    if (!id) return;
    propertiesAPI.getById(id)
      .then(r => setProperty(r.data.data || r.data))
      .catch(() => setError('Property not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const ot = translations.objects;
  const op = translations.pages.objects;

  if (loading) {
    return (
      <main>
        <PageHero
          tag={op.tag}
          title="..."
          breadcrumbs={[{ label: ot.viewDetails }]}
        />
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="animate-pulse space-y-6">
              <div className="h-64 bg-slate-200 rounded" />
              <div className="h-6 bg-slate-200 rounded w-1/2" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-200 rounded w-2/3" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error || !property) {
    return (
      <main>
        <PageHero
          tag={op.tag}
          title="404"
          breadcrumbs={[{ label: ot.viewDetails }]}
        />
        <section className="py-16 bg-white text-center">
          <p className="text-slate-500 mb-4">{lang === 'de' ? 'Objekt nicht gefunden' : 'Property not found'}</p>
          <Link href={localePath(lang, '/objects')} className="btn-primary inline-block">
            {ot.allObjects}
          </Link>
        </section>
      </main>
    );
  }

  const typeLabels = {
    all: op.filter?.all || 'All',
    apartment_complex: op.filter?.apartment_complex || 'Apartment Complex',
    apartment_building: op.filter?.apartment_building || 'Apartment Building',
    commercial: op.filter?.commercial || 'Commercial',
    mixed: op.filter?.mixed || 'Mixed Use',
  };

  return (
    <main>
      <PageHero
        tag={op.tag}
        title={property.title}
        desc={`${property.address}, ${property.city}`}
        bgImage={property.image}
        breadcrumbs={[
          { label: ot.allObjects, href: '/objects' },
          { label: property.title },
        ]}
      />

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          {/* Back link */}
          <Link
            href={localePath(lang, '/objects')}
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium text-sm mb-8 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {ot.allObjects}
          </Link>

          {/* Main image */}
          <div className="relative overflow-hidden rounded-lg mb-10 shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-[400px] md:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
            <div className="absolute top-4 right-4 flex gap-2">
              <span className="bg-accent text-slate-900 text-xs font-bold px-3 py-1.5">
                {property.units} {ot.units}
              </span>
              <span className="bg-white/90 text-slate-800 text-xs font-bold px-3 py-1.5">
                {typeLabels[property.type] || property.type}
              </span>
            </div>
          </div>

          {/* Property details */}
          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-6">
              <h2 className="section-title">{property.title}</h2>
              <p className="text-slate-500 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {property.address}, {property.city}
              </p>
              {property.description && (
                <p className="text-slate-700 leading-relaxed text-base">{property.description}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">
                  {lang === 'de' ? 'Objektdetails' : 'Property Details'}
                </h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">{lang === 'de' ? 'Typ' : 'Type'}</dt>
                    <dd className="font-medium text-slate-800">{typeLabels[property.type] || property.type}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">{ot.units}</dt>
                    <dd className="font-medium text-slate-800">{property.units}</dd>
                  </div>
                  {property.address && (
                    <div className="flex justify-between">
                      <dt className="text-slate-500">{lang === 'de' ? 'Adresse' : 'Address'}</dt>
                      <dd className="font-medium text-slate-800 text-right">{property.address}</dd>
                    </div>
                  )}
                  {property.city && (
                    <div className="flex justify-between">
                      <dt className="text-slate-500">{lang === 'de' ? 'Stadt' : 'City'}</dt>
                      <dd className="font-medium text-slate-800">{property.city}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <Link
                href={localePath(lang, '/contact')}
                className="btn-primary w-full text-center block"
              >
                {translations.contactCTA.title}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
