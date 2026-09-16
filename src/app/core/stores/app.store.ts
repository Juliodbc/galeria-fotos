import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { Network } from '@capacitor/network';
import { Preferences } from '@capacitor/preferences';
import { authService } from '@/app/services/auth.service';
import { photoService } from '@/app/services/photo.service';
import type { Photo } from '@/app/models/photo';
import type { RegisterPayload, User } from '@/app/models/user';

export const useAppStore = defineStore('app', () => {
  const user = ref<User | null>(null);
  const photos = ref<Photo[]>([]);
  const isDarkMode = ref(false);
  const isOnline = ref(true);

  const userEmail = computed(() => user.value?.email ?? null);

  async function hydrateSession(): Promise<void> {
    user.value = await authService.getCurrentUser();
  }

  async function login(email: string, password: string): Promise<boolean> {
    const currentUser = await authService.login(email, password);
    user.value = currentUser;
    return Boolean(currentUser);
  }

  async function register(payload: RegisterPayload): Promise<User> {
    const createdUser = await authService.register(payload);
    user.value = createdUser;
    return createdUser;
  }

  async function logout(): Promise<void> {
    await authService.logout();
    user.value = null;
    photos.value = [];
  }

  async function loadPhotos(): Promise<Photo[]> {
    photos.value = await photoService.list();
    return photos.value;
  }

  async function addPhoto(dataUrl: string, metadata?: Partial<Photo>): Promise<Photo[]> {
    photos.value = await photoService.add(dataUrl, metadata);
    return photos.value;
  }

  async function removePhoto(id: string): Promise<Photo[]> {
    photos.value = await photoService.remove(id);
    return photos.value;
  }

  async function initializeTheme(): Promise<void> {
    const result = await Preferences.get({ key: 'galeria-fotos:theme' });
    const dark = result.value === 'dark';
    isDarkMode.value = dark;
    document.body.classList.toggle('dark', dark);
  }

  async function toggleTheme(): Promise<void> {
    isDarkMode.value = !isDarkMode.value;
    document.body.classList.toggle('dark', isDarkMode.value);
    await Preferences.set({
      key: 'galeria-fotos:theme',
      value: isDarkMode.value ? 'dark' : 'light',
    });
  }

  async function initializeNetwork(): Promise<void> {
    const status = await Network.getStatus();
    isOnline.value = status.connected;

    Network.addListener('networkStatusChange', (nextStatus) => {
      isOnline.value = nextStatus.connected;
    });
  }

  return {
    user,
    photos,
    isDarkMode,
    isOnline,
    userEmail,
    hydrateSession,
    login,
    register,
    logout,
    loadPhotos,
    addPhoto,
    removePhoto,
    initializeTheme,
    toggleTheme,
    initializeNetwork,
  };
});
