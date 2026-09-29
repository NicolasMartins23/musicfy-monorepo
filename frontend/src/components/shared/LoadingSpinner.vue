<script setup lang="ts">
defineProps<{ size?: 'sm' | 'md' | 'lg' }>()
</script>

<template>
  <div class="flex items-center justify-center py-8">
    <span
      :class="[
        'border-2 border-accent-muted border-t-accent rounded-full animate-spin',
        size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-10 h-10' : 'w-6 h-6'
      ]"
    />
  </div>
</template>
