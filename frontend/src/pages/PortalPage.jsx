import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';

function PortalCard({ icon, title, desc, to }) {
  return (
    <Link to={to} className="bg-white p-6 border border-slate-100 hover:border-accent hover:shadow-xl transition-all duration-300 group block">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-accent transition-colors">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </Link>
  );
}

function ProfileTab({ user, updateProfile, changePassword, lang }) {
  const [prof, setProf] = useState({ firstName: user.firstName, lastName: user.lastName, phone: user.phone || '', address: user.address || '', unit: user.unit || '' });
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirmNew: '' });
  const [profStatus, setProfStatus] = useState(null);
  const [pwdStatus, setPwdStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleProfile = async e => {
    e.preventDefault(); setSaving(true); setProfStatus(null);
    try { await updateProfile(prof); setProfStatus('success'); }
    catch { setProfStatus('error'); }
    finally { setSaving(false); }
  };

  const handlePwd = async e => {
    e.preventDefault(); setPwdStatus(null);
    if (pwd.newPassword !== pwd.confirmNew) return setPwdStatus('mismatch');
    setSaving(true);
    try { await changePassword({ currentPassword: pwd.currentPassword, newPassword: pwd.newPassword }); setPwdStatus('success'); setPwd({ currentPassword: '', newPassword: '', confirmNew: '' }); }
    catch { setPwdStatus('error'); }
    finally { setSaving(false); }
  };

  const l = lang === 'de';
  return (
    <div className="space-y-8">
      {/* Profile */}
      <div className="bg-white p-6 border border-slate-100">
        <h3 className="font-bold text-slate-900 text-lg mb-5">{l ? 'Profil bearbeiten' : 'Edit Profile'}</h3>
        {profStatus === 'success' && <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-2 mb-4">{l ? 'Gespeichert!' : 'Saved!'}</div>}
        {profStatus === 'error' && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 mb-4">{l ? 'Fehler beim Speichern' : 'Error saving'}</div>}
        <form onSubmit={handleProfile} className="grid sm:grid-cols-2 gap-4">
          <div><label className="form-label">{l ? 'Vorname' : 'First Name'}</label><input value={prof.firstName} onChange={e => setProf({...prof, firstName: e.target.value})} className="input-field" /></div>
          <div><label className="form-label">{l ? 'Nachname' : 'Last Name'}</label><input value={prof.lastName} onChange={e => setProf({...prof, lastName: e.target.value})} className="input-field" /></div>
          <div><label className="form-label">{l ? 'Telefon' : 'Phone'}</label><input value={prof.phone} onChange={e => setProf({...prof, phone: e.target.value})} className="input-field" /></div>
          <div><label className="form-label">{l ? 'Einheit' : 'Unit'}</label><input value={prof.unit} onChange={e => setProf({...prof, unit: e.target.value})} className="input-field" /></div>
          <div className="sm:col-span-2"><label className="form-label">{l ? 'Adresse' : 'Address'}</label><input value={prof.address} onChange={e => setProf({...prof, address: e.target.value})} className="input-field" /></div>
          <div className="sm:col-span-2"><button type="submit" disabled={saving} className="btn-dark">{saving ? '...' : (l ? 'Speichern' : 'Save Changes')}</button></div>
        </form>
      </div>

      {/* Password */}
      <div className="bg-white p-6 border border-slate-100">
        <h3 className="font-bold text-slate-900 text-lg mb-5">{l ? 'Passwort ändern' : 'Change Password'}</h3>
        {pwdStatus === 'success' && <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-2 mb-4">{l ? 'Passwort geändert!' : 'Password changed!'}</div>}
        {pwdStatus === 'mismatch' && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 mb-4">{l ? 'Passwörter stimmen nicht überein' : 'Passwords do not match'}</div>}
        {pwdStatus === 'error' && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 mb-4">{l ? 'Aktuelles Passwort falsch' : 'Current password is incorrect'}</div>}
        <form onSubmit={handlePwd} className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><label className="form-label">{l ? 'Aktuelles Passwort' : 'Current Password'}</label><input type="password" value={pwd.currentPassword} onChange={e => setPwd({...pwd, currentPassword: e.target.value})} required className="input-field" /></div>
          <div><label className="form-label">{l ? 'Neues Passwort' : 'New Password'}</label><input type="password" value={pwd.newPassword} onChange={e => setPwd({...pwd, newPassword: e.target.value})} required minLength={6} className="input-field" /></div>
          <div><label className="form-label">{l ? 'Passwort bestätigen' : 'Confirm New Password'}</label><input type="password" value={pwd.confirmNew} onChange={e => setPwd({...pwd, confirmNew: e.target.value})} required className="input-field" /></div>
          <div><button type="submit" disabled={saving} className="btn-dark">{saving ? '...' : (l ? 'Passwort ändern' : 'Update Password')}</button></div>
        </form>
      </div>
    </div>
  );
}

export default function PortalPage() {
  const { user, logout, updateProfile, changePassword } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');
  const l = lang === 'de';

  const handleLogout = () => { logout(); navigate('/'); };

  const tabs = [
    { key: 'dashboard', label: l ? 'Dashboard' : 'Dashboard' },
    { key: 'profile', label: l ? 'Mein Profil' : 'My Profile' },
  ];

  const cards = [
    { icon: '🏠', title: l ? 'Schadensmeldung' : 'Damage Report', desc: l ? 'Schaden melden' : 'Report damage or defects', to: '/forms/damage' },
    { icon: '🔑', title: l ? 'Schlüsselbestellung' : 'Key Order', desc: l ? 'Schlüssel bestellen' : 'Order replacement keys', to: '/forms/key' },
    { icon: '📋', title: l ? 'Mieterwechsel' : 'Tenant Change', desc: l ? 'Mieterwechsel melden' : 'Report a tenant change', to: '/forms/tenant-change' },
    { icon: '📞', title: l ? 'Kontakt' : 'Contact', desc: l ? 'Kontakt aufnehmen' : 'Get in touch with us', to: '/contact' },
    { icon: '🏢', title: l ? 'Objekte' : 'Properties', desc: l ? 'Unsere Objekte ansehen' : 'View managed properties', to: '/objects' },
    { icon: '📄', title: l ? 'Leistungen' : 'Services', desc: l ? 'Unsere Leistungen' : 'View our services', to: '/services' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Portal Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent flex items-center justify-center font-black text-slate-900 text-sm">W</div>
              <span className="font-black text-white text-lg">WERT</span>
            </Link>
            <span className="text-white/30">|</span>
            <span className="text-white/60 text-sm">{l ? 'Kundenportal' : 'Customer Portal'}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-white font-bold text-sm">{user.firstName} {user.lastName}</p>
              <p className="text-white/50 text-xs capitalize">{user.role === 'owner' ? (l ? 'Eigentümer' : 'Owner') : (l ? 'Mieter' : 'Tenant')}</p>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-1.5 border border-white/20 hover:border-red-400 hover:text-red-400 text-white/70 text-xs px-3 py-2 transition-all">
              🚪 {l ? 'Abmelden' : 'Logout'}
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6 flex border-t border-white/10">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 ${tab === t.key ? 'border-accent text-accent' : 'border-transparent text-white/60 hover:text-white'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {tab === 'dashboard' && (
          <>
            {/* Welcome */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 mb-8">
              <p className="text-accent text-sm font-bold uppercase tracking-widest mb-1">{l ? 'Willkommen zurück' : 'Welcome back'}</p>
              <h1 className="font-serif text-3xl font-bold">{user.firstName} {user.lastName}</h1>
              <p className="text-white/60 mt-1">{user.email}</p>
            </div>
            {/* Info cards */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {[
                { label: l ? 'Meine Einheit' : 'My Unit', val: user.unit || '—' },
                { label: l ? 'Meine Adresse' : 'My Address', val: user.address || '—' },
                { label: l ? 'Rolle' : 'Role', val: user.role === 'owner' ? (l ? 'Eigentümer' : 'Owner') : (l ? 'Mieter' : 'Tenant') },
              ].map(item => (
                <div key={item.label} className="bg-white p-5 border border-slate-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{item.label}</p>
                  <p className="font-bold text-slate-900 text-lg">{item.val}</p>
                </div>
              ))}
            </div>
            {/* Quick actions */}
            <h2 className="font-bold text-slate-900 text-lg mb-4 uppercase tracking-wider">{l ? 'Schnellaktionen' : 'Quick Actions'}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {cards.map(c => <PortalCard key={c.to} {...c} />)}
            </div>
          </>
        )}

        {tab === 'profile' && (
          <ProfileTab user={user} updateProfile={updateProfile} changePassword={changePassword} lang={lang} />
        )}
      </main>
    </div>
  );
}
