import { AlbumRepositorio } from "../3-Infra/AlbumRepositorio.js";
import { Validator } from "./HelperServico.js";
import { Convert } from "./HelperServico.js";


export class AlbumServico {
    constructor(){
        this.repositorio = new AlbumRepositorio();
        this.validator = new Validator();
        this.convert = new Convert();
    }

    async listarAlbum(filtros = {}) {
        if (this.validator.isValidDate(filtros.dateMin)){
            filtros.dateMin = new Date(filtros.dateMin);
        }

        if (this.validator.isValidDate(filtros.dateMax)){
            filtros.dateMax = new Date(filtros.dateMax);
        }

        if (filtros.dateMax != null && filtros.dateMin != null){

            if (filtros.dateMax < filtros.dateMin){
                const msg = `A data máxima deve ser igual ou superior a data mínima.`;
                return { "message": msg };
            }

            var dateInterval = this.convert.convertMsToDay(filtros.dateMax - filtros.dateMin);
            if (dateInterval >= 365) {
                const msg = `O intervalo deve ser no máximo de um ano (365 dias).`;
                return { "message": msg };
            }

        }

        var results = await this.repositorio.selecionarAlbum(filtros) ?? [];

        if (results.length > 0){
            return {
                "itemCount": results.length,
                "data": results
            }
        }
        else{
            const msg = `A consulta não retornou resultados.`;
            return {
                "message": msg,
                "data": results
            };
        }
    }

    async listarAlbumId(id) {
        return await this.repositorio.selecionarAlbumId(id);
    }

    async selectAlbumByArtistId(idArtist) {
        return await this.repositorio.selectAlbumByArtistId(idArtist);
    }

    async selectAlbumSongByAlbumId(idAlbum) {
        return await this.repositorio.selectAlbumSongsByAlbumId(idAlbum);
    }
    
    async createAlbum(data) {
        const name = data.name;
        const artistId = data.artistId;
        const releaseDate = data.releaseDate;
     
        const instanciaCriada = await this.repositorio.createAlbum(name, artistId, releaseDate);

        const msg = "Seu álbum foi inserido com sucesso";
            
        return {
            "message": msg,
            "dataAlbum": instanciaCriada
        }
    }



    async deleteAlbum(id) {
        const instanciaExiste = await this.repositorio.selecionarAlbumId(id);
        
        if (!instanciaExiste) {
            const msg = `Album #${id} não existe no banco`;
            return { "message": msg };
        }

        await this.repositorio.deleteAlbum(id);

        const msg = `Album de id #${instanciaExiste.ID} - ${instanciaExiste.name} removido com sucesso`;
        return { "message": msg };
    }
};