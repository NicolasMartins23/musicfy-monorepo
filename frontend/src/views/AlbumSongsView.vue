<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { albumApi } from '@/services/api'
import AlbumCard from '@/components/album/AlbumCard.vue'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import type { AlbumSongApi, AlbumCardData } from '@/types'

const route = useRoute()

const songs = ref<AlbumSongApi[]>([])
const loading = ref(false)

const albumId = computed(() => Number(route.params.id))

const albumCard = computed<AlbumCardData | null>(() => {
  if (!songs.value.length) return null

  return {
    name: songs.value[0].album,
    artistName: songs.value[0].artist,
    releaseDateFormatted: formatDate(songs.value[0].release_date),
    songs: songs.value.map(song => ({
      id: song.position,
      position: song.position,
      name: song.name,
      isSingle: !!song.is_single,
      durationFormatted: formatDuration(song.duration_seconds)
    }))
  }
})

function formatDuration(seconds: number) {
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${min}:${String(sec).padStart(2, '0')}`
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(date))
}

async function loadSongs() {
  loading.value = true

  try {
    songs.value = await albumApi.getAlbumSongs(albumId.value)
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
        to="/albums"
        class="text-sm text-text-muted hover:text-accent transition"
      >
        ← Voltar para álbuns
      </RouterLink>
    </div>

    <LoadingSpinner v-if="loading" />

    <AlbumCard
      v-else-if="albumCard"
      :album="albumCard"
      variant="full"
      :show-actions="false"
    />

    <EmptyState
      v-else
      icon="🎵"
      message="Nenhuma música encontrada para este álbum."
    />
  </section>
</template>