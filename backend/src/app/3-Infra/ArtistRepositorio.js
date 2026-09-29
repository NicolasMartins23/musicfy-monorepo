import { BaseRepositorio } from "./Base/BaseRepositorio.js";

export class ArtistRepositorio extends BaseRepositorio {
    async selecionarArtista(filtros = {}) {
    
        const { whereStr, params } = this.createWhere({
            'artist.id IN': filtros.ids,
            'artist.name IN': filtros.name,
        });

        const query = `SELECT * FROM artist${whereStr}`;

        return this.executar(async () => {
            const [rows] = await this.query(query, params);
            return rows;
        });
    }

    async selecionarArtistaId(id) {
        return this.executar(async () => {
            const query = "SELECT * FROM artist WHERE ID = ?";
            const [rows] = await this.query(query, [id]);
            return rows.length > 0 ? rows[0] : null;
        });
    }

    async criarArtista(nome) {
        return this.executar(async () => {
            const query = "INSERT INTO artist (name) VALUES (?)";
            const [result] = await this.query(query, [nome]);
            
            const idCriado = result.insertId;

            return await this.selecionarArtistaId(idCriado);
        });
    }

    async deletarArtistaId(id) {
        return this.executar(async () => {
            const query = "DELETE FROM artist WHERE ID = ?";
            const [result] = await this.query(query, [id]);
            return result;
        });
    }

    async atualizarArtistaId(id, name) {
        return this.executar(async () => {
            const query = "UPDATE artist SET name = ? WHERE ID = ?";
            const [result] = await this.query(query, [name, id]);
            return result;
        });
    }

    async selectArtistSongsById(idArtistaSong) {
        return this.executar(async () => {
            const query =  ` select
            artist.name as artist, 
            album.name as album,
            song.name, 
            song.is_single,
            song.duration_seconds
            from artist 
            inner join album on (artist.id = album.artist_id) 
            inner join song on (album.id = song.album_id) 
            where artist.id = ?
            `
            const [rows] = await this.query(query, [idArtistaSong]);
            return rows.length > 0 ? rows : null; 
        });
    }
}