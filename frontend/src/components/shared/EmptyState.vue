<script setup lang="ts">
defineProps<{ message?: string; icon?: string }>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 gap-3 text-text-muted">
    <span class="text-4xl">{{ icon ?? '🎵' }}</span>
    <p class="font-body text-sm">{{ message ?? 'No results found.' }}</p>
    <slot />
  </div>
</template>
