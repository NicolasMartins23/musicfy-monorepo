import { Validator } from "./HelperServico.js";
import { Convert } from "./HelperServico.js";

export class BaseServico {
    constructor() {
        this.validator = new Validator();
        this.convert = new Convert();
    }

    resposta(statusCode, body = null) {
        return { statusCode, body };
    }

    dados(data, { statusCode = 200, message = null, meta = null } = {}) {
        const body = { data };
        if (message) body.message = message;
        if (meta) body.meta = meta;
        return this.resposta(statusCode, body);
    }

    sucesso(data, message = null) {
        return this.dados(data, { message });
    }

    lista(data, message = null) {
        return this.dados(data, {
            message,
            meta: { itemCount: data.length }
        });
    }

    criado(data, message) {
        return this.dados(data, { statusCode: 201, message });
    }

    atualizado(data, message) {
        return this.dados(data, { message });
    }

    removido(message) {
        return this.dados(null, { message });
    }

    erro(message, statusCode, detalhes = null) {
        const body = { error: message };

        if (detalhes) {
            body.detalhes = detalhes;
        }

        return this.resposta(statusCode, body);
    }

    requisicaoInvalida(message, detalhes = null) {
        return this.erro(message, 400, detalhes);
    }

    naoProcessavel(message, detalhes = null) {
        return this.erro(message, 422, detalhes);
    }

    naoEncontrado(message) {
        return this.erro(message, 404);
    }

    conflito(message, detalhes = null) {
        return this.erro(message, 409, detalhes);
    }

    erroInterno(detalhes = null) {
        return this.erro("Erro interno do servidor", 500, detalhes);
    }

    idValido(id) {
        const valor = Number(id);
        return Number.isInteger(valor) && valor > 0;
    }

    async executar(operacao) {
        try {
            return await operacao();
        } catch (error) {
            console.error(error);
            return this.tratarErro(error);
        }
    }

    tratarErro(error) {
        if (error instanceof SyntaxError) {
            return this.requisicaoInvalida("JSON inválido", error.message);
        }

        switch (error?.code) {
            case "ER_DUP_ENTRY":
                return this.conflito("Já existe um registro com esses dados");
            case "ER_DATA_TOO_LONG":
                return this.naoProcessavel("Um dos campos excede o tamanho permitido");
            case "ER_BAD_NULL_ERROR":
                return this.naoProcessavel("Um campo obrigatório não foi informado");
            case "ER_NO_REFERENCED_ROW_2":
                return this.naoProcessavel("O registro relacionado informado não existe");
            default:
                return this.erroInterno();
        }
    }
}
