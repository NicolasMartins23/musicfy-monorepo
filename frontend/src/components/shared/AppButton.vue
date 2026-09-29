<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
  loading?: boolean
  disabled?: boolean
}>()
</script>

<template>
  <button
    v-bind="$attrs"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center gap-2 font-display font-medium rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
      size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-sm',
      variant === 'danger'
        ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
        : variant === 'ghost'
          ? 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-overlay'
          : 'bg-accent text-white hover:bg-accent-hover',
      (disabled || loading) && 'opacity-40 cursor-not-allowed'
    ]"
  >
    <span v-if="loading" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
    <slot />
  </button>
</template>
