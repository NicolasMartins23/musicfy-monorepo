import { serve } from '@hono/node-server';
import app from './app.js';

const PORT = Number(process.env.PORT ?? 3050);

console.log("Servidor pronto em http://localhost:" + PORT);

serve({
    fetch: app.fetch,
    port: PORT
});
