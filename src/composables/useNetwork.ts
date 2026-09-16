import { computed, ref } from 'vue';
import { Network } from '@capacitor/network';

const isOnline = ref(true);

export function useNetwork() {
  const onlineStatus = computed(() => isOnline.value);

  async function initializeNetwork(): Promise<void> {
    const status = await Network.getStatus();
    isOnline.value = status.connected;

    Network.addListener('networkStatusChange', (statusUpdate) => {
      isOnline.value = statusUpdate.connected;
    });
  }

  return {
    isOnline: onlineStatus,
    initializeNetwork,
  };
}
