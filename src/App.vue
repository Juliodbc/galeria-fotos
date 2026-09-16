<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { useAuth } from '@/composables/useAuth';
import { useNetwork } from '@/composables/useNetwork';
import { useTheme } from '@/composables/useTheme';

const { hydrate } = useAuth();
const { initializeNetwork } = useNetwork();
const { initializeTheme } = useTheme();

onMounted(async () => {
  await initializeTheme();
  await initializeNetwork();
  await hydrate();
});
</script>
