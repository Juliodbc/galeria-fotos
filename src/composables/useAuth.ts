import { computed, ref } from 'vue';
import { authService } from '@/app/services/auth.service';
import type { RegisterPayload, User } from '@/types/user';

const user = ref<User | null>(null);

export function useAuth() {
  const currentUser = computed(() => user.value);

  async function hydrate(): Promise<void> {
    user.value = await authService.getCurrentUser();
  }

  async function login(email: string, password: string): Promise<boolean> {
    const current = await authService.login(email, password);
    user.value = current;
    return Boolean(current);
  }

  async function register(payload: RegisterPayload): Promise<User> {
    const createdUser = await authService.register(payload);
    user.value = createdUser;
    return createdUser;
  }

  async function logout(): Promise<void> {
    await authService.logout();
    user.value = null;
  }

  async function isAuthenticated(): Promise<boolean> {
    return authService.isAuthenticated();
  }

  return {
    user: currentUser,
    hydrate,
    login,
    register,
    logout,
    isAuthenticated,
  };
}
