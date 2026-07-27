'use client';

import { useState } from 'react';
import { useLang } from '@/context/LangContext';
import PageHero from '@/components/PageHero';
import { formsAPI } from '@/lib/api';
function FormWrapper({ title, onSubmit, loading, status, success, error, children }) {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white p-8 md:p-12 shadow-sm border border-slate-100">
          <h2 className="font-serif text-2xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100">{title}</h2>
          {status === 'success' && <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-5 py-4 mb-6">{success}</div>}
          {status === 'error' && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-5 py-4 mb-6">{error}</div>}
          <form onSubmit={onSubmit} className="space-y-5">
            {children}
            <button type="submit" disabled={loading} className="btn-dark w-full disabled:opacity-60">
              {loading ? '...' : title}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}

export default function KeyOrderPage() {
  const { t } = useLang();
  const k = t.pages.forms.key;
  const n = t.nav;
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', unit: '', keyType: '', quantity: 1, reason: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const ch = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try { await formsAPI.submitKey(form); setStatus('success'); setForm({ name: '', email: '', phone: '', address: '', unit: '', keyType: '', quantity: 1, reason: '' }); }
    catch { setStatus('error'); }
    finally { setLoading(false); }
  };

  return (
    <main>
      <PageHero tag={k.tag} title={k.title} desc={k.heroDesc}
        bgImage="https://images.unsplash.com/photo-1558618047-3c8c76a7d99a?w=1400&q=80"
        breadcrumbs={[{ label: n.forms }, { label: n.keyOrder }]} />
      <FormWrapper title={k.title} onSubmit={onSubmit} loading={loading} status={status} success={k.success} error={k.error}>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label={k.nameFld}><input name="name" value={form.name} onChange={ch} required className="input-field" /></Field>
          <Field label={k.emailFld}><input type="email" name="email" value={form.email} onChange={ch} required className="input-field" /></Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label={k.phoneFld}><input type="tel" name="phone" value={form.phone} onChange={ch} className="input-field" /></Field>
          <Field label={k.unitFld}><input name="unit" value={form.unit} onChange={ch} className="input-field" /></Field>
        </div>
        <Field label={k.addressFld}><input name="address" value={form.address} onChange={ch} required className="input-field" /></Field>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label={k.keyTypeFld}>
            <select name="keyType" value={form.keyType} onChange={ch} required className="input-field bg-white">
              <option value="">-- Select --</option>
              {k.keyTypes.map(kt => <option key={kt} value={kt}>{kt}</option>)}
            </select>
          </Field>
          <Field label={k.quantityFld}><input type="number" name="quantity" value={form.quantity} onChange={ch} min={1} max={10} required className="input-field" /></Field>
        </div>
        <Field label={k.reasonFld}><textarea name="reason" value={form.reason} onChange={ch} rows={3} className="input-field resize-none" /></Field>
      </FormWrapper>
    </main>
  );
}
