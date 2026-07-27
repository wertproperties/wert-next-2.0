import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

/* ─── Shared UI helpers ─────────────────────────────────────────── */
function SideItem({ icon, label, active, onClick, badge }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all relative ${active ? 'bg-amber-500 text-stone-900' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
      {badge > 0 && (
        <span className="ml-auto bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </button>
  );
}

function StatCard({ icon, label, value, sub, color = 'accent' }) {
  const bg = { accent: 'bg-amber-50 border-amber-200', green: 'bg-green-50 border-green-200', blue: 'bg-blue-50 border-blue-200', red: 'bg-red-50 border-red-200' }[color];
  return (
    <div className={`bg-white border p-6 rounded-xl hover:shadow-md transition-shadow ${bg}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl">{icon}</div>
        {sub !== undefined && <span className={`text-xs font-bold px-2 py-1 rounded-full ${sub > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{sub > 0 ? `${sub} new` : 'All clear'}</span>}
      </div>
      <p className="text-3xl font-black text-stone-900">{value}</p>
      <p className="text-stone-400 text-sm mt-1">{label}</p>
    </div>
  );
}

function DataTable({ headers, rows, emptyMsg = 'No data' }) {
  if (!rows || rows.length === 0) return <div className="text-center py-12 text-stone-400 text-sm">{emptyMsg}</div>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-stone-200">
            {headers.map(h => <th key={h} className="text-left text-xs font-bold uppercase tracking-wider text-stone-500 px-4 py-3">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-stone-100 hover:bg-stone-50">
              {row.map((cell, j) => <td key={j} className="px-4 py-3 text-stone-700">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Badge({ status }) {
  const map = {
    new: 'bg-blue-100 text-blue-700', read: 'bg-stone-100 text-stone-600', replied: 'bg-green-100 text-green-700',
    submitted: 'bg-yellow-100 text-yellow-700', in_progress: 'bg-blue-100 text-blue-700', resolved: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700', approved: 'bg-blue-100 text-blue-700', delivered: 'bg-green-100 text-green-700',
    active: 'bg-green-100 text-green-700', inactive: 'bg-red-100 text-red-700',
    admin: 'bg-purple-100 text-purple-700', owner: 'bg-blue-100 text-blue-700', tenant: 'bg-stone-100 text-stone-600',
    low: 'bg-green-100 text-green-700', medium: 'bg-yellow-100 text-yellow-700', high: 'bg-orange-100 text-orange-700', emergency: 'bg-red-100 text-red-700',
  };
  return <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${map[status] || 'bg-stone-100 text-stone-600'}`}>{status}</span>;
}

/* ─── CHAT PANEL ────────────────────────────────────────────────── */
function ChatPanel() {
  const [sessions, setSessions]       = useState([]);
  const [activeSession, setActive]    = useState(null);
  const [messages, setMessages]       = useState([]);
  const [reply, setReply]             = useState('');
  const [sending, setSending]         = useState(false);
  const [loading, setLoading]         = useState(true);
  const [msgLoading, setMsgLoading]   = useState(false);
  const [pollCount, setPollCount]     = useState(0);   // triggers re-poll
  const messagesEndRef                = useRef(null);
  const token                         = localStorage.getItem('wert_token');

  const authHeader = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  /* Load sessions list */
  const loadSessions = useCallback(async () => {
    try {
      const res  = await fetch(`${API_BASE}/chat/admin/sessions`, { headers: authHeader });
      const json = await res.json();
      if (json.success) setSessions(json.data || []);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, []);

  /* Poll sessions every 5s */
  useEffect(() => {
    loadSessions();
    const t = setInterval(() => { loadSessions(); setPollCount(p => p + 1); }, 5000);
    return () => clearInterval(t);
  }, [loadSessions]);

  /* Load messages for selected session */
  const loadMessages = useCallback(async (sid) => {
    if (!sid) return;
    setMsgLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/chat/admin/session/${sid}`, { headers: authHeader });
      const json = await res.json();
      if (json.success) setMessages(json.data || []);
    } catch { /* ignore */ } finally { setMsgLoading(false); }
  }, []);

  /* Re-load messages when poll triggers and session is active */
  useEffect(() => {
    if (activeSession) loadMessages(activeSession._id);
  }, [pollCount, activeSession, loadMessages]);

  /* Scroll to bottom when messages change */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectSession = (s) => {
    setActive(s);
    setMessages([]);
    loadMessages(s._id);
    // Optimistically clear unread badge
    setSessions(prev => prev.map(x => x._id === s._id ? { ...x, unreadCount: 0 } : x));
  };

  const sendReply = async () => {
    const text = reply.trim();
    if (!text || !activeSession || sending) return;
    setSending(true);
    const optimistic = { _id: 'tmp_' + Date.now(), role: 'admin', text, createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, optimistic]);
    setReply('');
    try {
      const res  = await fetch(`${API_BASE}/chat/admin/reply`, {
        method: 'POST',
        headers: authHeader,
        body: JSON.stringify({ sessionId: activeSession._id, text }),
      });
      const json = await res.json();
      if (json.success) {
        setMessages(prev => prev.map(m => m._id === optimistic._id ? json.data : m));
      }
    } catch { /* ignore */ } finally { setSending(false); }
  };

  const deleteSession = async (sid, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this chat session?')) return;
    try {
      await fetch(`${API_BASE}/chat/admin/session/${sid}`, { method: 'DELETE', headers: authHeader });
      setSessions(prev => prev.filter(s => s._id !== sid));
      if (activeSession?._id === sid) { setActive(null); setMessages([]); }
    } catch { /* ignore */ }
  };

  const fmt = (iso) => { try { return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); } catch { return ''; } };
  const fmtDate = (iso) => { try { return new Date(iso).toLocaleDateString(); } catch { return ''; } };

  const totalUnread = sessions.reduce((s, x) => s + (x.unreadCount || 0), 0);

  return (
    <div className="flex h-full gap-0 bg-white rounded-2xl border border-stone-200 overflow-hidden" style={{ minHeight: '520px' }}>

      {/* Sessions sidebar */}
      <div className="w-72 shrink-0 border-r border-stone-200 flex flex-col">
        <div className="px-4 py-4 border-b border-stone-100 bg-stone-50">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-stone-900 text-sm">Live Chats</h2>
            {totalUnread > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{totalUnread} unread</span>
            )}
          </div>
          <p className="text-stone-400 text-xs mt-0.5">{sessions.length} session{sessions.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="text-center py-8 text-stone-400 text-sm">Loading sessions...</div>
          )}
          {!loading && sessions.length === 0 && (
            <div className="text-center py-12 px-4">
              <p className="text-4xl mb-3">💬</p>
              <p className="text-stone-500 text-sm font-medium">No chat sessions yet</p>
              <p className="text-stone-400 text-xs mt-1">When visitors use the chat widget, conversations will appear here.</p>
            </div>
          )}
          {sessions.map(s => (
            <button
              key={s._id}
              onClick={() => selectSession(s)}
              className={`w-full text-left px-4 py-3 border-b border-stone-100 hover:bg-amber-50 transition-colors relative ${activeSession?._id === s._id ? 'bg-amber-50 border-l-4 border-l-amber-500' : ''}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-bold text-xs shrink-0">
                      {(s.visitorName || 'V')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-stone-900 text-sm truncate">{s.visitorName || 'Visitor'}</p>
                      {s.visitorEmail && <p className="text-stone-400 text-xs truncate">{s.visitorEmail}</p>}
                    </div>
                  </div>
                  <p className="text-stone-500 text-xs mt-1.5 truncate pl-9">{s.lastMessage}</p>
                  <p className="text-stone-400 text-xs mt-0.5 pl-9">{fmtDate(s.lastTime)}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {s.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {s.unreadCount}
                    </span>
                  )}
                  <button
                    onClick={(e) => deleteSession(s._id, e)}
                    className="text-stone-300 hover:text-red-400 text-xs transition-colors p-0.5"
                    title="Delete session"
                  >✕</button>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col">
        {!activeSession ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <p className="text-6xl mb-4">👈</p>
            <h3 className="font-bold text-stone-700 text-lg mb-2">Select a conversation</h3>
            <p className="text-stone-400 text-sm">Click on a chat session from the left panel to view messages and reply to visitors.</p>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="px-5 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-bold">
                  {(activeSession.visitorName || 'V')[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-stone-900 text-sm">{activeSession.visitorName || 'Visitor'}</p>
                  <p className="text-stone-400 text-xs">{activeSession.visitorEmail || 'No email provided'} · Session: {activeSession._id?.slice(-8)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
                <span className="text-stone-400 text-xs">Live</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-stone-50">
              {msgLoading && <div className="text-center text-stone-400 text-sm py-4">Loading messages...</div>}
              {!msgLoading && messages.length === 0 && (
                <div className="text-center py-8 text-stone-400 text-sm">No messages yet in this session.</div>
              )}
              {messages.map(msg => (
                <div key={msg._id} className={`flex ${msg.role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 bg-stone-200 rounded-full flex items-center justify-center text-stone-600 text-xs font-bold mr-2 shrink-0 mt-1">
                      {(activeSession.visitorName || 'V')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="max-w-[70%]">
                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'admin'
                        ? 'bg-amber-500 text-white rounded-br-sm'
                        : 'bg-white text-stone-800 border border-stone-200 shadow-sm rounded-bl-sm'
                    }`}>
                      {msg.text}
                    </div>
                    <p className={`text-xs text-stone-400 mt-0.5 ${msg.role === 'admin' ? 'text-right' : 'text-left'}`}>
                      {msg.role === 'admin' ? 'You (Admin) · ' : `${activeSession.visitorName} · `}{fmt(msg.createdAt)}
                    </p>
                  </div>
                  {msg.role === 'admin' && (
                    <div className="w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold ml-2 shrink-0 mt-1">A</div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply input */}
            <div className="px-4 py-3 border-t border-stone-200 bg-white shrink-0">
              <div className="flex gap-2 items-end">
                <textarea
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                  placeholder="Type your reply to the visitor..."
                  rows={2}
                  className="flex-1 resize-none border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 bg-stone-50 text-stone-800 placeholder-stone-400 transition-colors"
                  style={{ maxHeight: '100px' }}
                />
                <button
                  onClick={sendReply}
                  disabled={!reply.trim() || sending}
                  className="h-10 px-5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-bold rounded-xl text-sm transition-all shrink-0 active:scale-95"
                >
                  {sending ? '...' : 'Reply →'}
                </button>
              </div>
              <p className="text-stone-400 text-xs mt-1.5 text-center">Press Enter to send · Shift+Enter for new line · Replies appear instantly for the visitor</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Overview ──────────────────────────────────────────────────── */
function Overview({ stats }) {
  if (!stats) return <div className="text-center py-12 text-stone-400">Loading stats...</div>;
  const d = stats;
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-bold text-stone-900 text-xl mb-5">Overview</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard icon="👥" label="Total Users" value={d.users} color="blue" />
          <StatCard icon="🏢" label="Properties" value={d.properties} color="accent" />
          <StatCard icon="📩" label="Contacts" value={d.contacts} sub={d.newContacts} color="green" />
          <StatCard icon="🔧" label="Damage Reports" value={d.damages} sub={d.pendingDamages} color="red" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
          <StatCard icon="🔑" label="Key Orders" value={d.keys} sub={d.pendingKeys} color="accent" />
          <StatCard icon="📋" label="Tenant Changes" value={d.tenants} color="blue" />
        </div>
      </div>
      <div>
        <h3 className="font-bold text-stone-900 text-lg mb-4">Recent Contact Inquiries</h3>
        <div className="bg-white border border-stone-100 rounded-xl">
          <DataTable
            headers={['Name', 'Email', 'Message', 'Status', 'Date']}
            rows={(d.recentContacts || []).map(c => [
              `${c.firstName} ${c.lastName}`,
              <a href={`mailto:${c.email}`} className="text-amber-600 hover:underline">{c.email}</a>,
              <span className="max-w-xs truncate block">{c.message?.slice(0, 60)}...</span>,
              <Badge status={c.status} />,
              new Date(c.createdAt).toLocaleDateString(),
            ])}
            emptyMsg="No contacts yet"
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Users Panel ───────────────────────────────────────────────── */
function UsersPanel({ getAllUsers, createUser, updateUser, deleteUser }) {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState({ firstName: '', lastName: '', email: '', password: '', phone: '', role: 'owner' });
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]   = useState(false);

  useEffect(() => { getAllUsers().then(r => setUsers(r.data.data || [])).catch(console.error).finally(() => setLoading(false)); }, []);

  const handleCreate = async e => {
    e.preventDefault(); setSaving(true);
    try { const r = await createUser(form); setUsers(prev => [r.data.data, ...prev]); setShowForm(false); setForm({ firstName: '', lastName: '', email: '', password: '', phone: '', role: 'owner' }); }
    catch (err) { alert(err.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const toggleActive = async (u) => {
    try { const r = await updateUser(u._id, { isActive: !u.isActive }); setUsers(prev => prev.map(x => x._id === u._id ? r.data.data : x)); }
    catch { alert('Error'); }
  };

  if (loading) return <div className="text-center py-12 text-stone-400">Loading users...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-stone-900 text-xl">Users ({users.length})</h2>
        <button onClick={() => setShowForm(s => !s)} className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 text-sm rounded-lg transition-colors">+ Add User</button>
      </div>
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-stone-200 rounded-xl p-6 grid grid-cols-2 gap-4">
          {[['First Name', 'firstName'], ['Last Name', 'lastName'], ['Email', 'email'], ['Password', 'password'], ['Phone', 'phone']].map(([label, key]) => (
            <div key={key}>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">{label}</label>
              <input type={key === 'password' ? 'password' : key === 'email' ? 'email' : 'text'} required={['firstName', 'lastName', 'email', 'password'].includes(key)}
                value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Role</label>
            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400">
              <option value="owner">Owner</option><option value="tenant">Tenant</option><option value="admin">Admin</option>
            </select>
          </div>
          <div className="col-span-2 flex gap-3">
            <button type="submit" disabled={saving} className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2 text-sm rounded-lg">{saving ? 'Saving...' : 'Create User'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="border border-stone-200 text-stone-600 px-6 py-2 text-sm rounded-lg hover:bg-stone-50">Cancel</button>
          </div>
        </form>
      )}
      <div className="bg-white border border-stone-100 rounded-xl">
        <DataTable
          headers={['Name', 'Email', 'Phone', 'Role', 'Status', 'Joined', 'Actions']}
          rows={users.map(u => [
            `${u.firstName} ${u.lastName}`,
            u.email,
            u.phone || '—',
            <Badge status={u.role} />,
            <Badge status={u.isActive ? 'active' : 'inactive'} />,
            new Date(u.createdAt).toLocaleDateString(),
            <button onClick={() => toggleActive(u)} className={`text-xs font-bold px-3 py-1 rounded-full border transition-colors ${u.isActive ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}>
              {u.isActive ? 'Deactivate' : 'Activate'}
            </button>,
          ])}
          emptyMsg="No users found"
        />
      </div>
    </div>
  );
}

/* ─── Properties Panel ──────────────────────────────────────────── */
function PropertiesPanel({ getAllProperties, seedProperties, createProperty }) {
  const [props, setProps]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]       = useState({ title: '', address: '', city: '', units: 1, type: 'apartment_building', description: '', image: '', featured: false });

  const load = () => getAllProperties().then(r => setProps(r.data.data || [])).catch(console.error).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleSeed = async () => {
    setSeeding(true);
    try { await seedProperties(); load(); } catch { alert('Error seeding'); } finally { setSeeding(false); }
  };

  const handleCreate = async e => {
    e.preventDefault();
    try { await createProperty({ ...form, units: Number(form.units) }); load(); setShowForm(false); }
    catch { alert('Error creating property'); }
  };

  if (loading) return <div className="text-center py-12 text-stone-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-bold text-stone-900 text-xl">Properties ({props.length})</h2>
        <div className="flex gap-3">
          <button onClick={handleSeed} disabled={seeding} className="border border-stone-200 text-stone-600 hover:bg-stone-50 font-bold px-4 py-2 text-sm rounded-lg">{seeding ? 'Seeding...' : '🌱 Seed Sample Data'}</button>
          <button onClick={() => setShowForm(s => !s)} className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 text-sm rounded-lg">+ Add Property</button>
        </div>
      </div>
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-stone-200 rounded-xl p-6 grid grid-cols-2 gap-4">
          {[['Title', 'title'], ['Address', 'address'], ['City', 'city'], ['Image URL', 'image'], ['Description', 'description']].map(([label, key]) => (
            <div key={key} className={key === 'description' ? 'col-span-2' : ''}>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">{label}</label>
              {key === 'description' ? <textarea value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} rows={2} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                : <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} required={['title','address','city'].includes(key)} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />}
            </div>
          ))}
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Units</label>
            <input type="number" min="1" value={form.units} onChange={e => setForm(f => ({ ...f, units: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Type</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400">
              <option value="apartment_building">Apartment Building</option>
              <option value="apartment_complex">Apartment Complex</option>
              <option value="commercial">Commercial</option>
              <option value="mixed">Mixed Use</option>
            </select>
          </div>
          <div className="col-span-2 flex gap-3">
            <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2 text-sm rounded-lg">Create Property</button>
            <button type="button" onClick={() => setShowForm(false)} className="border border-stone-200 text-stone-600 px-6 py-2 text-sm rounded-lg hover:bg-stone-50">Cancel</button>
          </div>
        </form>
      )}
      <div className="bg-white border border-stone-100 rounded-xl">
        <DataTable
          headers={['Title', 'Address', 'City', 'Type', 'Units', 'Featured']}
          rows={props.map(p => [p.title, p.address, p.city, p.type.replace('_', ' '), p.units, p.featured ? '⭐ Yes' : 'No'])}
          emptyMsg="No properties yet. Click Seed Sample Data!"
        />
      </div>
    </div>
  );
}

