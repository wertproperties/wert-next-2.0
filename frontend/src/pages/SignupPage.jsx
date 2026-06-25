import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import logoo from '../assets/logoo.png';

export default function SignupPage() {
  const { register } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', pinCode: '',
    password: '', confirmPassword: '', role: 'owner',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const ch = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      return setError(lang === 'de' ? 'Passwörter stimmen nicht überein' : 'Passwords do not match');
    }
    setLoading(true);
    try {
      const { confirmPassword, ...data } = form;
      await register(data);
      navigate('/portal', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || (lang === 'de' ? 'Registrierung fehlgeschlagen' : 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  const t = {
    title: lang === 'de' ? 'Konto erstellen' : 'Create Account',
    subtitle: lang === 'de' ? 'Registrieren Sie sich für das Kundenportal' : 'Register for the customer portal',
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
    haveAccount: lang === 'de' ? 'Haben Sie bereits ein Konto?' : 'Already have an account?',
    signIn: lang === 'de' ? 'Anmelden' : 'Sign In',
    back: lang === 'de' ? 'Zurück zur Website' : 'Back to Website',
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="w-full max-w-xl mx-auto">

        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 justify-center">
            <img
              src={logoo}
              alt="WERT Logo"
              className="h-16 w-auto object-contain"
            />
            <div className="text-left">
              <p className="font-black text-slate-900 text-base tracking-tight">WERT</p>
              <p className="text-yellow-700 text-[10px] tracking-widest uppercase">Immobilieverwaltung</p>
            </div>
          </Link>
        </div>

        <div className="bg-white shadow-lg border border-slate-100 px-6 py-6">
          <h1 className="font-serif text-xl font-bold text-slate-900 mb-0.5">{t.title}</h1>
          <p className="text-slate-400 text-xs mb-5">{t.subtitle}</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 mb-4 flex items-center gap-2">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">

            {/* Role */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{t.role}</label>
              <div className="grid grid-cols-2 gap-2">
                {[['owner', t.ownerOpt], ['tenant', t.tenantOpt]].map(([val, label]) => (
                  <button key={val} type="button" onClick={() => setForm({ ...form, role: val })}
                    className={`py-2 px-3 border-2 text-xs font-bold transition-all ${form.role === val ? 'border-accent bg-accent/10 text-slate-900' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{t.firstName}</label>
                <input name="firstName" value={form.firstName} onChange={ch} required
                  className="w-full border border-slate-200 px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:border-accent transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{t.lastName}</label>
                <input name="lastName" value={form.lastName} onChange={ch} required
                  className="w-full border border-slate-200 px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:border-accent transition-colors" />
              </div>
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{t.email}</label>
                <input name="email" type="email" value={form.email} onChange={ch} required autoComplete="email"
                  className="w-full border border-slate-200 px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:border-accent transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{t.phone}</label>
                <input name="phone" type="tel" value={form.phone} onChange={ch}
                  className="w-full border border-slate-200 px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:border-accent transition-colors" />
              </div>
            </div>

            {/* Address + City */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{t.address}</label>
                <input name="address" value={form.address} onChange={ch}
                  className="w-full border border-slate-200 px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:border-accent transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{t.city}</label>
                <input name="city" value={form.city} onChange={ch}
                  className="w-full border border-slate-200 px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:border-accent transition-colors" />
              </div>
            </div>

            {/* State + Pin Code */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{t.state}</label>
                <input name="state" value={form.state} onChange={ch}
                  className="w-full border border-slate-200 px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:border-accent transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{t.pinCode}</label>
                <input name="pinCode" value={form.pinCode} onChange={ch}
                  className="w-full border border-slate-200 px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:border-accent transition-colors" />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{t.password}</label>
                <div className="relative">
                  <input name="password" type={showPwd ? 'text' : 'password'} value={form.password} onChange={ch}
                    required minLength={6} autoComplete="new-password"
                    className="w-full border border-slate-200 px-3 py-1.5 pr-8 text-sm text-slate-800 focus:outline-none focus:border-accent transition-colors" />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">{showPwd ? '🙈' : '👁'}</button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{t.confirmPwd}</label>
                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={ch} required
                  className="w-full border border-slate-200 px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:border-accent transition-colors" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-sky-200 hover:bg-sky-300 text-slate-900 font-bold text-xs py-2.5 uppercase tracking-wider transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-1">
              {loading ? (
                <><span className="w-3.5 h-3.5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />{t.submitting}</>
              ) : t.submit}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-4">
            {t.haveAccount}{' '}
            <Link to="/login" className="text-sky-500 font-bold hover:underline">{t.signIn}</Link>
          </p>
        </div>

        <p className="text-center text-[10px] text-slate-400 mt-4">
          <Link to="/" className="hover:text-sky-500">← {t.back}</Link>
        </p>
      </div>
    </div>
  );
}