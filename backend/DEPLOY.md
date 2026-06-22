# WERT Hausverwaltung — Deploy Guide (Backend + MongoDB)

Your app = **frontend** (React, on Vercel) + **backend** (this Express API).
MongoDB connects to the **backend**, and the frontend calls the backend over HTTP.

## STEP 1 — MongoDB Atlas (the #1 cause of "database connection" errors)
1. Atlas → **Network Access** → **Add IP Address** → **Allow access from anywhere** (`0.0.0.0/0`).
   Cloud hosts use changing IPs; without this the connection times out.
2. Atlas → **Database Access** → confirm user `wertproperties_db_user` exists with **Read and write** on the DB.
   ⚠️ Your password was shared publicly — **reset it** (Edit user → Edit password) and use the NEW one below.
3. Build your connection string WITH a database name before the `?`:
   `mongodb+srv://wertproperties_db_user:NEW_PASSWORD@wert.zfawce4.mongodb.net/wert?retryWrites=true&w=majority&appName=WERT`
   URL-encode the password if it has special characters (@ : / ? # [ ] etc.).

## STEP 2 — Deploy the backend
### Option A — Vercel (all on Vercel; files for this are already included)
1. Push THIS backend folder to its own GitHub repo.
2. Vercel → New Project → import it. (vercel.json + api/index.js make it a serverless function.)
3. Project → Settings → **Environment Variables** (Production), add:
   - `MONGODB_URI` = your string from Step 1
   - `JWT_SECRET`  = a long random string  (run: `openssl rand -base64 48`)
   - `FRONTEND_URL` = `https://werthausverwaltung.de`   (NO trailing slash)
   - `NODE_ENV` = `production`
   - (optional) `SEED_SECRET` = random string, to use /api/seed-admin
4. Deploy. Note the backend URL, e.g. `https://wert-backend.vercel.app`.
5. Test: open `https://YOUR-BACKEND/api/health` → should return `{"status":"OK"}`.

### Option B — Render (simplest for an always-on Express server)
1. render.com → New → **Web Service** → connect the backend repo.
2. Build: `npm install`   Start: `npm start`
3. Add the same environment variables as above.
4. Deploy → note URL `https://xxxx.onrender.com`.

## STEP 3 — Point the frontend at the backend (CRITICAL)
Create-React-App bakes env vars in **at build time**, so this MUST be set before building.
1. Vercel → your **frontend** project → Settings → Environment Variables (Production):
   - `REACT_APP_API_URL` = `https://YOUR-BACKEND-URL/api`   ← include `/api`
2. **Redeploy the frontend** (Deployments → ⋯ → Redeploy). Setting the var without redeploying does nothing.

## STEP 4 — Domain & admin
- Point `werthausverwaltung.de` at the **frontend** Vercel project (Settings → Domains).
- Create the admin once: open `https://YOUR-BACKEND/api/seed-admin?secret=YOUR_SEED_SECRET`.
  Then log in with `admin@wert.de`. Change this password immediately.

## Quick local test of the DB string
    MONGODB_URI="your-string" node -e "require('mongoose').connect(process.env.MONGODB_URI).then(()=>{console.log('OK');process.exit(0)}).catch(e=>{console.error(e.message);process.exit(1)})"
