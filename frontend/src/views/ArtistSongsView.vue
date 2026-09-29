<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { artistApi } from '@/services/api'
import SongRow from '@/components/song/SongRow.vue'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import type { ArtistSongsApi, SongRowData } from '@/types'

const route = useRoute()

const songs = ref<ArtistSongsApi[]>([])
const loading = ref(false)

const artistId = computed(() => Number(route.params.id))

const artistName = computed(() => songs.value[0]?.artist ?? 'Artista')

const songRows = computed<SongRowData[]>(() =>
  songs.value.map((song, index) => ({
    id: index,
    name: song.name,
    artistName: song.artist,
    albumName: song.album,
    isSingle: !!song.is_single,
    durationFormatted: formatDuration(song.duration_seconds)
  }))
)

function formatDuration(seconds: number) {
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${min}:${String(sec).padStart(2, '0')}`
}

async function loadSongs() {
  loading.value = true

  try {
    songs.value = await artistApi.getArtistSongs(artistId.value)
  } finally {
    loading.value = false
  }
}

onMounted(loadSongs)
</script>

<template>
  <section>
    <div class="mb-6">
      <RouterLink
        to="/artists"
        class="text-sm text-text-muted hover:text-accent transition"
      >
        ← Voltar para artistas
      </RouterLink>

      <h1 class="font-display font-bold text-2xl text-text-primary mt-4">
        Músicas de {{ artistName }}
      </h1>

      <p class="text-sm text-text-muted mt-0.5">
        {{ songRows.length }} no total
      </p>
    </div>

    <LoadingSpinner v-if="loading" />

    <div
      v-else-if="songRows.length"
      class="bg-surface-raised border border-surface-border rounded-card overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-surface-border">
              <th class="py-3 px-4 text-left text-xs font-display font-semibold text-text-muted uppercase tracking-wider">
                Título
              </th>
              <th class="py-3 px-4 text-left text-xs font-display font-semibold text-text-muted uppercase tracking-wider">
                Artista
              </th>
              <th class="py-3 px-4 text-left text-xs font-display font-semibold text-text-muted uppercase tracking-wider">
                Álbum
              </th>
              <th class="py-3 px-4 text-left text-xs font-display font-semibold text-text-muted uppercase tracking-wider">
                Duração
              </th>
            </tr>
          </thead>

          <tbody>
            <SongRow
              v-for="song in songRows"
              :key="song.id"
              :song="song"
              :show-actions="false"
            />
          </tbody>
        </table>
      </div>
    </div>

    <EmptyState
      v-else
      icon="🎶"
      message="Nenhuma música encontrada para este artista."
    />
  </section>
</template>