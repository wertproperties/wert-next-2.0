// import { useState, useEffect, useRef, useCallback } from 'react';

// // ─── Constants ────────────────────────────────────────────────────
// const SESSION_KEY   = 'wert_chat_session';
// const VISITOR_KEY   = 'wert_chat_visitor';
// const POLL_INTERVAL = 3000; // ms — poll every 3 seconds for new admin replies
// const API_BASE      = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// function getOrCreateSession() {
//   let id = sessionStorage.getItem(SESSION_KEY);
//   if (!id) {
//     id = 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
//     sessionStorage.setItem(SESSION_KEY, id);
//   }
//   return id;
// }

// function getVisitor() {
//   try { return JSON.parse(localStorage.getItem(VISITOR_KEY) || '{}'); } catch { return {}; }
// }
// function saveVisitor(v) { localStorage.setItem(VISITOR_KEY, JSON.stringify(v)); }

// // ─── Icons ────────────────────────────────────────────────────────
// const ChatIcon = () => (
//   <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
//   </svg>
// );
// const CloseIcon = () => (
//   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
//   </svg>
// );
// const SendIcon = () => (
//   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
//   </svg>
// );
// const MinIcon = () => (
//   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4"/>
//   </svg>
// );

// // ─── Visitor info form (shown first time) ─────────────────────────
// function VisitorForm({ onSubmit }) {
//   const [name, setName]   = useState('');
//   const [email, setEmail] = useState('');

//   const handle = e => {
//     e.preventDefault();
//     onSubmit({ name: name.trim() || 'Visitor', email: email.trim() });
//   };

//   return (
//     <div className="flex-1 flex flex-col justify-center px-5 py-6 bg-stone-50">
//       <p className="font-bold text-stone-800 text-base mb-1">Willkommen! / Welcome!</p>
//       <p className="text-stone-500 text-sm mb-5">
//         Bitte geben Sie Ihren Namen an, damit wir Ihnen helfen können.<br />
//         <span className="text-xs">(Please enter your name so we can assist you.)</span>
//       </p>
//       <form onSubmit={handle} className="space-y-3">
//         <div>
//           <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Name</label>
//           <input
//             value={name} onChange={e => setName(e.target.value)}
//             placeholder="Your name"
//             className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 bg-white"
//           />
//         </div>
//         <div>
//           <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">E-Mail <span className="text-stone-300 font-normal">(optional)</span></label>
//           <input
//             type="email" value={email} onChange={e => setEmail(e.target.value)}
//             placeholder="your@email.com"
//             className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 bg-white"
//           />
//         </div>
//         <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-lg text-sm transition-colors">
//           Chat starten / Start Chat →
//         </button>
//       </form>
//     </div>
//   );
// }

// // ─── Main Chatbot ─────────────────────────────────────────────────
// export default function Chatbot() {
//   const sessionId = useRef(getOrCreateSession());
//   const [open, setOpen]           = useState(false);
//   const [minimized, setMinimized] = useState(false);
//   const [messages, setMessages]   = useState([]);
//   const [input, setInput]         = useState('');
//   const [sending, setSending]     = useState(false);
//   const [unread, setUnread]       = useState(0);
//   const [lastTs, setLastTs]       = useState(null);  // timestamp of latest message we have
//   const [visitor, setVisitor]     = useState(getVisitor); // { name, email }
//   const [started, setStarted]     = useState(false);  // has visitor submitted name form?
//   const [error, setError]         = useState(null);
//   const messagesEndRef = useRef(null);
//   const inputRef       = useRef(null);
//   const pollRef        = useRef(null);

//   // Has visitor already provided their name before?
//   useEffect(() => {
//     const v = getVisitor();
//     if (v.name) { setVisitor(v); setStarted(true); }
//   }, []);

//   // Scroll to bottom when messages change
//   useEffect(() => {
//     if (open && !minimized) {
//       messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//       setUnread(0);
//     }
//   }, [messages, open, minimized]);

//   // Focus input when chat opens
//   useEffect(() => {
//     if (open && !minimized && started) {
//       setTimeout(() => inputRef.current?.focus(), 100);
//     }
//   }, [open, minimized, started]);

//   // ── Polling: fetch new messages every 3s ───────────────────────
//   const fetchNewMessages = useCallback(async () => {
//     if (!started) return;
//     try {
//       const url = lastTs
//         ? `${API_BASE}/chat/messages/${sessionId.current}?after=${encodeURIComponent(lastTs)}`
//         : `${API_BASE}/chat/messages/${sessionId.current}`;

//       const res = await fetch(url);
//       if (!res.ok) return;
//       const json = await res.json();
//       const newMsgs = json.data || [];

