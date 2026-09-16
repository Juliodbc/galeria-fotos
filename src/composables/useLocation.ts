import { computed, ref } from 'vue';
import { Geolocation } from '@capacitor/geolocation';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
  loading: boolean;
  error: string | null;
}

const location = ref<LocationState>({
  latitude: null,
  longitude: null,
  altitude: null,
  loading: false,
  error: null,
});

export function useLocation() {
  const locationState = computed(() => location.value);

  async function fetchCurrentLocation(): Promise<LocationState> {
    location.value = { ...location.value, loading: true, error: null };

    const permission = await Geolocation.checkPermissions();

    if (permission.location !== 'granted') {
      const requested = await Geolocation.requestPermissions();
      if (requested.location !== 'granted') {
        location.value = {
          latitude: null,
          longitude: null,
          altitude: null,
          loading: false,
          error: 'Permissão de localização negada.',
        };
        return location.value;
      }
    }

    try {
      const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      const nextState = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        altitude: position.coords.altitude ?? null,
        loading: false,
        error: null,
      };

      location.value = nextState;
      return nextState;
    } catch {
      location.value = {
        latitude: null,
        longitude: null,
        altitude: null,
        loading: false,
        error: 'Não foi possível obter a localização atual.',
      };
      return location.value;
    }
  }

  return {
    location: locationState,
    fetchCurrentLocation,
  };
}
