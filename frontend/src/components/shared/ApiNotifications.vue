<script setup lang="ts">
import { useNotifications } from '@/composables/notifications'

const { notifications, remove } = useNotifications()

const styles = {
  success: {
    container: 'border-emerald-500/40 bg-emerald-500/10',
    icon: 'text-emerald-400',
    path: 'M5 13l4 4L19 7'
  },
  error: {
    container: 'border-red-500/40 bg-red-500/10',
    icon: 'text-red-400',
    path: 'M6 18L18 6M6 6l12 12'
  },
  info: {
    container: 'border-accent/40 bg-accent/10',
    icon: 'text-accent',
    path: 'M12 9h.01M11 12h1v4h1m8-4a9 9 0 11-18 0 9 9 0 0118 0z'
  }
} as const
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3"
      aria-live="polite"
      aria-atomic="false"
    >
      <TransitionGroup name="notification">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="[
            'flex items-start gap-3 rounded-xl border p-4 shadow-2xl backdrop-blur-md',
            styles[notification.type].container
          ]"
          :role="notification.type === 'error' ? 'alert' : 'status'"
        >
          <svg
            :class="['mt-0.5 h-5 w-5 flex-shrink-0', styles[notification.type].icon]"
            fill="none"
            stroke="currentColor"
            stroke-width="2.25"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              :d="styles[notification.type].path"
            />
          </svg>

          <p class="flex-1 text-sm leading-5 text-text-primary">
            {{ notification.message }}
          </p>

          <button
            class="rounded p-0.5 text-text-muted transition hover:bg-white/5 hover:text-text-primary"
            type="button"
            aria-label="Fechar notificação"
            @click="remove(notification.id)"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(1rem);
}

.notification-move {
  transition: transform 180ms ease;
}
</style>
