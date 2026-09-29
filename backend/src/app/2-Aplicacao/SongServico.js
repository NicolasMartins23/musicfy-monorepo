import { SongRepositorio } from "../3-Infra/SongRepositorio.js";
import { BaseServico } from "./BaseServico.js";

export class SongServico extends BaseServico {
    constructor() {
        super();
        this.repositorio = new SongRepositorio();
    }

    async listarSong(filtros = {}) {
        return this.executar(async () => {
            const validacao = this.validarFiltros(filtros);
            if (validacao) return validacao;

            const results = await this.repositorio.selecionarSong(filtros) ?? [];
            return this.lista(
                results,
                results.length === 0 ? "A consulta não retornou resultados" : null
            );
        });
    }

    async listarSongId(id) {
        return this.executar(async () => {
            if (!this.idValido(id)) {
                return this.requisicaoInvalida("O id da música deve ser um número inteiro positivo");
            }
            const song = await this.repositorio.selecionarSongId(id);
            if (!song) return this.naoEncontrado(`Música #${id} não encontrada`);
            return this.sucesso(song);
        });
    }

    async apagarSongId(id) {
        return this.executar(async () => {
            if (!this.idValido(id)) {
                return this.requisicaoInvalida("O id da música deve ser um número inteiro positivo");
            }
            const existente = await this.repositorio.selecionarSongId(id);
            if (!existente) return this.naoEncontrado(`Música #${id} não encontrada`);

            await this.repositorio.deletarSongId(id);
            return this.removido(`Música #${id} - ${existente.name} removida com sucesso`);
        });
    }

    async criarSong(data) {
        return this.executar(async () => {
            const validacao = this.validarSong(data);
            if (validacao) return validacao;

            const conflito = await this.repositorio.selecionarSongAlbumIdPosition(
                data.position,
                data.albumId
            );
            if (conflito) {
                return this.conflito("Já existe uma música nesta posição do álbum");
            }

            const song = await this.repositorio.criarSong(
                data.name.trim(),
                data.position,
                this.singleToInt(data.isSingle),
                this.durationToSeconds(data.duration),
                data.albumId
            );
            return this.criado(song, "Música inserida com sucesso");
        });
    }

    async atualizarSong(id, data) {
        return this.executar(async () => {
            if (!this.idValido(id)) {
                return this.requisicaoInvalida("O id da música deve ser um número inteiro positivo");
            }
            const validacao = this.validarSong(data);
            if (validacao) return validacao;

            const existente = await this.repositorio.selecionarSongId(id);
            if (!existente) return this.naoEncontrado(`Música #${id} não encontrada`);

            const conflito = await this.repositorio.selecionarSongAlbumIdPosition(
                data.position,
                data.albumId
            );
            if (conflito && Number(conflito.id) !== Number(id)) {
                return this.conflito("Já existe outra música nesta posição do álbum");
            }

            const song = await this.repositorio.atualizarSongId(
                id,
                data.name.trim(),
                data.position,
                this.singleToInt(data.isSingle),
                this.durationToSeconds(data.duration),
                data.albumId
            );
            return this.atualizado(song, `Música #${id} atualizada com sucesso`);
        });
    }

    validarSong(data) {
        if (typeof data?.name !== "string" || !data.name.trim()) {
            return this.naoProcessavel("O nome da música é obrigatório");
        }
        if (data.name.trim().length > 50) {
            return this.naoProcessavel("O nome da música deve ter no máximo 50 caracteres");
        }
        if (!this.idValido(data.albumId)) {
            return this.naoProcessavel("O álbum da música é obrigatório");
        }
        if (!Number.isInteger(Number(data.position)) || Number(data.position) < 1) {
            return this.naoProcessavel("A posição deve ser um número inteiro positivo");
        }
        if (!this.durationValida(data.duration)) {
            return this.naoProcessavel("A duração deve usar o formato hh:mm:ss");
        }
        if (typeof data.isSingle !== "boolean" && data.isSingle !== 0 && data.isSingle !== 1) {
            return this.naoProcessavel("O campo isSingle deve ser verdadeiro ou falso");
        }
        return null;
    }

    validarFiltros(filtros) {
        for (const campo of ["durationMin", "durationMax"]) {
            if (filtros[campo] != null) {
                const valor = Number(filtros[campo]);
                if (!Number.isFinite(valor) || valor < 0) {
                    return this.requisicaoInvalida("Os filtros de duração devem ser numéricos");
                }
                filtros[campo] = valor;
            }
        }
        if (filtros.durationMax != null && filtros.durationMin != null &&
            filtros.durationMax < filtros.durationMin) {
            return this.requisicaoInvalida(
                "A duração máxima deve ser igual ou superior à duração mínima"
            );
        }
        if (filtros.isSingle != null) {
            try {
                filtros.isSingle = this.convert.convertStringBoolToInt(filtros.isSingle);
            } catch {
                return this.requisicaoInvalida("O filtro is_single deve ser true ou false");
            }
        }
        return null;
    }

    durationValida(duration) {
        if (typeof duration === "number") return Number.isInteger(duration) && duration >= 0;
        if (!/^\d{2}:\d{2}:\d{2}$/.test(String(duration))) return false;
        const [, minutes, seconds] = String(duration).split(":").map(Number);
        return minutes < 60 && seconds < 60;
    }

    durationToSeconds(duration) {
        if (typeof duration === "number") return duration;
        const [hours, minutes, seconds] = duration.split(":").map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    }

    singleToInt(value) {
        return value === true || value === 1 ? 1 : 0;
    }
}
