<script setup lang="ts">
import type { SongRowData } from '@/types'

defineProps<{
  song: SongRowData
  showActions?: boolean
}>()

const emit = defineEmits<{
  edit: []
  delete: []
}>()
</script>

<template>
  <tr class="group border-b border-surface-border hover:bg-surface-overlay/40 transition">
    <td class="py-3 px-4 text-text-primary font-body text-sm">
      <span class="flex items-center gap-2">
        <span
          :class="['w-1.5 h-1.5 rounded-full flex-shrink-0', song.isSingle ? 'bg-accent' : 'bg-transparent']"
          :title="song.isSingle ? 'Single' : ''"
        />
        {{ song.name }}
      </span>
    </td>

    <td class="py-3 px-4 text-text-secondary text-sm">
      {{ song.artistName }}
    </td>

    <td class="py-3 px-4 text-text-secondary text-sm">
      {{ song.albumName }}
    </td>

    <td class="py-3 px-4 text-text-muted font-mono text-xs">
      {{ song.durationFormatted }}
    </td>

    <td v-if="showActions !== false" class="py-3 px-4">
      <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          class="p-1.5 rounded-lg hover:bg-surface-border text-text-muted hover:text-accent transition"
          @click="emit('edit')"
        >
          editar
        </button>

        <button
          class="p-1.5 rounded-lg hover:bg-surface-border text-text-muted hover:text-red-400 transition"
          @click="emit('delete')"
        >
          deletar
        </button>
      </div>
    </td>
  </tr>
</template>