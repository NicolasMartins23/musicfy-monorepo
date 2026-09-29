import { Hono } from 'hono';
import { SongServico } from '../2-Aplicacao/SongServico.js';
import { executarController } from './Base/ControllerHelper.js';

const songController = new Hono();
const servico = new SongServico();

songController.get('/', (c) =>
    executarController(c, servico, () => servico.listarSong({
        ids: c.req.queries('id') ?? null,
        positions: c.req.queries('position') ?? null,
        names: c.req.queries('name') ?? null,
        isSingle: c.req.query('isSingle') ?? null,
        durationMin: c.req.query('durationMin') ?? null,
        durationMax: c.req.query('durationMax') ?? null,
        albumIds: c.req.queries('albumId') ?? null,
        artistIds: c.req.queries('artistId') ?? null
    }))
);

songController.get(':id/', (c) =>
    executarController(c, servico, () => servico.listarSongId(c.req.param('id')))
);

songController.post('create/', (c) =>
    executarController(c, servico, async () => servico.criarSong(await c.req.json()))
);

songController.put('update/:id/', (c) =>
    executarController(c, servico, async () =>
        servico.atualizarSong(c.req.param('id'), await c.req.json())
    )
);

songController.delete('delete/:id/', (c) =>
    executarController(c, servico, () => servico.apagarSongId(c.req.param('id')))
);

export default songController;