//       if (newMsgs.length > 0) {
//         setMessages(prev => {
//           // Merge avoiding duplicates by _id
//           const ids = new Set(prev.map(m => m._id));
//           const toAdd = newMsgs.filter(m => !ids.has(m._id));
//           if (toAdd.length === 0) return prev;
//           return [...prev, ...toAdd];
//         });
//         setLastTs(newMsgs[newMsgs.length - 1].createdAt);
//         // Count unread admin replies when window is closed/minimized
//         if (!open || minimized) {
//           const adminMsgs = newMsgs.filter(m => m.role === 'admin');
//           if (adminMsgs.length > 0) setUnread(u => u + adminMsgs.length);
//         }
//       }
//     } catch { /* silently ignore network errors */ }
//   }, [started, lastTs, open, minimized]);

//   // Load initial messages when session starts
//   const loadAllMessages = useCallback(async () => {
//     try {
//       const res = await fetch(`${API_BASE}/chat/messages/${sessionId.current}`);
//       const json = await res.json();
//       const msgs = json.data || [];
//       setMessages(msgs);
//       if (msgs.length > 0) setLastTs(msgs[msgs.length - 1].createdAt);
//     } catch { /* ignore */ }
//   }, []);

//   // Start polling when visitor has introduced themselves
//   useEffect(() => {
//     if (!started) return;
//     loadAllMessages();
//     pollRef.current = setInterval(fetchNewMessages, POLL_INTERVAL);
//     return () => clearInterval(pollRef.current);
//   }, [started, fetchNewMessages, loadAllMessages]);

//   // ── Visitor form submit ─────────────────────────────────────────
//   const handleVisitorSubmit = ({ name, email }) => {
//     const v = { name, email };
//     setVisitor(v);
//     saveVisitor(v);
//     setStarted(true);

//     // Send a greeting message automatically
//     setTimeout(async () => {
//       try {
//         await fetch(`${API_BASE}/chat/message`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             sessionId: sessionId.current,
//             text: `Hallo, ich bin ${name}. Ich brauche Hilfe.`,
//             visitorName: name,
//             visitorEmail: email,
//           }),
//         });
//       } catch { /* ignore */ }
//     }, 500);
//   };

//   // ── Send message ────────────────────────────────────────────────
//   const sendMessage = async () => {
//     const text = input.trim();
//     if (!text || sending) return;
//     setInput('');
//     setSending(true);
//     setError(null);

//     // Optimistic UI — add message immediately
//     const optimistic = {
//       _id: 'temp_' + Date.now(),
//       role: 'user',
//       text,
//       createdAt: new Date().toISOString(),
//       visitorName: visitor.name,
//     };
//     setMessages(prev => [...prev, optimistic]);

//     try {
//       const res = await fetch(`${API_BASE}/chat/message`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           sessionId: sessionId.current,
//           text,
//           visitorName: visitor.name || 'Visitor',
//           visitorEmail: visitor.email || '',
//         }),
//       });
//       const json = await res.json();
//       if (json.success) {
//         // Replace optimistic with real message
//         setMessages(prev => prev.map(m => m._id === optimistic._id ? json.data : m));
//         setLastTs(json.data.createdAt);
//       }
//     } catch {
//       setError('Message could not be sent. Please try again.');
//       // Remove optimistic
//       setMessages(prev => prev.filter(m => m._id !== optimistic._id));
//     } finally {
//       setSending(false);
//     }
//   };

//   const handleKey = e => {
//     if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
//   };

//   const openChat = () => {
//     setOpen(true);
//     setMinimized(false);
//     setUnread(0);
//   };

//   const fmt = (iso) => {
//     try { return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
//     catch { return ''; }
//   };

//   return (
//     <>
//       {/* ── Chat window ── */}
//       {open && (
//         <div className={`fixed bottom-24 right-6 z-50 flex flex-col shadow-2xl rounded-2xl overflow-hidden border border-stone-200 bg-white transition-all duration-300 ${minimized ? 'h-14 w-72' : 'w-80 sm:w-96 h-[500px]'}`}>
          
//           {/* Header */}
//           <div className="flex items-center justify-between px-4 py-3 bg-amber-500 text-white shrink-0">
//             <div className="flex items-center gap-3">
//               <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center font-black text-sm">W</div>
//               <div>
//                 <p className="font-bold text-sm leading-tight">WERT Support</p>
//                 {!minimized && (
//                   <div className="flex items-center gap-1">
//                     <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse"/>
//                     <p className="text-amber-100 text-xs">Online</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className="flex items-center gap-1">
//               <button onClick={() => setMinimized(m => !m)} className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
//                 <MinIcon />
//               </button>
//               <button onClick={() => { setOpen(false); setMinimized(false); }} className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
//                 <CloseIcon />
//               </button>
//             </div>
//           </div>

