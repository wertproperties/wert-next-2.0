'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { localePath } from '@/lib/routes';

export default function LoginPage() {
  const { login, user, loading: authLoading } = useAuth();
  const { lang } = useLang();
  const router = useRouter();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  // GuestRoute check
  useEffect(() => {
    if (!authLoading && user) {
      router.replace(localePath(lang, user.role === 'admin' ? '/admin' : '/portal'));
    }
  }, [authLoading, user, router, lang]);

  if (authLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const ch = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const data = await login(form.email, form.password);
      router.replace(localePath(lang, data.user.role === 'admin' ? '/admin' : '/portal'));
    } catch (err) {
      setError(err.response?.data?.message || (lang === 'de' ? 'Anmeldung fehlgeschlagen' : 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href={localePath(lang, '/')} className="inline-flex items-center gap-3 justify-center">
            <Image
              src="/images/logoo.png"
              alt="WERT Logo"
              width={160}
              height={64}
              className="h-16 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        <div className="bg-white shadow-xl border border-slate-100 p-8">
          <h1 className="font-serif text-2xl font-bold text-slate-900 mb-1">
            {lang === 'de' ? 'Anmelden' : 'Sign In'}
          </h1>
          <p className="text-slate-400 text-sm mb-7">
            {lang === 'de' ? 'Willkommen zurück im Kundenportal' : 'Welcome back to your customer portal'}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 mb-5 flex items-center gap-2">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label">{lang === 'de' ? 'E-Mail-Adresse' : 'Email Address'}</label>
              <input name="email" type="email" value={form.email} onChange={ch} required
                className="input-field" placeholder="you@example.com" autoComplete="email" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="form-label mb-0">{lang === 'de' ? 'Passwort' : 'Password'}</label>
                <Link href={localePath(lang, '/forgot-password')} className="text-xs text-sky-600 hover:underline">
                  {lang === 'de' ? 'Passwort vergessen?' : 'Forgot password?'}
                </Link>
              </div>
              <div className="relative">
                <input name="password" type={showPwd ? 'text' : 'password'} value={form.password} onChange={ch} required
                  className="input-field pr-12" placeholder="••••••••" autoComplete="current-password" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm">
                  {showPwd ? '🙈' : '👁'}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full btn-primary disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />{lang === 'de' ? 'Anmelden...' : 'Signing in...'}</>
              ) : (
                lang === 'de' ? 'Anmelden' : 'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            {lang === 'de' ? 'Noch kein Konto?' : "Don't have an account?"}{' '}
            <Link href={localePath(lang, '/signup')} className="text-sky-600 font-bold hover:underline">
              {lang === 'de' ? 'Registrieren' : 'Sign Up'}
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-5">
          <Link href={localePath(lang, '/')} className="hover:text-sky-300">← {lang === 'de' ? 'Zurück zur Website' : 'Back to Website'}</Link>
        </p>
      </div>
    </div>
  );
}
