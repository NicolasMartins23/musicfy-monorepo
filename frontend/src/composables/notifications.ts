import { readonly, ref } from 'vue'

export type NotificationType = 'success' | 'error' | 'info'

export interface AppNotification {
  id: number
  type: NotificationType
  message: string
}

const notifications = ref<AppNotification[]>([])
let nextId = 1

function remove(id: number) {
  notifications.value = notifications.value.filter(item => item.id !== id)
}

function show(message: string, type: NotificationType = 'info', duration = 4500) {
  const id = nextId++
  notifications.value.push({ id, type, message })

  if (duration > 0) {
    window.setTimeout(() => remove(id), duration)
  }

  return id
}

export function useNotifications() {
  return {
    notifications: readonly(notifications),
    show,
    success: (message: string) => show(message, 'success'),
    error: (message: string) => show(message, 'error', 6500),
    info: (message: string) => show(message, 'info'),
    remove
  }
}
