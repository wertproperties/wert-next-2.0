import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import logoo from '../assets/logoo.png';

export default function LoginPage() {
  const { login } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/portal';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const ch = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const data = await login(form.email, form.password);
      navigate(data.user.role === 'admin' ? '/admin' : from, { replace: true });
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
          <Link to="/" className="inline-flex items-center gap-3 justify-center">
            <img
                src={logoo}
                alt="WERT Logo"
              className="h-16 w-auto object-contain"
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
                <Link to="/forgot-password" className="text-xs text-sky-600 hover:underline">
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
            <Link to="/signup" className="text-sky-600 font-bold hover:underline">
              {lang === 'de' ? 'Registrieren' : 'Sign Up'}
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-5">
          <Link to="/" className="hover:text-sky-300">← {lang === 'de' ? 'Zurück zur Website' : 'Back to Website'}</Link>
        </p>
      </div>
    </div>
  );
}
