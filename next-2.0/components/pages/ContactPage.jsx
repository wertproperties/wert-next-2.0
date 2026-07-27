'use client';

import { useState } from 'react';
import { useLang } from '@/context/LangContext';
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF } from '@/lib/site';
import PageHero from '@/components/PageHero';
import { contactAPI } from '@/lib/api';
export default function ContactPage() {
  const { t } = useLang();
  const c = t.contactCTA;
  const cp = t.pages.contact;

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
    <main>
      <PageHero tag={cp.tag} title={cp.title} desc={cp.heroDesc}
        bgImage="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80"
        breadcrumbs={[{ label: t.nav.contact }]} />

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Info */}
            <div className="space-y-8">
              {[
                { icon: '✆', label: c.phone, content: <a href={CONTACT_PHONE_HREF} className="font-bold text-slate-900 hover:text-accent transition-colors">{CONTACT_PHONE}</a> },
                { icon: '✉', label: c.email, content: <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold text-slate-900 hover:text-accent transition-colors text-sm">{CONTACT_EMAIL}</a> },
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
                  {t.lang === 'de' ? 'Öffnungszeiten' : 'Office Hours'}
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
    </main>
  );
}
