'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { localePath } from '@/lib/routes';

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// ─── Login tab ─────────────────────────────────────────────────────
function LoginForm({ onSuccess }) {
  const { login } = useAuth();
  const { lang } = useLang();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const ch = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      onSuccess(data.user.role);
    } catch (err) {
      setError(err.response?.data?.message || (lang === 'de' ? 'Anmeldung fehlgeschlagen' : 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 flex items-center gap-2">
          <span>⚠</span> {error}
        </div>
      )}
      <div>
        <label className="form-label">{lang === 'de' ? 'E-Mail-Adresse' : 'Email Address'}</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={ch}
          required
          className="input-field"
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>
      <div>
        <label className="form-label">{lang === 'de' ? 'Passwort' : 'Password'}</label>
        <div className="relative">
          <input
            name="password"
            type={showPwd ? 'text' : 'password'}
            value={form.password}
            onChange={ch}
            required
            className="input-field pr-12"
            placeholder="••••••••"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPwd(!showPwd)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm"
          >
            {showPwd ? '🙈' : '👁'}
          </button>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
            {lang === 'de' ? 'Anmelden...' : 'Signing in...'}
          </>
        ) : (
          lang === 'de' ? 'Anmelden' : 'Sign In'
        )}
      </button>
    </form>
  );
}

// ─── Signup tab ────────────────────────────────────────────────────
function SignupForm({ onSuccess }) {
  const { register } = useAuth();
  const { lang } = useLang();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    password: '',
    confirmPassword: '',
    role: 'owner',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const ch = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      return setError(lang === 'de' ? 'Passwörter stimmen nicht überein' : 'Passwords do not match');
    }
    setLoading(true);
    try {
      const { confirmPassword, ...data } = form;
      const res = await register(data);
      onSuccess(res.user.role);
    } catch (err) {
      setError(err.response?.data?.message || (lang === 'de' ? 'Registrierung fehlgeschlagen' : 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  const t = {
    firstName: lang === 'de' ? 'Vorname' : 'First Name',
    lastName: lang === 'de' ? 'Nachname' : 'Last Name',
    email: lang === 'de' ? 'E-Mail' : 'Email',
    phone: lang === 'de' ? 'Telefon' : 'Phone',
    address: lang === 'de' ? 'Adresse / Hausnr.' : 'Address / House No.',
    city: lang === 'de' ? 'Stadt' : 'City',
    state: lang === 'de' ? 'Bundesland' : 'State',
    pinCode: lang === 'de' ? 'Postleitzahl' : 'Pin Code',
    password: lang === 'de' ? 'Passwort' : 'Password',
    confirmPwd: lang === 'de' ? 'Passwort bestätigen' : 'Confirm Password',
    role: lang === 'de' ? 'Ich bin' : 'I am',
    ownerOpt: lang === 'de' ? 'Eigentümer' : 'Property Owner',
    tenantOpt: lang === 'de' ? 'Mieter' : 'Tenant',
    submit: lang === 'de' ? 'Registrieren' : 'Create Account',
    submitting: lang === 'de' ? 'Wird erstellt...' : 'Creating...',
  };

  const fieldCls =
    'w-full border border-slate-200 px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:border-accent transition-colors';
  const labelCls = 'block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 flex items-center gap-2">
          <span>⚠</span> {error}
        </div>
      )}

      <div>
        <label className={labelCls}>{t.role}</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            ['owner', t.ownerOpt],
            ['tenant', t.tenantOpt],
          ].map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setForm({ ...form, role: val })}
              className={`py-2 px-3 border-2 text-xs font-bold transition-all ${
                form.role === val
                  ? 'border-accent bg-accent/10 text-slate-900'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>{t.firstName}</label>
          <input name="firstName" value={form.firstName} onChange={ch} required className={fieldCls} />
        </div>
        <div>
          <label className={labelCls}>{t.lastName}</label>
          <input name="lastName" value={form.lastName} onChange={ch} required className={fieldCls} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>{t.email}</label>
          <input name="email" type="email" value={form.email} onChange={ch} required autoComplete="email" className={fieldCls} />
        </div>
        <div>
          <label className={labelCls}>{t.phone}</label>
          <input name="phone" type="tel" value={form.phone} onChange={ch} className={fieldCls} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>{t.address}</label>
          <input name="address" value={form.address} onChange={ch} className={fieldCls} />
        </div>
        <div>
          <label className={labelCls}>{t.city}</label>
          <input name="city" value={form.city} onChange={ch} className={fieldCls} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>{t.state}</label>
          <input name="state" value={form.state} onChange={ch} className={fieldCls} />
        </div>
        <div>
          <label className={labelCls}>{t.pinCode}</label>
          <input name="pinCode" value={form.pinCode} onChange={ch} className={fieldCls} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>{t.password}</label>
          <div className="relative">
            <input
              name="password"
              type={showPwd ? 'text' : 'password'}
              value={form.password}
              onChange={ch}
              required
              minLength={6}
              autoComplete="new-password"
              className={`${fieldCls} pr-8`}
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
            >
              {showPwd ? '🙈' : '👁'}
            </button>
          </div>
        </div>
        <div>
          <label className={labelCls}>{t.confirmPwd}</label>
          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={ch}
            required
            className={fieldCls}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-sky-200 hover:bg-sky-300 text-slate-900 font-bold text-xs py-2.5 uppercase tracking-wider transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
      >
        {loading ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
            {t.submitting}
          </>
        ) : (
          t.submit
        )}
      </button>
    </form>
  );
}

// ─── Main Modal ────────────────────────────────────────────────────
export default function AuthModal({ initialTab = 'login', onClose }) {
  const { lang } = useLang();
  const router = useRouter();
  const [tab, setTab] = useState(initialTab); // 'login' | 'signup'

  const handleSuccess = (role) => {
    onClose();
    const targetPath = role === 'admin' ? '/admin' : '/portal';
    router.replace(localePath(lang, targetPath));
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto animate-fadeIn">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10">
          <CloseIcon />
        </button>

        <div className="px-8 pt-6 pb-2 text-center">
          <Image
            src="/images/logoo.png"
            alt="WERT Logo"
            width={160}
            height={56}
            className="h-14 w-auto object-contain mx-auto mb-3"
            priority
          />
          <h1 className="font-serif text-2xl font-bold text-slate-900 mb-1">
            {tab === 'login'
              ? lang === 'de'
                ? 'Anmelden'
                : 'Sign In'
              : lang === 'de'
              ? 'Konto erstellen'
              : 'Create Account'}
          </h1>
          <p className="text-slate-400 text-sm mb-4">
            {lang === 'de' ? 'Willkommen im Kundenportal' : 'Welcome to the customer portal'}
          </p>
        </div>

        {/* Tabs */}
        <div className="px-8">
          <div className="flex border-b border-slate-200 mb-5">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 pb-3 text-sm font-bold uppercase tracking-wider transition-colors ${
                tab === 'login' ? 'text-accent border-b-2 border-accent' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {lang === 'de' ? 'Anmelden' : 'Sign In'}
            </button>
            <button
              onClick={() => setTab('signup')}
              className={`flex-1 pb-3 text-sm font-bold uppercase tracking-wider transition-colors ${
                tab === 'signup' ? 'text-accent border-b-2 border-accent' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {lang === 'de' ? 'Registrieren' : 'Sign Up'}
            </button>
          </div>
        </div>

        <div className="px-8 pb-8">
          {tab === 'login' ? <LoginForm onSuccess={handleSuccess} /> : <SignupForm onSuccess={handleSuccess} />}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out both;
        }
      `}</style>
    </div>
  );
}
