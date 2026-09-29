<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import AppModal from '@/components/shared/AppModal.vue'
import AppInput from '@/components/shared/AppInput.vue'
import AppSelect from '@/components/shared/AppSelect.vue'
import AppButton from '@/components/shared/AppButton.vue'
import { useArtistStore } from '@/composables/stores'
import type { AlbumView, AlbumCreate } from '@/types'

const props = defineProps<{ open: boolean; editing?: AlbumView | null }>()
const emit = defineEmits<{ close: []; submit: [AlbumCreate] }>()

const artistStore = useArtistStore()

const name = ref('')
const artistId = ref<number | ''>('')
const releaseDate = ref('')
const errors = ref<Record<string, string>>({})

const artistOptions = computed(() =>
  artistStore.artists.map(a => ({ value: a.id, label: a.name }))
)

watch(() => props.open, (v) => {
  if (!v) return
  name.value = props.editing?.name ?? ''
  releaseDate.value = props.editing?.release_date?.substring(0, 10) ?? ''
  artistId.value = props.editing?.artist_id ?? ''
  errors.value = {}
})

function validate(): boolean {
  errors.value = {}
  if (!name.value.trim()) errors.value.name = 'Nome é obrigatório'
  if (!artistId.value) errors.value.artist = 'Artista é obrigatório'
  if (!releaseDate.value) errors.value.releaseDate = 'Data de lançamento é obrigatória'
  return Object.keys(errors.value).length === 0
}

function submit() {
  if (!validate()) return
  // Payload exato esperado pela API
  const payload: AlbumCreate = {
    name: name.value.trim(),
    artistId: Number(artistId.value),
    releaseDate: releaseDate.value
  }
  emit('submit', payload)
}
</script>

<template>
  <AppModal :open="open" :title="editing ? 'Editar Álbum' : 'Novo Álbum'" @close="emit('close')">
    <div class="flex flex-col gap-4">
      <AppInput v-model="name" label="Nome do Álbum" placeholder="ex: Ride the Lightning" :error="errors.name" />
      <AppSelect v-model="artistId" label="Artista" :options="artistOptions" :error="errors.artist">
        <template #default-option>
          <option value="" disabled>Selecione um artista</option>
        </template>
      </AppSelect>
      <AppInput v-model="releaseDate" label="Data de Lançamento" type="date" :error="errors.releaseDate" />
      <div class="flex gap-3 justify-end pt-2">
        <AppButton variant="ghost" @click="emit('close')">Cancelar</AppButton>
        <AppButton @click="submit">{{ editing ? 'Salvar' : 'Criar Álbum' }}</AppButton>
      </div>
    </div>
  </AppModal>
</template>
