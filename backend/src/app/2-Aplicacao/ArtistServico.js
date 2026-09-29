import { ArtistRepositorio } from "../3-Infra/ArtistRepositorio.js";
import { BaseServico } from "./BaseServico.js";

export class ArtistServico extends BaseServico {
    constructor(){
        super();
        this.repositorio = new ArtistRepositorio();
    }

    async listarArtista(filtros) {
        return this.executar(async () => {
            const artistas = await this.repositorio.selecionarArtista(filtros);
            return this.lista(artistas);
        });
    }
    
    async listarArtistaId(id) {
        return this.executar(async () => {
            if (!this.idValido(id)) {
                return this.requisicaoInvalida("O id do artista deve ser um número inteiro positivo");
            }

            const artista = await this.repositorio.selecionarArtistaId(id);
            if (!artista) {
                return this.naoEncontrado(`Artista #${id} não encontrado`);
            }

            return this.sucesso(artista);
        });
    }

    async criarArtista(data) {
        return this.executar(async () => {
            const validacao = this.validarNome(data?.name);
            if (validacao) return validacao;

            const name = data.name.trim();
            const instanciaCriada = await this.repositorio.criarArtista(name);

            return this.criado(instanciaCriada, `O artista ${name} foi criado com sucesso`);
        });
    }

    async apagarArtistaId(id) {
        return this.executar(async () => {
            if (!this.idValido(id)) {
                return this.requisicaoInvalida("O id do artista deve ser um número inteiro positivo");
            }

            const artistaExiste = await this.repositorio.selecionarArtistaId(id);
            if (!artistaExiste) {
                return this.naoEncontrado(`Artista #${id} não encontrado`);
            }

            await this.repositorio.deletarArtistaId(id);

            const idArtista = artistaExiste.ID || artistaExiste.id;
            return this.removido(
                `Artista de id #${idArtista} - ${artistaExiste.name} removido com sucesso`
            );
        });
    }

    async atualizarArtista(id, body) {
        return this.executar(async () => {
            if (!this.idValido(id)) {
                return this.requisicaoInvalida("O id do artista deve ser um número inteiro positivo");
            }

            const validacao = this.validarNome(body?.name);
            if (validacao) return validacao;

            const artistaExiste = await this.repositorio.selecionarArtistaId(id);
            if (!artistaExiste) {
                return this.naoEncontrado(`Artista #${id} não encontrado`);
            }

            const name = body.name.trim();
            await this.repositorio.atualizarArtistaId(id, name);
            const artistaAtualizado = await this.repositorio.selecionarArtistaId(id);

            return this.atualizado(
                artistaAtualizado,
                `Artista de id #${artistaAtualizado.id} atualizado para ${name}`
            );
        });
    }

    async selectArtistSongs(idSongArtist) {
        return this.executar(async () => {
            if (!this.idValido(idSongArtist)) {
                return this.requisicaoInvalida("O id do artista deve ser um número inteiro positivo");
            }

            const artista = await this.repositorio.selecionarArtistaId(idSongArtist);
            if (!artista) {
                return this.naoEncontrado(`Artista #${idSongArtist} não encontrado`);
            }

            const songs = await this.repositorio.selectArtistSongsById(idSongArtist);
            return this.sucesso(songs ?? []);
        });
    }

    validarNome(name) {
        if (typeof name !== "string" || !name.trim()) {
            return this.naoProcessavel("O nome do artista é obrigatório");
        }

        if (name.trim().length > 50) {
            return this.naoProcessavel("O nome do artista deve ter no máximo 50 caracteres");
        }

        return null;
    }
}
