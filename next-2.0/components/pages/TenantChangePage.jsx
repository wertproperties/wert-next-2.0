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

export default function TenantChangePage() {
  const { t } = useLang();
  const tc = t.pages.forms.tenant;
  const n = t.nav;
  const [form, setForm] = useState({
    property: '', unit: '', ownerName: '', ownerEmail: '', notes: '',
    outgoingTenant: { name: '', email: '', moveOutDate: '' },
    incomingTenant: { name: '', email: '', moveInDate: '' },
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const ch = e => setForm({ ...form, [e.target.name]: e.target.value });
  const chNested = (section, field) => e => setForm({ ...form, [section]: { ...form[section], [field]: e.target.value } });

  const onSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try { await formsAPI.submitTenantChange(form); setStatus('success'); }
    catch { setStatus('error'); }
    finally { setLoading(false); }
  };

  return (
    <main>
      <PageHero tag={tc.tag} title={tc.title} desc={tc.heroDesc}
        bgImage="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&q=80"
        breadcrumbs={[{ label: n.forms }, { label: n.tenantChange }]} />
      <FormWrapper title={tc.title} onSubmit={onSubmit} loading={loading} status={status} success={tc.success} error={tc.error}>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label={tc.propertyFld}><input name="property" value={form.property} onChange={ch} required className="input-field" /></Field>
          <Field label={tc.unitFld}><input name="unit" value={form.unit} onChange={ch} required className="input-field" /></Field>
        </div>

        <div className="border border-slate-100 rounded p-5 bg-slate-50">
          <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider mb-4">{tc.outgoingTitle}</h4>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label={tc.tenantName}><input value={form.outgoingTenant.name} onChange={chNested('outgoingTenant', 'name')} className="input-field" /></Field>
            <Field label={tc.tenantEmail}><input type="email" value={form.outgoingTenant.email} onChange={chNested('outgoingTenant', 'email')} className="input-field" /></Field>
            <Field label={tc.moveOutDate}><input type="date" value={form.outgoingTenant.moveOutDate} onChange={chNested('outgoingTenant', 'moveOutDate')} className="input-field" /></Field>
          </div>
        </div>

        <div className="border border-slate-100 rounded p-5 bg-slate-50">
          <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider mb-4">{tc.incomingTitle}</h4>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label={tc.tenantName}><input value={form.incomingTenant.name} onChange={chNested('incomingTenant', 'name')} className="input-field" /></Field>
            <Field label={tc.tenantEmail}><input type="email" value={form.incomingTenant.email} onChange={chNested('incomingTenant', 'email')} className="input-field" /></Field>
            <Field label={tc.moveInDate}><input type="date" value={form.incomingTenant.moveInDate} onChange={chNested('incomingTenant', 'moveInDate')} className="input-field" /></Field>
          </div>
        </div>

        <div className="border border-slate-100 rounded p-5 bg-slate-50">
          <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider mb-4">{tc.ownerTitle}</h4>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={tc.ownerName}><input name="ownerName" value={form.ownerName} onChange={ch} required className="input-field" /></Field>
            <Field label={tc.ownerEmail}><input type="email" name="ownerEmail" value={form.ownerEmail} onChange={ch} required className="input-field" /></Field>
          </div>
        </div>

        <Field label={tc.notesFld}><textarea name="notes" value={form.notes} onChange={ch} rows={3} className="input-field resize-none" /></Field>
      </FormWrapper>
    </main>
  );
}
