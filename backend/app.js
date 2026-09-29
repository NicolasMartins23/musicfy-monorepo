import { Hono } from 'hono';
import { cors } from 'hono/cors';
import apiController from './src/app/1-Apresentacao/Base/ApiController.js';
import albumController from './src/app/1-Apresentacao/AlbumController.js';
import artistController from './src/app/1-Apresentacao/ArtistController.js';
import songController from './src/app/1-Apresentacao/SongController.js';

const app = new Hono();

const configuredOrigins = (process.env.CORS_ORIGIN ?? '*')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

app.use('*', cors({
    origin: origin => {
        if (configuredOrigins.includes('*')) return '*';
        return configuredOrigins.includes(origin) ? origin : '';
    }
}));

app.use('/api/*', async (c, next) => {
    if (c.req.method === 'OPTIONS') return next();

    const configuredSecret = process.env.API_SECRET;

    if (!configuredSecret) {
        console.error('API_SECRET não configurado');
        return c.json({ error: 'API não configurada corretamente' }, 500);
    }

    const authorization = c.req.header('Authorization') ?? '';
    const expected = `Bearer ${configuredSecret}`;

    if (authorization !== expected) {
        return c.json({ error: 'Não autorizado' }, 401);
    }

    return next();
});

app.route('/api/', apiController);
app.route('/api/album/', albumController);
app.route('/api/artist/', artistController);
app.route('/api/song/', songController);

app.notFound(c => c.json({ error: 'Rota não encontrada' }, 404));

export default app;
