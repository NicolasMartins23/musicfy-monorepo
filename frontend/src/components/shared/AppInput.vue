<script setup lang="ts">
const props = defineProps<{
  modelValue?: string | number
  modelModifiers?: {
    number?: boolean
  }
  label?: string
  error?: string
  hint?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [string | number]
}>()

defineOptions({ inheritAttrs: false })

function updateValue(event: Event) {
  const input = event.target as HTMLInputElement
  const value = props.modelModifiers?.number && input.value !== ''
    ? Number(input.value)
    : input.value

  emit('update:modelValue', value)
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-xs font-display font-medium text-text-secondary uppercase tracking-wider">
      {{ label }}
    </label>
    <input
      v-bind="$attrs"
      :value="modelValue"
      :class="[
        'bg-surface-overlay border rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted',
        'focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition',
        error ? 'border-red-500' : 'border-surface-border'
      ]"
      @input="updateValue"
    />
    <span v-if="error" class="text-xs text-red-400">{{ error }}</span>
    <span v-else-if="hint" class="text-xs text-text-muted">{{ hint }}</span>
  </div>
</template>
