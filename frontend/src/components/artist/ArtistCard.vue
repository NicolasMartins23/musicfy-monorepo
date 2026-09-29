<script setup lang="ts">
import type { Artist } from '@/types'

defineProps<{ artist: Artist }>()
const emit = defineEmits<{ select: [Artist]; edit: [Artist]; delete: [Artist] }>()
</script>

<template>
  <div
    class="group bg-surface-raised border border-surface-border rounded-card p-4 hover:border-accent/40 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
    role="link"
    tabindex="0"
    @click="emit('select', artist)"
    @keydown.enter="emit('select', artist)"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="w-8 h-8 rounded-full bg-accent-muted flex items-center justify-center text-accent text-xs font-display font-bold flex-shrink-0">
            {{ artist.name.charAt(0).toUpperCase() }}
          </span>
          <h3 class="font-display font-semibold text-text-primary truncate">{{ artist.name }}</h3>
        </div>
        
      </div>
      <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          class="p-1.5 rounded-lg hover:bg-surface-overlay text-text-muted hover:text-accent transition"
          title="Edit"
          @click.stop="emit('edit', artist)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
          </svg>
        </button>
        <button
          class="p-1.5 rounded-lg hover:bg-surface-overlay text-text-muted hover:text-red-400 transition"
          title="Delete"
          @click.stop="emit('delete', artist)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