//           {!minimized && (
//             <>
//               {/* Visitor form or chat */}
//               {!started ? (
//                 <VisitorForm onSubmit={handleVisitorSubmit} />
//               ) : (
//                 <>
//                   {/* Messages area */}
//                   <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-stone-50">
//                     {messages.length === 0 && (
//                       <div className="text-center py-8">
//                         <p className="text-stone-400 text-sm">
//                           Hallo {visitor.name}! 👋<br />
//                           Wie können wir Ihnen helfen?<br />
//                           <span className="text-xs">(How can we help you?)</span>
//                         </p>
//                       </div>
//                     )}

//                     {messages.map((msg) => (
//                       <div key={msg._id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
//                         {msg.role === 'admin' && (
//                           <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 shrink-0 mt-1">W</div>
//                         )}
//                         <div className="max-w-[78%]">
//                           <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
//                             msg.role === 'user'
//                               ? 'bg-amber-500 text-white rounded-br-sm'
//                               : 'bg-white text-stone-800 border border-stone-200 shadow-sm rounded-bl-sm'
//                           }`}>
//                             {msg.text}
//                           </div>
//                           <p className={`text-xs text-stone-400 mt-0.5 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
//                             {msg.role === 'admin' ? 'Admin · ' : ''}{fmt(msg.createdAt)}
//                           </p>
//                         </div>
//                       </div>
//                     ))}

//                     {error && (
//                       <div className="text-center">
//                         <p className="text-red-400 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
//                       </div>
//                     )}
//                     <div ref={messagesEndRef} />
//                   </div>

//                   {/* Input */}
//                   <div className="px-3 py-3 border-t border-stone-100 bg-white shrink-0">
//                     <div className="flex gap-2 items-end">
//                       <textarea
//                         ref={inputRef}
//                         value={input}
//                         onChange={e => setInput(e.target.value)}
//                         onKeyDown={handleKey}
//                         placeholder="Nachricht eingeben... / Type a message..."
//                         rows={1}
//                         className="flex-1 resize-none border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 bg-stone-50 text-stone-800 placeholder-stone-400 transition-colors"
//                         style={{ maxHeight: '80px' }}
//                       />
//                       <button
//                         onClick={sendMessage}
//                         disabled={!input.trim() || sending}
//                         className="w-10 h-10 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all shrink-0 active:scale-95"
//                       >
//                         <SendIcon />
//                       </button>
//                     </div>
//                     <p className="text-center text-stone-300 text-xs mt-1.5">WERT Hausverwaltung Support</p>
//                   </div>
//                 </>
//               )}
//             </>
//           )}
//         </div>
//       )}

//       {/* ── FAB Button ── */}
//       <button
//         onClick={open ? () => { setOpen(false); setMinimized(false); } : openChat}
//         className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
//         title="Chat with us"
//       >
//         {open ? <CloseIcon /> : <ChatIcon />}
//         {unread > 0 && !open && (
//           <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-bounce">
//             {unread > 9 ? '9+' : unread}
//           </span>
//         )}
//       </button>
//     </>
//   );
// }


import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Constants ────────────────────────────────────────────────────
const SESSION_KEY   = 'wert_chat_session';
const VISITOR_KEY   = 'wert_chat_visitor';
const POLL_INTERVAL = 3000; // ms — poll every 3 seconds for new admin replies
const API_BASE      = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function getOrCreateSession() {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function getVisitor() {
  try { return JSON.parse(localStorage.getItem(VISITOR_KEY) || '{}'); } catch { return {}; }
}
function saveVisitor(v) { localStorage.setItem(VISITOR_KEY, JSON.stringify(v)); }

// ─── Icons ────────────────────────────────────────────────────────
const ChatIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
  </svg>
);
const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
  </svg>
);
const SendIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
  </svg>
);
const MinIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4"/>
  </svg>
);

