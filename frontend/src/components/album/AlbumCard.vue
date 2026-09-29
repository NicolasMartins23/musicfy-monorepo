<script setup lang="ts">
export interface AlbumCardSong {
  id?: number | string
  position: number
  name: string
  isSingle: boolean
  durationFormatted: string
}

export interface AlbumCardData {
  id?: number
  name: string
  artistName: string
  releaseDateFormatted: string
  songs: AlbumCardSong[]
}

const props = withDefaults(
  defineProps<{
    album: AlbumCardData
    variant?: 'compact' | 'full'
    showActions?: boolean
  }>(),
  {
    variant: 'compact',
    showActions: true
  }
)

const emit = defineEmits<{
  select: [AlbumCardData]
  edit: [AlbumCardData]
  delete: [AlbumCardData]
}>()

const isFull = props.variant === 'full'
</script>

<template>
  <div
    class="group bg-surface-raised border border-surface-border rounded-card hover:border-accent/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent"
    :class="[
      isFull ? 'p-6 w-full' : 'p-4',
      album.id ? 'cursor-pointer' : ''
    ]"
    :role="album.id ? 'link' : undefined"
    :tabindex="album.id ? 0 : undefined"
    @click="album.id && emit('select', album)"
    @keydown.enter="album.id && emit('select', album)"
  >
    <!-- Header -->
    <div class="flex items-start justify-between gap-3 mb-3">
      <div class="min-w-0">
        <h3
          class="font-display font-semibold text-text-primary truncate"
          :class="isFull ? 'text-2xl' : 'text-base'"
        >
          {{ album.name }}
        </h3>

        <p
          class="text-text-secondary mt-0.5"
          :class="isFull ? 'text-sm' : 'text-xs'"
        >
          {{ album.artistName }}
        </p>
      </div>

      <div
        v-if="showActions"
        class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
      >
        <button
          class="p-1.5 rounded-lg hover:bg-surface-overlay text-text-muted hover:text-accent transition"
          @click.stop="emit('edit', album)"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
            />
          </svg>
        </button>

        <button
          class="p-1.5 rounded-lg hover:bg-surface-overlay text-text-muted hover:text-red-400 transition"
          @click.stop="emit('delete', album)"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Metadata -->
    <div
      class="flex items-center justify-between text-text-muted"
      :class="isFull ? 'text-sm mb-5' : 'text-xs mb-3'"
    >
      <span class="font-mono">
        {{ album.releaseDateFormatted }}
      </span>

      <span
        class="bg-surface-overlay rounded-full"
        :class="isFull ? 'px-3 py-1' : 'px-2 py-0.5'"
      >
        {{ album.songs.length }}
        faixa{{ album.songs.length !== 1 ? 's' : '' }}
      </span>
    </div>

    <!-- Songs -->
    <ul
      v-if="album.songs.length"
      class="divide-y divide-surface-border"
    >
      <li
        v-for="song in album.songs"
        :key="song.id ?? song.position"
        class="flex items-center gap-2"
        :class="isFull ? 'py-3 text-sm' : 'py-1.5 text-xs'"
      >
        <span
          class="text-text-muted text-right font-mono flex-shrink-0"
          :class="isFull ? 'w-8' : 'w-4'"
        >
          {{ song.position }}
        </span>

        <span class="text-text-primary truncate flex-1">
          {{ song.name }}
        </span>

        <span
          v-if="song.isSingle"
          class="text-primary font-mono flex-shrink-0"
          :class="isFull ? 'text-xs' : 'text-[10px]'"
        >
          single
        </span>

        <span class="text-text-muted font-mono flex-shrink-0">
          {{ song.durationFormatted }}
        </span>
      </li>
    </ul>
  </div>
</template>
