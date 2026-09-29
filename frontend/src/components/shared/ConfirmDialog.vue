<script setup lang="ts">
defineProps<{ open: boolean; message: string; loading?: boolean }>()
const emit = defineEmits<{ confirm: []; cancel: [] }>()
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="emit('cancel')" />
        <div class="relative z-10 w-full max-w-sm bg-surface-raised border border-surface-border rounded-2xl p-6 shadow-2xl">
          <p class="text-text-primary font-body mb-6">{{ message }}</p>
          <div class="flex gap-3 justify-end">
            <button
              class="px-4 py-2 text-sm font-display text-text-secondary hover:text-text-primary hover:bg-surface-overlay rounded-lg transition"
              @click="emit('cancel')"
            >Cancel</button>
            <button
              :disabled="loading"
              class="px-4 py-2 text-sm font-display bg-red-500 hover:bg-red-600 text-white rounded-lg transition disabled:opacity-40"
              @click="emit('confirm')"
            >
              <span v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-1" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.15s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
