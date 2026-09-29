<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import {
  useAlbumStore,
  useArtistStore,
  useSongStore,
  useViewStore
} from '@/composables/stores'
import AlbumCard from '@/components/album/AlbumCard.vue'
import AlbumForm from '@/components/album/AlbumForm.vue'
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'
import AppButton from '@/components/shared/AppButton.vue'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import type { AlbumView, AlbumCreate, AlbumCardData } from '@/types'

const albumStore = useAlbumStore()
const artistStore = useArtistStore()
const songStore = useSongStore()
const viewStore = useViewStore()
const route = useRoute()
const router = useRouter()

const showForm = ref(false)
const editing = ref<AlbumView | null>(null)
const toDelete = ref<AlbumView | null>(null)
const deleteLoading = ref(false)

const artistId = computed(() => {
  const id = Number(route.query.artistId)
  return Number.isInteger(id) && id > 0 ? id : null
})

const selectedArtist = computed(() =>
  artistId.value ? artistStore.getById(artistId.value) : null
)

const loading = computed(() => albumStore.loading || songStore.loading)

async function loadContent() {
  if (artistId.value) {
    await Promise.all([
      artistStore.fetchAll(),
      albumStore.fetchByArtist(artistId.value),
      songStore.fetchByArtist(artistId.value)
    ])
    return
  }

  await Promise.all([
    artistStore.fetchAll(),
    albumStore.fetchAll({}, true),
    songStore.fetchAll({}, true)
  ])
}

watch(() => route.query.artistId, loadContent, { immediate: true })

function albumViewToCard(album: AlbumView): AlbumCardData {
  return {
    id: album.id,
    name: album.name,
    artistName: album.artistName,
    releaseDateFormatted: album.releaseDateFormatted,
    songs: album.songs.map(song => ({
      id: song.id,
      position: song.position,
      name: song.name,
      isSingle: !!song.is_single,
      durationFormatted: song.durationFormatted
    }))
  }
}

function openCreate() {
  editing.value = null
  showForm.value = true
}

function openEdit(album: AlbumView) {
  editing.value = album
  showForm.value = true
}

function openDelete(album: AlbumView) {
  toDelete.value = album
}

async function handleSubmit(data: AlbumCreate) {
  if (editing.value) {
    await albumStore.update(editing.value.id, data)
  } else {
    await albumStore.create(data)
  }

  showForm.value = false
  editing.value = null
  await loadContent()
}

async function confirmDelete() {
  if (!toDelete.value) return

  deleteLoading.value = true

  try {
    await albumStore.remove(toDelete.value.id)
  } finally {
    deleteLoading.value = false
    toDelete.value = null
  }
}

function openAlbum(album: AlbumView) {
  router.push({ name: 'album-songs', params: { id: album.id } })
}
</script>

<template>
  <section>
    <div class="flex items-center justify-between mb-6">
      <div>
        <RouterLink
          v-if="artistId"
          to="/artists"
          class="inline-block text-sm text-text-muted hover:text-accent transition mb-2"
        >
          ← Voltar para artistas
        </RouterLink>

        <h1 class="font-display font-bold text-2xl text-text-primary">
          {{ selectedArtist ? `Álbuns de ${selectedArtist.name}` : 'Álbuns' }}
        </h1>

        <p class="text-sm text-text-muted mt-0.5">
          {{ viewStore.albumsView.length }} no total
        </p>
      </div>

      <AppButton @click="openCreate">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Novo Álbum
      </AppButton>
    </div>

    <LoadingSpinner v-if="loading" />

    <div
      v-else-if="viewStore.albumsView.length"
      class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <AlbumCard
        v-for="album in viewStore.albumsView"
        :key="album.id"
        :album="albumViewToCard(album)"
        variant="compact"
        @select="openAlbum(album)"
        @edit="openEdit(album)"
        @delete="openDelete(album)"
      />
    </div>

    <EmptyState
      v-else
      icon="💿"
      message="Nenhum álbum ainda."
    />

    <AlbumForm
      :open="showForm"
      :editing="editing"
      @close="showForm = false; editing = null"
      @submit="handleSubmit"
    />

    <ConfirmDialog
      :open="!!toDelete"
      :message="`Deletar o álbum '${toDelete?.name}'? Essa ação não pode ser desfeita.`"
      :loading="deleteLoading"
      @confirm="confirmDelete"
      @cancel="toDelete = null"
    />
  </section>
</template>
