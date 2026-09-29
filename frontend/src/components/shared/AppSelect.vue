<script setup lang="ts">
defineProps<{
  modelValue?: string | number
  label?: string
  options: { value: string | number; label: string }[]
  error?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [string | number]
}>()

defineOptions({ inheritAttrs: false })

function updateValue(event: Event) {
  const select = event.target as HTMLSelectElement
  const option = select.options[select.selectedIndex]
  const matchingValue = option
    ? select.value
    : ''

  emit('update:modelValue', matchingValue)
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-xs font-display font-medium text-text-secondary uppercase tracking-wider">
      {{ label }}
    </label>
    <select
      v-bind="$attrs"
      :value="modelValue"
      :class="[
        'bg-surface-overlay border rounded-lg px-3 py-2 text-sm text-text-primary',
        'focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition',
        error ? 'border-red-500' : 'border-surface-border'
      ]"
      @change="updateValue"
    >
      <slot name="default-option" />
      <option
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
      >{{ opt.label }}</option>
    </select>
    <span v-if="error" class="text-xs text-red-400">{{ error }}</span>
  </div>
</template>
