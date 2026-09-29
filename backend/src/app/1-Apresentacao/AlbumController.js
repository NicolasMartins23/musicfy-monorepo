import { Hono } from 'hono';
import { AlbumServico } from '../2-Aplicacao/AlbumServico.js';
import { executarController } from './Base/ControllerHelper.js';

const albumController = new Hono();
const servico = new AlbumServico();

albumController.get('/', (c) =>
    executarController(c, servico, () => servico.listarAlbum({
        ids: c.req.queries('id') ?? null,
        names: c.req.queries('name') ?? null,
        artistIds: c.req.queries('artist_id') ?? null,
        dateMin: c.req.query('date_min') ?? null,
        dateMax: c.req.query('date_max') ?? null
    }))
);

albumController.get(':id/', (c) =>
    executarController(c, servico, () => servico.listarAlbumId(c.req.param('id')))
);

albumController.get(':id/songs/', (c) =>
    executarController(c, servico, () =>
        servico.selectAlbumSongByAlbumId(c.req.param('id'))
    )
);

albumController.get('artist/:idArtist/', (c) =>
    executarController(c, servico, () =>
        servico.selectAlbumByArtistId(c.req.param('idArtist'))
    )
);

albumController.post('create/', (c) =>
    executarController(c, servico, async () => servico.createAlbum(await c.req.json()))
);

albumController.put('update/:id/', (c) =>
    executarController(c, servico, async () =>
        servico.updateAlbum(c.req.param('id'), await c.req.json())
    )
);

albumController.delete('delete/:id/', (c) =>
    executarController(c, servico, () => servico.deleteAlbum(c.req.param('id')))
);

export default albumController;