// ─── Visitor info form (name + mobile number only, shown first time) ─
function VisitorForm({ onSubmit }) {
  const [name, setName]   = useState('');
  const [phone, setPhone] = useState('');
  const [touched, setTouched] = useState(false);

  const handle = e => {
    e.preventDefault();
    setTouched(true);
    if (!name.trim() || !phone.trim()) return;
    onSubmit({ name: name.trim(), phone: phone.trim() });
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-5 py-6 bg-stone-50">
      <p className="font-bold text-stone-800 text-base mb-1">Willkommen! / Welcome!</p>
      <p className="text-stone-500 text-sm mb-5">
        Bitte geben Sie Ihren Namen und Ihre Handynummer an, damit wir Ihnen helfen können.<br />
        <span className="text-xs">(Please enter your name and mobile number so we can assist you.)</span>
      </p>
      <form onSubmit={handle} className="space-y-3">
        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Name</label>
          <input
            value={name} onChange={e => setName(e.target.value)}
            placeholder="Your name"
            className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 bg-white"
          />
          {touched && !name.trim() && (
            <p className="text-red-500 text-xs mt-1">Bitte geben Sie Ihren Namen ein / Please enter your name</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
            Handynummer <span className="text-stone-300 font-normal">(Mobile Number)</span>
          </label>
          <input
            type="tel" value={phone} onChange={e => setPhone(e.target.value)}
            placeholder="+49 151 12345678"
            className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 bg-white"
          />
          {touched && !phone.trim() && (
            <p className="text-red-500 text-xs mt-1">Bitte geben Sie Ihre Handynummer ein / Please enter your mobile number</p>
          )}
        </div>
        <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-lg text-sm transition-colors">
          Chat starten / Start Chat →
        </button>
      </form>
    </div>
  );
}

// ─── Main Chatbot ─────────────────────────────────────────────────
export default function Chatbot() {
  const sessionId = useRef(getOrCreateSession());
  const [open, setOpen]               = useState(false);
  const [minimized, setMinimized]     = useState(false);
  const [messages, setMessages]       = useState([]);
  const [input, setInput]             = useState('');
  const [sending, setSending]         = useState(false);
  const [unread, setUnread]           = useState(0);
  const [lastTs, setLastTs]           = useState(null);  // timestamp of latest message we have
  const [visitor, setVisitor]         = useState(getVisitor); // { name, phone }
  const [started, setStarted]         = useState(false);  // has visitor submitted name/phone form?
  const [error, setError]             = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);
  const pollRef        = useRef(null);

  // Has visitor already provided their name/phone before?
  useEffect(() => {
    const v = getVisitor();
    if (v.name && v.phone) { setVisitor(v); setStarted(true); }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (open && !minimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setUnread(0);
    }
  }, [messages, open, minimized]);

  // Focus input when chat opens
  useEffect(() => {
    if (open && !minimized && started) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, minimized, started]);

  // ── Polling: fetch new messages every 3s ───────────────────────
  const fetchNewMessages = useCallback(async () => {
    if (!started) return;
    try {
      const url = lastTs
        ? `${API_BASE}/chat/messages/${sessionId.current}?after=${encodeURIComponent(lastTs)}`
        : `${API_BASE}/chat/messages/${sessionId.current}`;

      const res = await fetch(url);
      if (!res.ok) return;
      const json = await res.json();
      const newMsgs = json.data || [];

      if (newMsgs.length > 0) {
        setMessages(prev => {
          // Merge avoiding duplicates by _id
          const ids = new Set(prev.map(m => m._id));
          const toAdd = newMsgs.filter(m => !ids.has(m._id));
          if (toAdd.length === 0) return prev;
          return [...prev, ...toAdd];
        });
        setLastTs(newMsgs[newMsgs.length - 1].createdAt);
        // Count unread admin replies when window is closed/minimized
        if (!open || minimized) {
          const adminMsgs = newMsgs.filter(m => m.role === 'admin');
          if (adminMsgs.length > 0) setUnread(u => u + adminMsgs.length);
        }
      }
    } catch { /* silently ignore network errors */ }
  }, [started, lastTs, open, minimized]);

  // Load initial messages when session starts
  const loadAllMessages = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/chat/messages/${sessionId.current}`);
      const json = await res.json();
      const msgs = json.data || [];
      setMessages(msgs);
      if (msgs.length > 0) setLastTs(msgs[msgs.length - 1].createdAt);
    } catch { /* ignore */ }
  }, []);

  // Start polling when visitor has introduced themselves
  useEffect(() => {
    if (!started) return;
    loadAllMessages();
    pollRef.current = setInterval(fetchNewMessages, POLL_INTERVAL);
    return () => clearInterval(pollRef.current);
  }, [started, fetchNewMessages, loadAllMessages]);

  // ── Visitor form submit (name + mobile number, no login) ─────────
  const handleVisitorSubmit = ({ name, phone }) => {
    const v = { name, phone };
    setVisitor(v);
    saveVisitor(v);
    setStarted(true);

    // Send a greeting message automatically
    setTimeout(async () => {
      try {
        await fetch(`${API_BASE}/chat/message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: sessionId.current,
            text: `Hallo, ich bin ${name} (Tel: ${phone}). Ich brauche Hilfe.`,
            visitorName: name,
            visitorEmail: phone, // mobile number is stored via the visitorEmail field
          }),
        });
      } catch { /* ignore */ }
    }, 500);
  };

  // ── Send message ────────────────────────────────────────────────
  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    setSending(true);
    setError(null);

    // Optimistic UI — add message immediately
    const optimistic = {
      _id: 'temp_' + Date.now(),
      role: 'user',
      text,
      createdAt: new Date().toISOString(),
      visitorName: visitor.name,
    };
    setMessages(prev => [...prev, optimistic]);

    try {
      const res = await fetch(`${API_BASE}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionId.current,
          text,
          visitorName: visitor.name || 'Visitor',
          visitorEmail: visitor.phone || '', // mobile number is stored via the visitorEmail field
        }),
      });
      const json = await res.json();
      if (json.success) {
        // Backend may return { data: msg } or { data: [userMsg, autoReply] }
        if (Array.isArray(json.data)) {
          setMessages(prev => {
            const filtered = prev.filter(m => m._id !== optimistic._id);
            return [...filtered, ...json.data];
          });
          setLastTs(json.data[json.data.length - 1].createdAt);
        } else {
          setMessages(prev => prev.map(m => m._id === optimistic._id ? json.data : m));
          setLastTs(json.data.createdAt);
        }
      }
    } catch {
      setError('Message could not be sent. Please try again.');
      // Remove optimistic
      setMessages(prev => prev.filter(m => m._id !== optimistic._id));
    } finally {
      setSending(false);
    }
  };

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const openChat = () => {
    setOpen(true);
    setMinimized(false);
    setUnread(0);
  };

  const fmt = (iso) => {
    try { return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
    catch { return ''; }
  };

  return (
    <>
      {/* ── Chat window ── */}
      {open && (
        <div className={`fixed bottom-24 right-6 z-50 flex flex-col shadow-2xl rounded-2xl overflow-hidden border border-stone-200 bg-white transition-all duration-300 ${minimized ? 'h-14 w-72' : 'w-80 sm:w-96 h-[500px]'}`}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-amber-500 text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center font-black text-sm">W</div>
              <div>
                <p className="font-bold text-sm leading-tight">WERT Support</p>
                {!minimized && (
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse"/>
                    <p className="text-amber-100 text-xs">Online</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setMinimized(m => !m)} className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <MinIcon />
              </button>
              <button onClick={() => { setOpen(false); setMinimized(false); }} className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <CloseIcon />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Visitor form (name + mobile number) or chat */}
              {!started ? (
                <VisitorForm onSubmit={handleVisitorSubmit} />
              ) : (
                <>
                  {/* Messages area */}
                  <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-stone-50">
                    {messages.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-stone-400 text-sm">
                          Hallo {visitor.name}! 👋<br />
                          Wie können wir Ihnen helfen?<br />
                          <span className="text-xs">(How can we help you?)</span>
                        </p>
                      </div>
                    )}

                    {messages.map((msg) => (
                      <div key={msg._id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'admin' && (
                          <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 shrink-0 mt-1">W</div>
                        )}
                        <div className="max-w-[78%]">
                          <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-amber-500 text-white rounded-br-sm'
                              : 'bg-white text-stone-800 border border-stone-200 shadow-sm rounded-bl-sm'
                          }`}>
                            {msg.text}
                          </div>
                          <p className={`text-xs text-stone-400 mt-0.5 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                            {msg.role === 'admin' ? 'WERT Team · ' : ''}{fmt(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}

                    {error && (
                      <div className="text-center">
                        <p className="text-red-400 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="px-3 py-3 border-t border-stone-100 bg-white shrink-0">
                    <div className="flex gap-2 items-end">
                      <textarea
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKey}
                        placeholder="Nachricht eingeben... / Type a message..."
                        rows={1}
                        className="flex-1 resize-none border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 bg-stone-50 text-stone-800 placeholder-stone-400 transition-colors"
                        style={{ maxHeight: '80px' }}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!input.trim() || sending}
                        className="w-10 h-10 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all shrink-0 active:scale-95"
                      >
                        <SendIcon />
                      </button>
                    </div>
                    <p className="text-center text-stone-300 text-xs mt-1.5">WERT Hausverwaltung Support</p>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* ── FAB Button ── */}
      <button
        onClick={open ? () => { setOpen(false); setMinimized(false); } : openChat}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        title="Chat with us"
      >
        {open ? <CloseIcon /> : <ChatIcon />}
        {unread > 0 && !open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-bounce">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
    </>
  );
}
