<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useArtistStore } from '@/composables/stores'
import ArtistCard from '@/components/artist/ArtistCard.vue'
import ArtistForm from '@/components/artist/ArtistForm.vue'
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'
import AppButton from '@/components/shared/AppButton.vue'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import type { Artist } from '@/types'

const store = useArtistStore()
const router = useRouter()

const showForm = ref(false)
const editing = ref<Artist | null>(null)
const toDelete = ref<Artist | null>(null)
const deleteLoading = ref(false)

onMounted(() => store.fetchAll())

function openCreate() { editing.value = null; showForm.value = true }
function openEdit(a: Artist) { editing.value = a; showForm.value = true }
function openDelete(a: Artist) { toDelete.value = a }
function openAlbums(a: Artist) {
  router.push({ name: 'albums', query: { artistId: String(a.id) } })
}

async function handleSubmit(data: { name: string }) {
  if (editing.value) {
    await store.update(editing.value.id, data.name)
  } else {
    await store.create(data.name)
  }
  showForm.value = false
}

async function confirmDelete() {
  if (!toDelete.value) return
  deleteLoading.value = true
  try { await store.remove(toDelete.value.id) }
  finally { deleteLoading.value = false; toDelete.value = null }
}
</script>

<template>
  <section>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-display font-bold text-2xl text-text-primary">Artists</h1>
        <p class="text-sm text-text-muted mt-0.5">{{ store.artists.length }} total</p>
      </div>
      <AppButton @click="openCreate">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        New Artist
      </AppButton>
    </div>

    <LoadingSpinner v-if="store.loading" />

    <div v-else-if="store.artists.length" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <ArtistCard
        v-for="a in store.artists"
        :key="a.id"
        :artist="a"
        @select="openAlbums"
        @edit="openEdit"
        @delete="openDelete"
      />
    </div>

    <EmptyState v-else icon="🎤" message="No artists yet. Add the first one!" />

    <ArtistForm
      :open="showForm"
      :editing="editing"
      @close="showForm = false"
      @submit="handleSubmit"
    />

    <ConfirmDialog
      :open="!!toDelete"
      :message="`Delete '${toDelete?.name}'? This cannot be undone.`"
      :loading="deleteLoading"
      @confirm="confirmDelete"
      @cancel="toDelete = null"
    />
  </section>
</template>
