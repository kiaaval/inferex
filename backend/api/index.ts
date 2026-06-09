import app from '../src/server.js';

// Vercel invokes a function's default export as its (req, res) handler. An Express
// app *is* such a handler, so we hand the whole app over and let its own routing
// resolve the request. vercel.json rewrites every path to this function.
export default app;