/* ─── Generic List Panel ────────────────────────────────────────── */
function ListPanel({ title, loadFn, headers, rowFn, emptyMsg }) {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { loadFn().then(r => setData(r.data.data || [])).catch(console.error).finally(() => setLoading(false)); }, []);
  if (loading) return <div className="text-center py-12 text-stone-400">Loading...</div>;
  return (
    <div className="space-y-4">
      <h2 className="font-bold text-stone-900 text-xl">{title} ({data.length})</h2>
      <div className="bg-white border border-stone-100 rounded-xl">
        <DataTable headers={headers} rows={data.map(rowFn)} emptyMsg={emptyMsg} />
      </div>
    </div>
  );
}

/* ─── ADMIN PAGE ────────────────────────────────────────────────── */
export default function AdminPage() {
  const { user, logout, isAdmin, getAdminStats, getAllUsers, createUser, updateUser, deleteUser,
    getAllContacts, getAllDamages, getAllKeys, getAllTenants, getAllProperties, seedProperties, createProperty } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab]         = useState('overview');
  const [stats, setStats]     = useState(null);
  const [sideOpen, setSideOpen] = useState(true);
  const [chatUnread, setChatUnread] = useState(0);
  const token = localStorage.getItem('wert_token');

  useEffect(() => {
    if (!isAdmin) { navigate('/login'); return; }
    getAdminStats().then(r => setStats(r.data.data)).catch(console.error);
  }, [isAdmin]);

  /* Poll total unread chat count */
  useEffect(() => {
    if (!isAdmin || !token) return;
    const fetchUnread = async () => {
      try {
        const res  = await fetch(`${API_BASE}/chat/admin/unread-count`, { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        if (json.success) setChatUnread(json.count || 0);
      } catch { /* ignore */ }
    };
    fetchUnread();
    const t = setInterval(fetchUnread, 5000);
    return () => clearInterval(t);
  }, [isAdmin, token]);

  const handleLogout = () => { logout(); navigate('/'); };

  const navItems = [
    { key: 'overview',    icon: '📊', label: 'Overview' },
    { key: 'chats',       icon: '💬', label: 'Live Chats',        badge: chatUnread },
    { key: 'users',       icon: '👥', label: 'Users' },
    { key: 'properties',  icon: '🏢', label: 'Properties' },
    { key: 'contacts',    icon: '📩', label: 'Contact Inquiries' },
    { key: 'damages',     icon: '🔧', label: 'Damage Reports' },
    { key: 'keys',        icon: '🔑', label: 'Key Orders' },
    { key: 'tenants',     icon: '📋', label: 'Tenant Changes' },
  ];

  if (!isAdmin) return null;

  return (
    <div className="flex h-screen bg-stone-100 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sideOpen ? 'w-60' : 'w-0 overflow-hidden'} bg-stone-900 shrink-0 flex flex-col transition-all duration-300`}>
        <div className="p-5 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 flex items-center justify-center font-black text-stone-900 text-sm rounded">W</div>
            <span className="font-black text-white">WERT</span>
          </Link>
          <p className="text-white/40 text-xs mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(item => (
            <SideItem key={item.key} {...item} active={tab === item.key}
              onClick={() => { setTab(item.key); if (item.key === 'chats') setChatUnread(0); }} />
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <p className="text-white/60 text-xs mb-1">{user.firstName} {user.lastName}</p>
          <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300 font-medium">🚪 Logout</button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSideOpen(!sideOpen)} className="text-stone-400 hover:text-stone-600 text-xl">☰</button>
            <h1 className="font-bold text-stone-900 capitalize">{navItems.find(n => n.key === tab)?.label}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs text-stone-400 hover:text-amber-600 transition-colors">← Back to Site</Link>
            <div className="w-8 h-8 bg-amber-500 flex items-center justify-center font-black text-stone-900 text-xs rounded-full">
              {user.firstName[0]}{user.lastName[0]}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {tab === 'overview' && <Overview stats={stats} />}

          {tab === 'chats' && <ChatPanel />}

          {tab === 'users' && <UsersPanel getAllUsers={getAllUsers} createUser={createUser} updateUser={updateUser} deleteUser={deleteUser} />}

          {tab === 'properties' && <PropertiesPanel getAllProperties={getAllProperties} seedProperties={seedProperties} createProperty={createProperty} />}

          {tab === 'contacts' && (
            <ListPanel title="Contact Inquiries" loadFn={getAllContacts}
              headers={['Name', 'Email', 'Phone', 'Subject', 'Message', 'Status', 'Date']}
              rowFn={c => [
                `${c.firstName} ${c.lastName}`,
                <a href={`mailto:${c.email}`} className="text-amber-600 hover:underline">{c.email}</a>,
                c.phone || '—', c.subject || '—',
                <span className="block max-w-xs truncate">{c.message}</span>,
                <Badge status={c.status} />,
                new Date(c.createdAt).toLocaleDateString(),
              ]}
              emptyMsg="No contact inquiries yet"
            />
          )}

          {tab === 'damages' && (
            <ListPanel title="Damage Reports" loadFn={getAllDamages}
              headers={['Name', 'Email', 'Address', 'Type', 'Urgency', 'Status', 'Date']}
              rowFn={d => [d.name, d.email, d.address, d.damageType, <Badge status={d.urgency} />, <Badge status={d.status} />, new Date(d.createdAt).toLocaleDateString()]}
              emptyMsg="No damage reports yet"
            />
          )}

          {tab === 'keys' && (
            <ListPanel title="Key Orders" loadFn={getAllKeys}
              headers={['Name', 'Email', 'Address', 'Key Type', 'Qty', 'Status', 'Date']}
              rowFn={k => [k.name, k.email, k.address, k.keyType, k.quantity, <Badge status={k.status} />, new Date(k.createdAt).toLocaleDateString()]}
              emptyMsg="No key orders yet"
            />
          )}

          {tab === 'tenants' && (
            <ListPanel title="Tenant Changes" loadFn={getAllTenants}
              headers={['Property', 'Unit', 'Owner', 'Out Tenant', 'In Tenant', 'Status', 'Date']}
              rowFn={t => [t.property, t.unit, t.ownerName, t.outgoingTenant?.name || '—', t.incomingTenant?.name || '—', <Badge status={t.status} />, new Date(t.createdAt).toLocaleDateString()]}
              emptyMsg="No tenant changes yet"
            />
          )}
        </main>
      </div>
    </div>
  );
}
