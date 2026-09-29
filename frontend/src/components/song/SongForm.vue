<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import AppModal from '@/components/shared/AppModal.vue'
import AppInput from '@/components/shared/AppInput.vue'
import AppSelect from '@/components/shared/AppSelect.vue'
import AppButton from '@/components/shared/AppButton.vue'
import { useAlbumStore, useArtistStore, secondsToHMS } from '@/composables/stores'
import type { SongView, SongCreate } from '@/types'

const props = defineProps<{ open: boolean; editing?: SongView | null }>()
const emit = defineEmits<{ close: []; submit: [SongCreate] }>()

const albumStore = useAlbumStore()
const artistStore = useArtistStore()

const name = ref('')
const albumId = ref<number | ''>('')
const durationInput = ref('')
const position = ref<number>(1)
const isSingle = ref(false)
const errors = ref<Record<string, string>>({})

const albumOptions = computed(() =>
  albumStore.albums.map(a => {
    const artist = artistStore.getById(a.artist_id)
    return { value: a.id, label: `${a.name}${artist ? ` — ${artist.name}` : ''}` }
  })
)

watch(() => props.open, (v) => {
  if (!v) return
  name.value = props.editing?.name ?? ''
  durationInput.value = props.editing ? secondsToHMS(props.editing.duration_seconds) : ''
  position.value = props.editing?.position ?? 1
  isSingle.value = props.editing ? props.editing.is_single === 1 : false
  albumId.value = props.editing?.album_id ?? ''
  errors.value = {}
})

function validate(): boolean {
  errors.value = {}
  if (!name.value.trim()) errors.value.name = 'Nome é obrigatório'
  if (!albumId.value) errors.value.album = 'Álbum é obrigatório'
  if (!durationInput.value) errors.value.duration = 'Duração é obrigatória'
  else if (!/^\d{2}:\d{2}:\d{2}$/.test(durationInput.value))
    errors.value.duration = 'Formato: hh:mm:ss (ex: 00:03:45)'
  return Object.keys(errors.value).length === 0
}

function submit() {
  if (!validate()) return
  // Payload exato esperado pela API
  emit('submit', {
    name: name.value.trim(),
    albumId: Number(albumId.value),
    duration: durationInput.value,
    position: position.value,
    isSingle: isSingle.value
  })
}
</script>

<template>
  <AppModal :open="open" :title="editing ? 'Editar Música' : 'Nova Música'" @close="emit('close')">
    <div class="flex flex-col gap-4">
      <AppInput v-model="name" label="Nome da Música" placeholder="ex: Master of Puppets" :error="errors.name" />
      <AppSelect v-model="albumId" label="Álbum" :options="albumOptions" :error="errors.album">
        <template #default-option>
          <option value="" disabled>Selecione um álbum</option>
        </template>
      </AppSelect>
      <div class="grid grid-cols-2 gap-3">
        <AppInput
          v-model="durationInput"
          label="Duração"
          placeholder="00:04:32"
          :error="errors.duration"
          hint="hh:mm:ss"
        />
        <AppInput v-model.number="position" label="Faixa #" type="number" min="1" />
      </div>
      <label class="flex items-center gap-3 cursor-pointer select-none">
        <input v-model="isSingle" type="checkbox" class="w-4 h-4 rounded bg-surface-overlay border-surface-border accent-violet-500" />
        <span class="text-sm text-text-secondary">Lançado como single</span>
      </label>
      <div class="flex gap-3 justify-end pt-2">
        <AppButton variant="ghost" @click="emit('close')">Cancelar</AppButton>
        <AppButton @click="submit">{{ editing ? 'Salvar' : 'Adicionar' }}</AppButton>
      </div>
    </div>
  </AppModal>
</template>
