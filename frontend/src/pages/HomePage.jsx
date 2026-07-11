import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import { propertiesAPI, contactAPI } from '../utils/api';

/* ---- Icons ---- */
const CheckIcon = () => (
  <svg className="w-5 h-5 text-accent  shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
  </svg>
);
const ChevronRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
  </svg>
);
const ArrowRight = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
  </svg>
);


/* ---- Hero Slider ---- */
function HeroSlider() {
  const { t } = useLang();
  const h = t.hero;
  const [idx, setIdx] = useState(0);
  const slides = [
    { bg: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80' },
    { bg: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80' },
  ];
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {slides.map((s, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-1500 ${i === idx ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${s.bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

      <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center pb-20">
        <span className="inline-block bg-accent text-stone-900 text-xs font-bold tracking-[0.3em] uppercase px-4 py-1.5 mb-6 w-fit animate-fade-up">
          {h.badge}
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-5xl font-bold text-white leading-tight mb-4 max-w-3xl animate-fade-up" style={{ animationDelay: '0.1s' }}>
          {h.title}
        </h1>
        <h2 className="text-xl sm:text-2xl text-accent font-light tracking-wide mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          {h.subtitle}
        </h2>
        <ul className="max-w-xl mb-10 animate-fade-up space-y-2" style={{ animationDelay: '0.2s' }}>
          {h.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-white/75 text-base sm:text-lg leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        {/* <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <Link to="/contact" className="btn-primary flex items-center gap-2">{h.ctaContact} <ArrowRight /></Link>
          <Link to="/services" className="btn-outline flex items-center gap-2">{h.ctaServices}</Link>
        </div> */}
      </div>

      {/* Dots */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`transition-all duration-300 rounded-full ${i === idx ? 'w-8 h-2 bg-accent' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`} />
        ))}
      </div>

      {/* Stats bar */}
      {/* <div className="absolute bottom-0 left-0 right-0 bg-stone-900/90 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {[
              { v: '55+', l: t.stats.years },
              { v: '3', l: t.stats.gen },
              { v: '200+', l: t.stats.objects },
              { v: '100%', l: t.stats.satisfaction },
            ].map(s => (
              <div key={s.l} className="text-center py-4 px-2">
                <p className="text-accent text-2xl md:text-3xl font-black">{s.v}</p>
                <p className="text-white/50 text-xs mt-0.5 tracking-wide">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </section>
  );
}

/* ---- About Section ---- */
// function AboutSection() {
//   const { t } = useLang();
//   const a = t.about;
//   return (
//     <section className="py-24 bg-white">
//       <div className="max-w-7xl mx-auto px-6">
//         <div className="grid lg:grid-cols-2 gap-16 items-center">
//           <div>
//             <span className="section-tag">{a.tag}</span>
//             <h2 className="section-title mb-6">{a.title}</h2>
//             <p className="text-stone-600 leading-relaxed mb-4">{a.p1}</p>
//             <p className="text-stone-600 leading-relaxed mb-8">{a.p2}</p>
//             <ul className="space-y-3 mb-10">
//               {a.points.map(p => (
//                 <li key={p} className="flex items-center gap-3 text-stone-700 font-medium"><CheckIcon />{p}</li>
//               ))}
//             </ul>
//             <div className="flex flex-wrap gap-4">
//               <Link to="/company/history" className="btn-dark flex items-center gap-2">{a.ctaHistory} <ChevronRight /></Link>
//               <Link to="/company/team" className="inline-flex items-center gap-2 text-stone-700 font-bold text-sm hover:text-accent transition-colors uppercase tracking-widest">
//                 {a.ctaTeam} <ChevronRight />
//               </Link>
//             </div>
//           </div>
//           <div className="relative">
//             <div className="relative overflow-hidden shadow-2xl">
//               <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80" alt="Meeting" className="w-full h-[480px] object-cover" />
//               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
//             </div>
//             <div className="absolute -bottom-6 -left-6 bg-accent p-6 shadow-xl z-10">
//               <p className="text-4xl font-black text-stone-900 leading-none">55+</p>
//               <p className="text-stone-900/70 text-xs font-bold uppercase tracking-wider mt-1">{t.stats.years}</p>
//             </div>
//             <div className="absolute -top-4 -right-4 w-28 h-28 border-4 border-stone-100 -z-10" />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

/* ---- Services Section ---- */
const serviceIcons = [
  // Residential
  // <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>,
  // Business Admin
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>,
  // Technical
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  // Tenant Support
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  // Commercial (Gewerbeverwaltung)
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>,
  // Mixed-Use (Mischverwaltung)
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3"/></svg>,
];

function ServicesSection() {
  const { t } = useLang();
  const s = t.services;
  return (
    <section className="py-24 bg-sky-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="section-tag">{s.tag}</span>
          <h2 className="section-title mb-4">{s.title}</h2>
          <p className="text-stone-500 max-w-2xl mx-auto">{s.subtitle}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {s.items.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-7 border border-sky-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-sky-100 border border-sky-400 rounded-xl flex items-center justify-center mb-5 text-sky-700 group-hover:bg-sky-800 group-hover:text-white transition-all duration-300">
                {serviceIcons[i]}
              </div>
              <h3 className="text-stone-900 font-bold text-lg mb-3 leading-tight group-hover:text-sky-800 transition-colors">{item.title}</h3>
              {item.desc && <p className="text-stone-500 text-sm leading-relaxed mb-4">{item.desc}</p>}
              {item.bullets && item.bullets.length > 0 && (
                <ul className="space-y-2 mb-4">
                  {item.bullets.map((b, bi) => (
                    <li key={bi} className="flex items-start gap-2 text-stone-600 text-sm">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0"/>
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              <Link to="/services" className="inline-flex items-center gap-1 text-sky-600 font-bold text-xs uppercase tracking-wider hover:gap-2 transition-all mt-2">
                {s.learnMore} <ChevronRight />
              </Link>
            </div>
          ))}
        </div>
        {/* <div className="text-center mt-12">
          <Link to="/services" className="btn-dark inline-flex items-center gap-2">{s.ctaAll} <ArrowRight /></Link>
        </div> */}
      </div>
    </section>
  );
}

/* ---- Contact Section (embedded on Home Page) ---- */
function ContactSection() {
  const { t, lang } = useLang();
  const c = t.contactCTA;

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try { await contactAPI.submit(form); setStatus('success'); setForm({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' }); }
    catch { setStatus('error'); }
    finally { setLoading(false); }
  };

  return (
    <section id="contact-form" className="py-24 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="section-tag">{c.tag}</span>
          <h2 className="section-title mb-4">{c.title}</h2>
          <p className="text-stone-500 max-w-2xl mx-auto">{c.desc}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Info */}
          <div className="space-y-8">
            {[
              { icon: '✆', label: c.phone, content: <a href="tel:0911891160" className="font-bold text-slate-900 hover:text-accent transition-colors">+4915124261124</a> },
              { icon: '✉', label: c.email, content: <a href="mailto:wertimmoverwaltung@outlook.com" className="font-bold text-slate-900 hover:text-accent transition-colors text-sm">wertimmoverwaltung@outlook.com</a> },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-4 p-6 border border-slate-100 hover:border-accent transition-colors">
                <div className="w-12 h-12 bg-accent/10 text-accent flex items-center justify-center text-2xl shrink-0">{item.icon}</div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{item.label}</p>
                  {item.content}
                </div>
              </div>
            ))}

            {/* Hours */}
            <div className="p-6 border border-slate-100 bg-slate-50">
              <h4 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-xs">
                {lang === 'de' ? 'Öffnungszeiten' : 'Office Hours'}
              </h4>
              <div className="space-y-1 text-sm text-slate-600">
                <p className="flex justify-between"><span>Mo – Fr</span><span className="font-medium">8:00 – 17:00</span></p>
                <p className="flex justify-between"><span>Sa</span><span className="font-medium text-slate-400">Closed</span></p>
                <p className="flex justify-between"><span>Su</span><span className="font-medium text-slate-400">Closed</span></p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <h3 className="font-serif text-2xl font-bold text-slate-900 mb-8">{c.formTitle}</h3>
            {status === 'success' && <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-5 py-4 mb-6">{c.success}</div>}
            {status === 'error' && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-5 py-4 mb-6">{c.error}</div>}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="form-label">{c.firstName}</label>
                  <input name="firstName" value={form.firstName} onChange={handleChange} required className="input-field" />
                </div>
                <div>
                  <label className="form-label">{c.lastName}</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange} required className="input-field" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="form-label">{c.email}</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required className="input-field" />
                </div>
                <div>
                  <label className="form-label">{c.phoneFld}</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="input-field" />
                </div>
              </div>
              <div>
                <label className="form-label">{c.subject}</label>
                <input name="subject" value={form.subject} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="form-label">{c.message}</label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows={6} className="input-field resize-none" />
              </div>
              <button type="submit" disabled={loading} className="btn-dark disabled:opacity-60 w-full sm:w-auto px-12">
                {loading ? c.sending : c.send}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- Home Page ---- */
export default function HomePage() {
  const location = useLocation();

  // Scroll to the embedded contact form when navigated here with that intent
  // (e.g. clicking "Contact" in the Navbar from another page, or a #contact-form link).
  useEffect(() => {
    const shouldScroll = location.state?.scrollToContact || location.hash === '#contact-form';
    if (shouldScroll) {
      setTimeout(() => {
        document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location]);

  return (
    <main>
      <HeroSlider />
      {/* <AboutSection /> */}
      <ServicesSection />
      {/* <ObjectsSection /> */}
      <ContactSection />
      {/* <BVITeaser /> */}
    </main>
  );
}
