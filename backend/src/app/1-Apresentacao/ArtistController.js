import { Hono } from 'hono';
import { ArtistServico } from '../2-Aplicacao/ArtistServico.js';
import { executarController } from './Base/ControllerHelper.js';

const artistController = new Hono();
const servico = new ArtistServico();

artistController.get('/', async (c) => {
    return executarController(c, servico, async () => {
        const idList = c.req.queries('id')
        const nameList = c.req.queries('name')

        const filtros = {
            "ids": idList,
            "names": nameList
        }

        return servico.listarArtista(filtros);
    });
});

artistController.get(':id/', async (c) => {
    return executarController(c, servico, async () => {
        const id = c.req.param('id');
        return servico.listarArtistaId(id);
    });
});

artistController.post('create/', async (c) => {
    return executarController(c, servico, async () => {
        const data = await c.req.json();
        return servico.criarArtista(data);
    });
});

artistController.delete('delete/:id/', async (c) => {
    return executarController(c, servico, async () => {
        const id = c.req.param('id');
        return servico.apagarArtistaId(id);
    });
});

artistController.put('update/:id/', async (c) => {
    return executarController(c, servico, async () => {
        const id = c.req.param('id');
        const body = await c.req.json();
        return servico.atualizarArtista(id, body);
    });
});

artistController.get(':idArtist/songs/', async (c) => {
    return executarController(c, servico, async () => {
        const idArtistBatatao = c.req.param('idArtist');
        return servico.selectArtistSongs(idArtistBatatao);
    });
});

export default artistController;
