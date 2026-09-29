<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useArtistStore, useAlbumStore, useSongStore, useViewStore } from '@/composables/stores'
import { populateApi } from '@/services/api'
import AppButton from '@/components/shared/AppButton.vue'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'

const artistStore = useArtistStore()
const albumStore = useAlbumStore()
const songStore = useSongStore()
const viewStore = useViewStore()

const populating = ref(false)
const popMsg = ref('')

const singles = computed(() => songStore.songs.filter(s => s.is_single === 1).length)
const loading = computed(() => artistStore.loading || albumStore.loading || songStore.loading)

onMounted(() => viewStore.loadAll())

async function populate() {
  populating.value = true
  popMsg.value = ''
  try {
    await populateApi.run()
    await viewStore.loadAll()
    popMsg.value = 'Banco populado com sucesso!'
  } catch (e: unknown) {
    popMsg.value = (e as Error).message
  } finally {
    populating.value = false
  }
}
</script>

<template>
  <section>
    <h1 class="font-display font-bold text-2xl text-text-primary mb-1">Visão Geral</h1>
    <p class="text-sm text-text-muted mb-8">Sua biblioteca musical.</p>

    <LoadingSpinner v-if="loading" />

    <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      <div
        v-for="stat in [
          { label: 'Artistas', value: artistStore.artists.length, icon: '🎤' },
          { label: 'Álbuns', value: albumStore.albums.length, icon: '💿' },
          { label: 'Músicas', value: songStore.songs.length, icon: '🎵' },
          { label: 'Singles', value: singles, icon: '🎶' },
        ]"
        :key="stat.label"
        class="bg-surface-raised border border-surface-border rounded-card p-5"
      >
        <div class="text-2xl mb-2">{{ stat.icon }}</div>
        <div class="font-display font-bold text-3xl text-text-primary">{{ stat.value }}</div>
        <div class="text-sm text-text-muted mt-1">{{ stat.label }}</div>
      </div>
    </div>

    <div class="bg-surface-raised border border-surface-border rounded-card p-5">
      <h2 class="font-display font-semibold text-text-primary mb-1">Popular Banco</h2>
      <p class="text-sm text-text-muted mb-4">
        Executa o endpoint
        <code class="font-mono text-accent bg-accent-muted/30 px-1 rounded">/populate/</code>
        para preencher com dados de exemplo.
      </p>
      <div class="flex items-center gap-3">
        <AppButton :loading="populating" @click="populate">Executar Populate</AppButton>
        <span v-if="popMsg" class="text-sm" :class="popMsg.includes('sucesso') ? 'text-green-400' : 'text-red-400'">
          {{ popMsg }}
        </span>
      </div>
    </div>
  </section>
</template>
