// Vercel serverless entry point.
// An Express app is itself a (req, res) handler, so Vercel can invoke it directly.
// vercel.json routes every request to this file; Express then matches the route.
module.exports = require('../server');
