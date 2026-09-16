import { computed, ref } from 'vue';
import { Preferences } from '@capacitor/preferences';

const isDarkMode = ref(false);

export function useTheme() {
  const themeState = computed(() => isDarkMode.value);

  async function initializeTheme(): Promise<void> {
    const result = await Preferences.get({ key: 'galeria-fotos:theme' });
    const dark = result.value === 'dark';
    isDarkMode.value = dark;
    document.body.classList.toggle('dark', dark);
    document.body.classList.toggle('ion-palette-dark', dark);
  }

  async function toggleTheme(): Promise<void> {
    isDarkMode.value = !isDarkMode.value;
    document.body.classList.toggle('dark', isDarkMode.value);
    document.body.classList.toggle('ion-palette-dark', isDarkMode.value);
    await Preferences.set({
      key: 'galeria-fotos:theme',
      value: isDarkMode.value ? 'dark' : 'light',
    });
  }

  return {
    isDarkMode: themeState,
    initializeTheme,
    toggleTheme,
  };
}
