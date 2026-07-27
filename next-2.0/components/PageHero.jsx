'use client';

import Link from 'next/link';
import { useLang } from '@/context/LangContext';
import { localePath } from '@/lib/routes';

export default function PageHero({ tag, title, desc, bgImage, breadcrumbs = [] }) {
  const { lang } = useLang();

  return (
    <section
      className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden"
      style={
        bgImage
          ? {
              backgroundImage: `url(${bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : { background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)' }
      }
    >
      {/* Overlay */}
      {bgImage && <div className="absolute inset-0 bg-slate-900/75" />}

      {/* Geometric accent */}
      <div
        className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none"
        style={{ background: 'repeating-linear-gradient(-45deg, #f59e0b 0px, #f59e0b 2px, transparent 2px, transparent 20px)' }}
      />
      <div
        className="absolute -bottom-1 left-0 right-0 h-16 bg-white"
        style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 60%, 0 0)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 text-white/50 text-xs mb-5 uppercase tracking-wider">
            <Link href={localePath(lang, '/')} className="hover:text-accent transition-colors">
              Home
            </Link>
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-2">
                <span>/</span>
                {b.href ? (
                  <Link href={localePath(lang, b.href)} className="hover:text-accent transition-colors">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-white/80">{b.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <span className="section-tag">{tag}</span>
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight max-w-3xl">{title}</h1>
        {desc && <p className="text-white/70 mt-4 text-base md:text-lg max-w-2xl leading-relaxed">{desc}</p>}
      </div>
    </section>
  );
}
