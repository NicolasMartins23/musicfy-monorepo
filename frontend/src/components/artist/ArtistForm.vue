<script setup lang="ts">
import { ref, watch } from 'vue'
import AppModal from '@/components/shared/AppModal.vue'
import AppInput from '@/components/shared/AppInput.vue'
import AppButton from '@/components/shared/AppButton.vue'
import type { Artist } from '@/types'

const props = defineProps<{
  open: boolean
  editing?: Artist | null
}>()
const emit = defineEmits<{
  close: []
  submit: [{ name: string }]
}>()

const name = ref('')
const error = ref('')
const loading = ref(false)

watch(() => props.open, (v) => {
  if (v) {
    name.value = props.editing?.name ?? ''
    error.value = ''
  }
})

async function submit() {
  if (!name.value.trim()) { error.value = 'Name is required'; return }
  loading.value = true
  try {
    emit('submit', { name: name.value.trim() })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AppModal :open="open" :title="editing ? 'Edit Artist' : 'New Artist'" @close="emit('close')">
    <div class="flex flex-col gap-4">
      <AppInput
        v-model="name"
        label="Artist Name"
        placeholder="e.g. Radiohead"
        :error="error"
        @keydown.enter="submit"
      />
      <div class="flex gap-3 justify-end pt-2">
        <AppButton variant="ghost" @click="emit('close')">Cancel</AppButton>
        <AppButton :loading="loading" @click="submit">
          {{ editing ? 'Save Changes' : 'Create Artist' }}
        </AppButton>
      </div>
    </div>
  </AppModal>
</template>
