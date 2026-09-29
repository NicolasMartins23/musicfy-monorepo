import { BaseRepositorio } from "./Base/BaseRepositorio.js";

export class AlbumRepositorio extends BaseRepositorio {

    async selecionarAlbum(filtros = {}) {
    
        const { whereStr, params } = this.createWhere({
            'album.id IN': filtros.ids,
            'album.name IN': filtros.names,
            'album.artist_id IN': filtros.artistIds,
            'album.release_date >=': filtros.dateMin,
            'album.release_date <=': filtros.dateMax
        });

        const query = `SELECT * FROM album ${whereStr}`;

        return this.executar(async () => {
            const [rows] = await this.query(query, params);
            return rows;
        });
    }
    

    async selecionarAlbumId(id) {
        return this.executar(async () => {
            const query = "SELECT * FROM album WHERE ID = ?";
            const [rows] = await this.query(query, [id]);
            return rows.length > 0 ? rows[0] : null; 
        });
    }

    async selectAlbumByArtistId(idArtist) {
        return this.executar(async () => {
            const query = "select album.* from artist inner join album on (artist.id = album.artist_id) where artist.id = ?";
            const [rows] = await this.query(query, [idArtist]);
            return rows.length > 0 ? rows : null; 
        });
    }

    async selectAlbumSongsByAlbumId(idAlbum) {
        return this.executar(async () => {
            const query =  ` select
            artist.name as artist, 
            album.name as album,
            album.release_date, 
            song.position, 
            song.name, 
            song.is_single,
            song.duration_seconds
            from artist 
            inner join album on (artist.id = album.artist_id) 
            inner join song on (album.id = song.album_id) 
            where album.id = ?
            `
            const [rows] = await this.query(query, [idAlbum]);
            return rows.length > 0 ? rows : null; 
        });
    }


    async createAlbum(name, artistId, releaseDate) {
        return this.executar(async () => {
            const query = "INSERT INTO album (name, artist_id, release_date) VALUES (?, ?, ?)";
            const [result] = await this.query(query, [name, artistId, releaseDate]);
            
            const idCriado = result.insertId; 
            
            return await this.selecionarAlbumId(idCriado); 
        });
    }

    async deleteAlbum(id) {
        return this.executar(async () => {
            const query = "DELETE FROM album WHERE ID = ?";
            const [result] = await this.query(query, [id]);
            return result;
        });
    }

    async updateAlbum(id, name, artistId, releaseDate) {
        return this.executar(async () => {
            const query = "UPDATE album SET name = ?, artist_id = ?, release_date = ? WHERE ID = ?";
            await this.query(query, [name, artistId, releaseDate, id]);
            return await this.selecionarAlbumId(id);
        });
    }
}
