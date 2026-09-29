import { BaseRepositorio } from "./Base/BaseRepositorio.js";

export class SongRepositorio extends BaseRepositorio {

    async selecionarSong(filtros = {}) {
    
        const { whereStr, params } = this.createWhere({
            'song.id IN': filtros.ids,
            'song.position IN': filtros.positions,
            'song.name IN': filtros.names,
            'song.is_single =': filtros.isSingle,
            'song.duration_seconds >=': filtros.durationMin,
            'song.duration_seconds <=': filtros.durationMax,
            'song.album_id IN': filtros.albumIds,
            'album.artist_id IN': filtros.artistIds
        });


        const query = `SELECT song.*
                        FROM song
                        INNER JOIN album ON (album.id = song.album_id)
                        ${whereStr}`;

        return this.executar(async () => {
            const [rows] = await this.query(query, params);
            return rows;
        });
    }

    async selecionarSongId(id) {
        return this.executar(async () => {
            const query = "SELECT * FROM song WHERE ID = ?";
            const [rows] = await this.query(query, [id]);
            return rows.length > 0 ? rows[0] : null;
        });
    }

    async deletarSongId(id) {
        return this.executar(async () => {
            const query = "DELETE FROM song WHERE ID = ?";
            const [result] = await this.query(query, [id]);
            return result;
        });
    }

    async criarSong(name, position, isSingle, durationSeconds, albumId) {
        return this.executar(async () => {
            const query = "INSERT INTO song (name, position, is_single, duration_seconds, album_id) VALUES (?, ?, ?, ?, ?)";
            const [result] = await this.query(query, [name, position, isSingle, durationSeconds, albumId]);
            
            const idCriado = result.insertId;
            
            return await this.selecionarSongId(idCriado);
        });
    }

    async atualizarSongId(id, name, position, isSingle, durationSeconds, albumId) {
        return this.executar(async () => {
            const query = `UPDATE song
                SET name = ?, position = ?, is_single = ?, duration_seconds = ?, album_id = ?
                WHERE ID = ?`;
            await this.query(query, [name, position, isSingle, durationSeconds, albumId, id]);
            return await this.selecionarSongId(id);
        });
    }

    async selecionarSongAlbumIdPosition(position, albumId) {
        return this.executar(async () => {
            const query = "SELECT * FROM song WHERE album_id = ? AND position = ?";
            const [rows] = await this.query(query, [albumId, position]);
            return rows.length > 0 ? rows[0] : null;
        });
    }
}
