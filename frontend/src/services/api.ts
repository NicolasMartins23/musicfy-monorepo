import type {
  Artist, ArtistCreate,
  Album, AlbumCreate, AlbumFilters,
  Song, SongCreate, SongFilters,
  AlbumSongApi,
  ArtistSongsApi
} from '@/types'
import { useNotifications } from '@/composables/notifications'

const BASE = (import.meta.env.VITE_API_BASE ?? 'http://localhost:3050/api').replace(/\/$/, '')
const TOKEN = import.meta.env.VITE_API_TOKEN ?? ''

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const notification = useNotifications()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    ...(options.headers as Record<string, string> ?? {})
  }

  let res: Response
  try {
    res = await fetch(`${BASE}${path}`, { ...options, headers })
  } catch {
    const message = 'Não foi possível conectar ao servidor'
    notification.error(message)
    throw new Error(message)
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const message = err?.error ?? err?.message ?? err?.detalhes ?? err?.detail ?? `HTTP ${res.status}`
    notification.error(message)
    throw new Error(message)
  }
  if (res.status === 204) return undefined as T

  const json = await res.json()
  const method = options.method?.toUpperCase() ?? 'GET'
  if (method !== 'GET' && json?.message) {
    notification.success(json.message)
  }
  if (json && typeof json === 'object' && 'data' in json) {
    return json.data as T
  }
  return json as T
}

function toQuery(params: object): string {
  const q = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') q.set(k, String(v))
  }
  const s = q.toString()
  return s ? `?${s}` : ''
}

// ── Artist ───────────────────────────────────────────────
export const artistApi = {
  list: () =>
    request<Artist[]>('/artist/'),
  getArtistSongs: (id: number) =>
    request<ArtistSongsApi[]>(`/artist/${id}/songs/`),
  create: (data: ArtistCreate) =>
    request<Artist>('/artist/create/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<ArtistCreate>) =>
    request<Artist>(`/artist/update/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: number) =>
    request<void>(`/artist/delete/${id}/`, { method: 'DELETE' })
}

// ── Album ────────────────────────────────────────────────
export const albumApi = {
  list: (filters: AlbumFilters = {}) =>
    request<Album[]>(`/album/${toQuery(filters)}`),
  listByArtist: (artistId: number) =>
    request<Album[]>(`/album/artist/${artistId}/`),
  getAlbumSongs: (id: number) =>
    request<AlbumSongApi[]>(`/album/${id}/songs/`),
  create: (data: AlbumCreate) =>
    request<Album>('/album/create/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<AlbumCreate>) =>
    request<Album>(`/album/update/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: number) =>
    request<void>(`/album/delete/${id}/`, { method: 'DELETE' })
}

// ── Song ─────────────────────────────────────────────────
export const songApi = {
  list: (filters: SongFilters = {}) =>
    request<Song[]>(`/song/${toQuery(filters)}`),
  listByArtist: (artistId: number) =>
    request<Song[]>(`/song/?artistId=${artistId}`),
  create: (data: SongCreate) =>
    request<Song>('/song/create/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<SongCreate>) =>
    request<Song>(`/song/update/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: number) =>
    request<void>(`/song/delete/${id}/`, { method: 'DELETE' })
}

// ── Populate ─────────────────────────────────────────────
export const populateApi = {
  run: () => request<Record<string, unknown>>('/populate/', { method: 'POST' })
}
