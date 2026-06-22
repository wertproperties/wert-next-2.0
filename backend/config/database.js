const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  // Fail loudly so a missing environment variable is obvious in the deploy logs
  // instead of silently falling back to hard-coded credentials.
  console.error('❌ MONGODB_URI is not set. Add it to your environment variables.');
}

// --- Serverless-safe connection caching --------------------------------------
// On serverless platforms (Vercel) each request can run in a fresh module scope.
// Without caching, every request opens a NEW connection and you quickly hit the
// Atlas connection limit -> timeouts / "too many connections". We cache the
// connection promise on the Node global so it is reused while a container stays warm.
let cached = global._mongoose;
if (!cached) cached = global._mongoose = { conn: null, promise: null };

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        // Use a real database name. Put it in the URI (e.g. .../wert?...) or set
        // MONGODB_DB. Without this, data silently lands in the "test" database.
        dbName: process.env.MONGODB_DB || 'wert',
        // Fail fast (10s) instead of hanging ~30s when the server is unreachable.
        // An unreachable server is almost always an Atlas IP-whitelist problem.
        serverSelectionTimeoutMS: 10000,
        maxPoolSize: 10, // keep the pool small; serverless wants few connections
      })
      .then((m) => {
        console.log(`✅ MongoDB connected: ${m.connection.host} (db: ${m.connection.name})`);
        return m;
      })
      .catch((err) => {
        cached.promise = null; // allow a retry on the next request
        console.error(`❌ MongoDB connection error: ${err.message}`);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectDB;
