<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppButton from '@/components/shared/AppButton.vue'

const router = useRouter()

function goBack() {
  if (window.history.length > 1) {
    router.back()
    return
  }

  router.push('/dashboard')
}
</script>

<template>
  <section class="min-h-full flex items-center justify-center py-10">
    <div class="w-full max-w-xl text-center">
      <div class="relative mx-auto mb-8 w-36 h-36">
        <div class="absolute inset-0 rounded-full bg-accent/10 blur-2xl" />

        <div class="relative w-full h-full rounded-full border border-surface-border bg-surface-raised shadow-2xl flex items-center justify-center">
          <div class="absolute inset-3 rounded-full border border-surface-border" />
          <div class="absolute inset-7 rounded-full border border-surface-border/70" />

          <div class="relative w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
            <svg
              class="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              stroke-width="2.25"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 18V5l12-2v12M9 18c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"
              />
            </svg>
          </div>
        </div>
      </div>

      <p class="font-mono text-sm font-medium tracking-[0.3em] text-accent mb-3">
        ERRO 404
      </p>

      <h1 class="font-display text-3xl sm:text-4xl font-bold text-text-primary">
        Essa faixa não foi encontrada
      </h1>

      <p class="mt-4 text-sm sm:text-base leading-6 text-text-secondary max-w-md mx-auto">
        O endereço pode ter mudado ou nunca ter existido. Volte para a biblioteca e continue ouvindo.
      </p>

      <div class="mt-8 flex flex-col-reverse sm:flex-row items-center justify-center gap-3">
        <AppButton variant="ghost" @click="goBack">
          Voltar
        </AppButton>

        <RouterLink to="/dashboard">
          <AppButton>
            Ir para o início
          </AppButton>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
