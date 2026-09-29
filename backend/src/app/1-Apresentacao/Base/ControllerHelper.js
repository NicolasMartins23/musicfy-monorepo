export async function executarController(c, servico, operacao) {
    try {
        const response = await operacao();
        return c.json(response.body, response.statusCode);
    } catch (error) {
        const response = servico.tratarErro(error);
        return c.json(response.body, response.statusCode);
    }
}
