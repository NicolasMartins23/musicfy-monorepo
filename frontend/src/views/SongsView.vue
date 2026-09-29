<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSongStore, useViewStore } from '@/composables/stores'
import SongRow from '@/components/song/SongRow.vue'
import SongSearch from '@/components/song/SongSearch.vue'
import SongForm from '@/components/song/SongForm.vue'
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'
import AppButton from '@/components/shared/AppButton.vue'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import type { SongView, SongCreate, SongRowData } from '@/types'

const songStore = useSongStore()
const viewStore = useViewStore()

const showForm = ref(false)
const editing = ref<SongView | null>(null)
const toDelete = ref<SongView | null>(null)
const deleteLoading = ref(false)
const tab = ref<'all' | 'search'>('all')

onMounted(() => viewStore.loadAll())

function songViewToRow(song: SongView): SongRowData {
  return {
    id: song.id,
    name: song.name,
    artistName: song.artistName,
    albumName: song.albumName,
    isSingle: !!song.is_single,
    durationFormatted: song.durationFormatted
  }
}

function openCreate() { editing.value = null; showForm.value = true }
function openEdit(s: SongView) { editing.value = s; showForm.value = true }
function openDelete(s: SongView) { toDelete.value = s }

async function handleSubmit(data: SongCreate) {
  if (editing.value) await songStore.update(editing.value.id, data)
  else await songStore.create(data)

  showForm.value = false
  editing.value = null
}

async function confirmDelete() {
  if (!toDelete.value) return
  deleteLoading.value = true
  try { await songStore.remove(toDelete.value.id) }
  finally { deleteLoading.value = false; toDelete.value = null }
}
</script>

<template>
  <section>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-display font-bold text-2xl text-text-primary">Músicas</h1>
        <p class="text-sm text-text-muted mt-0.5">{{ viewStore.songsView.length }} no total</p>
      </div>

      <AppButton @click="openCreate">Adicionar</AppButton>
    </div>

    <div class="flex gap-1 mb-5 border-b border-surface-border">
      <button
        v-for="t in [{ key: 'all', label: 'Todas' }, { key: 'search', label: 'Busca avançada' }]"
        :key="t.key"
        :class="[
          'px-4 py-2 text-sm font-display font-medium border-b-2 -mb-px transition',
          tab === t.key
            ? 'border-accent text-accent'
            : 'border-transparent text-text-muted hover:text-text-primary'
        ]"
        @click="tab = t.key as 'all' | 'search'"
      >
        {{ t.label }}
      </button>
    </div>

    <template v-if="tab === 'all'">
      <LoadingSpinner v-if="songStore.loading" />

      <div v-else-if="viewStore.songsView.length" class="bg-surface-raised border border-surface-border rounded-card overflow-hidden">
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
                v-for="s in viewStore.songsView"
                :key="s.id"
                :song="songViewToRow(s)"
                @edit="openEdit(s)"
                @delete="openDelete(s)"
              />
            </tbody>
          </table>
        </div>
      </div>

      <EmptyState v-else icon="🎶" message="Nenhuma música ainda." />
    </template>

    <template v-else>
      <SongSearch @edit="openEdit" @delete="openDelete" />
    </template>

    <SongForm
      :open="showForm"
      :editing="editing"
      @close="showForm = false; editing = null"
      @submit="handleSubmit"
    />

    <ConfirmDialog
      :open="!!toDelete"
      :message="`Deletar '${toDelete?.name}'? Essa ação não pode ser desfeita.`"
      :loading="deleteLoading"
      @confirm="confirmDelete"
      @cancel="toDelete = null"
    />
  </section>
</template>