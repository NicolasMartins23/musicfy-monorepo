<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useArtistStore, useAlbumStore, useViewStore } from '@/composables/stores'
import SongRow from '@/components/song/SongRow.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import type { SongView } from '@/types'

const emit = defineEmits<{ edit: [SongView]; delete: [SongView] }>()

const artistStore = useArtistStore()
const albumStore = useAlbumStore()
const viewStore = useViewStore()

const searchText = ref('')
const selectedArtistId = ref<number | ''>('')
const selectedAlbumId = ref<number | ''>('')
const onlySingles = ref(false)
const singlesResult = ref<SongView[]>([])
const mode = ref<'all' | 'singles'>('all')

// Álbuns filtrados pelo artista selecionado
const filteredAlbumOptions = computed(() => {
  const albums = selectedArtistId.value
    ? albumStore.albums.filter(a => a.artist_id === Number(selectedArtistId.value))
    : albumStore.albums
  return albums.map(a => ({ value: a.id, label: a.name }))
})

// Reseta o álbum se trocar o artista
watch(selectedArtistId, () => { selectedAlbumId.value = '' })

// Resultado de busca client-side (cache completo)
const localResults = computed(() =>
  viewStore.filterSongs({
    artistId: selectedArtistId.value ? Number(selectedArtistId.value) : undefined,
    albumId: selectedAlbumId.value ? Number(selectedAlbumId.value) : undefined,
    isSingle: onlySingles.value ? true : undefined,
    search: searchText.value || undefined
  })
)

// Busca singles via API com cache por artista
async function searchSingles() {
  if (!selectedArtistId.value) return
  mode.value = 'singles'
  singlesResult.value = await viewStore.fetchSinglesByArtist(Number(selectedArtistId.value))
}

function clearFilters() {
  searchText.value = ''
  selectedArtistId.value = ''
  selectedAlbumId.value = ''
  onlySingles.value = false
  mode.value = 'all'
  singlesResult.value = []
}

const hasFilters = computed(() =>
  !!searchText.value || !!selectedArtistId.value || !!selectedAlbumId.value || onlySingles.value
)

const displayedSongs = computed<SongView[]>(() =>
  mode.value === 'singles' ? singlesResult.value : localResults.value
)

const artistOptions = computed(() =>
  artistStore.artists.map(a => ({ value: a.id, label: a.name }))
)
</script>

<template>
  <div class="space-y-4">
    <!-- Barra de filtros -->
    <div class="bg-surface-raised border border-surface-border rounded-card p-4 space-y-3">
      <!-- Linha 1: texto + singles toggle -->
      <div class="flex gap-3 items-center">
        <div class="relative flex-1">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
          </svg>
          <input
            v-model="searchText"
            type="text"
            placeholder="Buscar por nome, álbum ou artista..."
            class="w-full bg-surface-overlay border border-surface-border rounded-lg pl-9 pr-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
            @input="mode = 'all'"
          />
        </div>
        <label class="flex items-center gap-2 cursor-pointer select-none flex-shrink-0">
          <input
            v-model="onlySingles"
            type="checkbox"
            class="w-4 h-4 rounded accent-violet-500"
            @change="mode = 'all'"
          />
          <span class="text-sm text-text-secondary">Singles</span>
        </label>
      </div>

      <!-- Linha 2: selects + botões -->
      <div class="flex flex-wrap gap-2">
        <!-- Select artista -->
        <select
          v-model="selectedArtistId"
          class="bg-surface-overlay border border-surface-border rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent transition flex-1 min-w-36"
          @change="mode = 'all'"
        >
          <option value="">Todos os artistas</option>
          <option v-for="a in artistOptions" :key="a.value" :value="a.value">{{ a.label }}</option>
        </select>

        <!-- Select álbum (depende do artista) -->
        <select
          v-model="selectedAlbumId"
          class="bg-surface-overlay border border-surface-border rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent transition flex-1 min-w-36"
          @change="mode = 'all'"
        >
          <option value="">Todos os álbuns</option>
          <option v-for="a in filteredAlbumOptions" :key="a.value" :value="a.value">{{ a.label }}</option>
        </select>

        <!-- Busca singles do artista via API -->
        <button
          :disabled="!selectedArtistId || viewStore.singlesLoading"
          class="flex items-center gap-2 px-3 py-1.5 text-sm font-display rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          title="Busca singles do artista selecionado via API (com cache)"
          @click="searchSingles"
        >
          <span v-if="viewStore.singlesLoading" class="w-3.5 h-3.5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          Singles do artista
        </button>

        <!-- Limpar -->
        <button
          v-if="hasFilters || mode === 'singles'"
          class="px-3 py-1.5 text-sm text-text-muted hover:text-text-primary hover:bg-surface-overlay rounded-lg transition flex-shrink-0"
          @click="clearFilters"
        >
          Limpar
        </button>
      </div>

      <!-- Badge de contexto -->
      <div v-if="mode === 'singles' && selectedArtistId" class="flex items-center gap-2">
        <span class="text-xs bg-accent/10 text-accent border border-accent/20 rounded-full px-2.5 py-0.5 font-mono">
          singles via API · {{ artistStore.getById(Number(selectedArtistId))?.name }}
          · cache ativo
        </span>
      </div>
    </div>

    <!-- Resultado -->
    <div v-if="displayedSongs.length" class="bg-surface-raised border border-surface-border rounded-card overflow-hidden">
      <div class="px-4 py-2.5 border-b border-surface-border flex items-center justify-between">
        <span class="text-xs text-text-muted">{{ displayedSongs.length }} resultado{{ displayedSongs.length !== 1 ? 's' : '' }}</span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-surface-border">
              <th class="py-3 px-4 text-left text-xs font-display font-semibold text-text-muted uppercase tracking-wider">Título</th>
              <th class="py-3 px-4 text-left text-xs font-display font-semibold text-text-muted uppercase tracking-wider">Artista</th>
              <th class="py-3 px-4 text-left text-xs font-display font-semibold text-text-muted uppercase tracking-wider">Álbum</th>
              <th class="py-3 px-4 text-left text-xs font-display font-semibold text-text-muted uppercase tracking-wider">Duração</th>
              <th class="py-3 px-4 w-20" />
            </tr>
          </thead>
          <tbody>
            <SongRow
              v-for="s in displayedSongs"
              :key="s.id"
              :song="{ ...s, isSingle: !!s.is_single }"
              @edit="emit('edit', s)"
              @delete="emit('delete', s)"
            />
          </tbody>
        </table>
      </div>
    </div>

    <EmptyState v-else-if="hasFilters || mode === 'singles'" icon="🔍" message="Nenhum resultado para esses filtros." />
  </div>
</template>
