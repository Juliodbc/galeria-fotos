<template>
  <div v-if="!isOnline" class="offline-banner">
    <ion-icon :icon="cloudOfflineOutline" />
    <span>Você está offline</span>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { cloudOfflineOutline } from 'ionicons/icons';

defineProps<{ isOnline: boolean }>();
</script>

<style scoped>
.offline-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #ffefef;
  color: #b53030;
  padding: 10px 14px;
  font-size: 0.82rem;
  font-weight: 700;
}

ion-icon {
  font-size: 1.05rem;
}
</style>
