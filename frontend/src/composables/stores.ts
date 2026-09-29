import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { artistApi, albumApi, songApi } from '@/services/api'
import type {
  Artist, Album, Song,
  AlbumView, SongView,
  AlbumFilters, SongFilters
} from '@/types'

// ── Helpers ──────────────────────────────────────────────

export function formatSeconds(total: number): string {
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

export function secondsToHMS(total: number): string {
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':')
}

function formatDate(iso: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR', { year: 'numeric', month: 'short', day: 'numeric' })
}

// ── Artist Store ─────────────────────────────────────────

export const useArtistStore = defineStore('artist', () => {
  const artists = ref<Artist[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  let fetched = false

  async function fetchAll(force = false) {
    if (fetched && !force) return
    loading.value = true; error.value = null
    try { artists.value = await artistApi.list(); fetched = true }
    catch (e: unknown) { error.value = (e as Error).message }
    finally { loading.value = false }
  }

  function getById(id: number) { return artists.value.find(a => a.id === id) }

  async function create(name: string) {
    const a = await artistApi.create({ name })
    artists.value.push(a)
    return a
  }

  async function update(id: number, name: string) {
    const a = await artistApi.update(id, { name })
    const i = artists.value.findIndex(x => x.id === id)
    if (i !== -1) artists.value[i] = a
    return a
  }

  async function remove(id: number) {
    await artistApi.remove(id)
    artists.value = artists.value.filter(x => x.id !== id)
  }

  return { artists, loading, error, fetchAll, getById, create, update, remove }
})

// ── Album Store ──────────────────────────────────────────

export const useAlbumStore = defineStore('album', () => {
  const albums = ref<Album[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  let fetched = false

  async function fetchAll(filters: AlbumFilters = {}, force = false) {
    const hasFilters = Object.values(filters).some(v => v !== undefined)
    if (fetched && !force && !hasFilters) return
    loading.value = true; error.value = null
    try {
      albums.value = await albumApi.list(filters)
      if (!hasFilters) fetched = true
    } catch (e: unknown) { error.value = (e as Error).message }
    finally { loading.value = false }
  }

  async function fetchByArtist(artistId: number) {
    loading.value = true; error.value = null
    try {
      albums.value = await albumApi.listByArtist(artistId)
    } catch (e: unknown) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  function getById(id: number) { return albums.value.find(a => a.id === id) }
  function getIdsByArtist(artistId: number) {
    return albums.value.filter(a => a.artist_id === artistId).map(a => a.id)
  }

  async function create(data: Parameters<typeof albumApi.create>[0]) {
    const a = await albumApi.create(data)
    albums.value.push(a)
    return a
  }

  async function update(id: number, data: Parameters<typeof albumApi.update>[1]) {
    const a = await albumApi.update(id, data)
    const i = albums.value.findIndex(x => x.id === id)
    if (i !== -1) albums.value[i] = a
    return a
  }

  async function remove(id: number) {
    await albumApi.remove(id)
    albums.value = albums.value.filter(x => x.id !== id)
  }

  return {
    albums, loading, error,
    fetchAll, fetchByArtist,
    getById, getIdsByArtist,
    create, update, remove
  }
})

// ── Song Store ───────────────────────────────────────────

export const useSongStore = defineStore('song', () => {
  const songs = ref<Song[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  let fetched = false

  async function fetchAll(filters: SongFilters = {}, force = false) {
    const hasFilters = Object.values(filters).some(v => v !== undefined)
    if (fetched && !force && !hasFilters) return
    loading.value = true; error.value = null
    try {
      songs.value = await songApi.list(filters)
      if (!hasFilters) fetched = true
    } catch (e: unknown) { error.value = (e as Error).message }
    finally { loading.value = false }
  }

  async function fetchByArtist(artistId: number) {
    loading.value = true; error.value = null
    try {
      songs.value = await songApi.listByArtist(artistId)
    } catch (e: unknown) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function create(data: Parameters<typeof songApi.create>[0]) {
    const s = await songApi.create(data)
    songs.value.push(s)
    return s
  }

  async function update(id: number, data: Parameters<typeof songApi.update>[1]) {
    const s = await songApi.update(id, data)
    const i = songs.value.findIndex(x => x.id === id)
    if (i !== -1) songs.value[i] = s
    return s
  }

  async function remove(id: number) {
    await songApi.remove(id)
    songs.value = songs.value.filter(x => x.id !== id)
  }

  return { songs, loading, error, fetchAll, fetchByArtist, create, update, remove }
})

// ── View Store — joins e filtros client-side ──────────────

export const useViewStore = defineStore('view', () => {
  const artistStore = useArtistStore()
  const albumStore = useAlbumStore()
  const songStore = useSongStore()

  // Cache: artista pesquisado → resultado de singles já buscado na API
  const singlesCache = ref<Map<number, Song[]>>(new Map())
  const singlesLoading = ref(false)

  // Todas as songs com joins resolvidos
  const songsView = computed<SongView[]>(() =>
    songStore.songs.map(s => buildSongView(s))
  )

  function buildSongView(s: Song): SongView {
    const album = albumStore.getById(s.album_id)
    const artist = album ? artistStore.getById(album.artist_id) : undefined
    return {
      ...s,
      albumName: album?.name ?? '—',
      artistName: artist?.name ?? '—',
      artistId: album?.artist_id ?? 0,
      durationFormatted: formatSeconds(s.duration_seconds)
    }
  }

  const albumsView = computed<AlbumView[]>(() =>
    albumStore.albums.map(album => {
      const artist = artistStore.getById(album.artist_id)
      const albumSongs = songStore.songs
        .filter(s => s.album_id === album.id)
        .sort((a, b) => a.position - b.position)
        .map(s => buildSongView(s))
      return {
        ...album,
        artistName: artist?.name ?? '—',
        releaseDateFormatted: formatDate(album.release_date),
        songs: albumSongs
      }
    })
  )

  // Busca singles de um artista:
  // 1. Usa cache se já foi buscado antes
  // 2. Resolve os album_ids do artista client-side
  // 3. Manda is_single=true para a API com artist_id
  async function fetchSinglesByArtist(artistId: number): Promise<SongView[]> {
    if (singlesCache.value.has(artistId)) {
      return singlesCache.value.get(artistId)!.map(s => buildSongView(s))
    }
    singlesLoading.value = true
    try {
      const results = await songApi.list({ artist_id: artistId, is_single: true })
      singlesCache.value.set(artistId, results)
      return results.map(s => buildSongView(s))
    } finally {
      singlesLoading.value = false
    }
  }

  // Filtragem client-side sobre o cache completo
  function filterSongs(opts: {
    artistId?: number
    albumId?: number
    isSingle?: boolean
    search?: string
  }): SongView[] {
    return songsView.value.filter(s => {
      if (opts.artistId && s.artistId !== opts.artistId) return false
      if (opts.albumId && s.album_id !== opts.albumId) return false
      if (opts.isSingle !== undefined && (s.is_single === 1) !== opts.isSingle) return false
      if (opts.search) {
        const q = opts.search.toLowerCase()
        if (!s.name.toLowerCase().includes(q) &&
            !s.albumName.toLowerCase().includes(q) &&
            !s.artistName.toLowerCase().includes(q)) return false
      }
      return true
    })
  }

  async function loadAll() {
    await Promise.all([
      artistStore.fetchAll(),
      albumStore.fetchAll(),
      songStore.fetchAll()
    ])
  }

  return {
    songsView, albumsView, singlesLoading,
    fetchSinglesByArtist, filterSongs, loadAll
  }
})
