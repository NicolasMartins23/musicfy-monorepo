// ── Retornos reais da API ────────────────────────────────

export interface Artist {
  id: number
  name: string
}

export interface Album {
  id: number
  name: string
  artist_id: number
  release_date: string
}

export interface Song {
  id: number
  name: string
  position: number
  is_single: number
  duration_seconds: number
  album_id: number
  [key: string]: unknown
}


// Album/:id/songs
export interface AlbumSongApi {
  artist: string
  album: string
  release_date: string
  position: number
  name: string
  is_single: number
  duration_seconds: number
}


// Artist/:id/songs
export interface ArtistSongsApi {
  artist: string
  album: string
  name: string
  is_single: number
  duration_seconds: number
}

// ── Payloads de escrita — seguindo exatamente o padrão da API ──

export interface ArtistCreate {
  name: string
}

export interface AlbumCreate {
  name: string
  artistId: number        // camelCase conforme API
  releaseDate: string     // YYYY-MM-DD
}

export interface SongCreate {
  name: string
  albumId: number         // camelCase conforme API
  position?: number
  isSingle?: boolean
  duration: string        // hh:mm:ss
}

// ── Views de componentes ───────────────────

export interface SongView extends Song {
  albumName: string
  artistName: string
  artistId: number
  durationFormatted: string
}

export interface AlbumView extends Album {
  artistName: string
  releaseDateFormatted: string
  songs: SongView[]
}

export interface AlbumCardSong {
  id?: number | string
  position: number
  name: string
  isSingle: boolean
  durationFormatted: string
}

export interface AlbumCardData {
  id?: number
  name: string
  artistName: string
  releaseDateFormatted: string
  songs: AlbumCardSong[]
}

export interface SongRowData {
  id?: number | string
  name: string
  artistName: string
  albumName: string
  isSingle: boolean
  durationFormatted: string
}

// ── Filtros de query ─────────────────────────────────────

export interface AlbumFilters {
  id?: number
  artist_id?: number
  date_min?: string
  date_max?: string
}

export interface SongFilters {
  id?: number
  album_id?: number
  artist_id?: number
  duration_min?: string
  duration_max?: string
  is_single?: boolean
}
