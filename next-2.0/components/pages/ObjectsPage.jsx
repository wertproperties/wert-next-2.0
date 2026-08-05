'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLang } from '@/context/LangContext';
import PageHero from '@/components/PageHero';
import { propertiesAPI } from '@/lib/api';
import { localePath } from '@/lib/routes';
const fallbackProperties = [];

export default function ObjectsPage() {
  const { t, lang } = useLang();
  const op = t.pages.objects;
  const f = op.filter;
  const ot = t.objects;
  const [properties, setProperties] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    propertiesAPI.getAll()
      .then(r => setProperties(r.data.data || []))
      .catch(() => setProperties(fallbackProperties))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? properties : properties.filter(p => p.type === filter);
  const filterButtons = [
    { key: 'all', label: f.all },
    { key: 'apartment_complex', label: f.apartment_complex },
    { key: 'apartment_building', label: f.apartment_building },
    { key: 'commercial', label: f.commercial },
    { key: 'mixed', label: f.mixed },
  ];

  return (
    <main>
      <PageHero
        tag={op.tag}
        title={op.title}
        desc={op.heroDesc}
        bgImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&q=80"
        breadcrumbs={[{ label: t.nav.objects }]}
      />

      {/* Filter */}
      <section className="py-10 bg-white border-b border-slate-100 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-3">
            {filterButtons.map(b => (
              <button
                key={b.key}
                onClick={() => setFilter(b.key)}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  filter === b.key ? 'bg-accent text-slate-900' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {b.label}
              </button>
            ))}
            <span className="ml-auto text-slate-400 text-sm self-center">{filtered.length} {ot.units}</span>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 bg-slate-50 min-h-[400px]">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white shadow-sm overflow-hidden animate-pulse">
                  <div className="h-56 bg-slate-200" />
                  <div className="p-5 space-y-3"><div className="h-4 bg-slate-200 rounded w-3/4" /><div className="h-3 bg-slate-200 rounded w-1/2" /></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map(p => (
                <Link
                  key={p._id}
                  href={localePath(lang, `/objects/${p._id}`)}
                  className="bg-white shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden"
                >
                  <div className="relative overflow-hidden h-56">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={`${p.title}${p.city ? ` – ${p.city}` : ''} | Hausverwaltung WERT`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <span className="bg-accent text-slate-900 text-xs font-bold px-2 py-1">{p.units} {ot.units}</span>
                    </div>
                    <span className="absolute bottom-3 left-3 text-white/80 text-xs bg-slate-900/60 px-2 py-1">
                      {filterButtons.find(b => b.key === p.type)?.label || p.type}
                    </span>
                  </div>
                  <div className="p-6 border-t-2 border-transparent group-hover:border-accent transition-colors">
                    <h3 className="font-bold text-slate-900 text-lg mb-1">{p.title}</h3>
                    <p className="text-slate-400 text-sm mb-3">{p.address}, {p.city}</p>
                    <p className="text-slate-600 text-sm leading-relaxed">{p.description}</p>
                    <span className="inline-block mt-3 text-amber-600 text-xs font-bold uppercase tracking-wider group-hover:text-amber-700">
                      {ot.viewDetails} →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
