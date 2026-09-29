import { Hono } from 'hono';

const apiController = new Hono();


apiController.get('status/', (c) => {
    try {
        return c.json({"status": "Ok"});
    } catch (error) {
        console.error(error);
        return c.json({ error: "Erro ao buscar o status", detalhes: error.message }, 500);
    }
});


export default apiController;
