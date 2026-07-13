# Hausverwaltung WERT  - Full Stack Website

## Project Structure

```
hausverwaltung/
├── backend/          ← Node.js + Express + MongoDB API
└── frontend/         ← React + Tailwind CSS
```

---

## ✅ What's Included (New in This Version)

- **Updated Services Section** — 5 new service boxes (Residential, Commercial, Business Admin, Technical, Tenant Support)
- **Light Color Theme** — Warm stone/amber palette replacing dark slate
- **Live Chatbot** — Bottom-right chat widget, client ↔ admin messaging
- **DSGVO Cookie Banner** — German-law compliant with granular toggles (Necessary, Functional, Analytics, Marketing)

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

---

### Backend Setup

```bash
cd hausverwaltung/backend
npm install
```

Edit `.env` with your values:
```
MONGODB_URI=mongodb://localhost:27017/hausverwaltung
JWT_SECRET=change_this_to_something_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:3000
```

Start the backend:
```bash
npm run dev     # development (nodemon)
npm start       # production
```

Backend runs on: **http://localhost:5000**

**Seed admin user** (first time only):
```
GET http://localhost:5000/api/seed-admin
```
Admin credentials: `admin@wert.de` / `Admin@123`

**Seed sample properties:**
```
GET http://localhost:5000/api/properties/seed
```

---

### Frontend Setup

```bash
cd hausverwaltung/frontend
npm install
npm start
```

Frontend runs on: **http://localhost:3000**

---

## 📁 Frontend Pages

| Route | Page |
|-------|------|
| `/` | Home Page |
| `/company` | Company / Team |
| `/services` | Services |
| `/objects` | Properties |
| `/contact` | Contact |
| `/bvi` | BVI Association |
| `/vdiv` | VDIV Association |
| `/forms/damage` | Damage Report Form |
| `/forms/key` | Key Order Form |
| `/forms/tenant-change` | Tenant Change Form |
| `/login` | Login |
| `/portal` | Customer Portal |
| `/admin` | Admin Dashboard |
| `/impressum` | Legal - Imprint |
| `/datenschutz` | Legal - Privacy Policy |

---

## 🔧 Backend API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/auth/admin/stats` | Admin dashboard stats |
| GET | `/api/auth/admin/users` | List all users |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/contact` | Get all contacts (admin) |
| POST | `/api/forms/damage` | Submit damage report |
| POST | `/api/forms/key` | Submit key order |
| POST | `/api/forms/tenant-change` | Submit tenant change |
| GET | `/api/properties` | Get all properties |
| GET | `/api/properties/seed` | Seed sample properties |
| GET | `/api/health` | Health check |

---

## 🌐 Language Support
The website supports **English** and **German** via the language toggle in the navbar.

---

## 💬 Chatbot
The chatbot (bottom-right floating button) currently uses simulated auto-replies. To connect it to a real backend, implement a WebSocket or polling endpoint and update `Chatbot.jsx`.

## 🍪 Cookie Consent
Cookie preferences are stored in `localStorage` under the key `wert_cookie_consent`. The app fires a `cookieConsentSet` custom event when consent is saved — hook into this in your analytics scripts.

Vercel deployment update