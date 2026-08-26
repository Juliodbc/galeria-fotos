import type { NavigationGuard } from 'vue-router';
import { authService } from '@/app/services/auth.service';

/**
 * Protege rotas autenticadas e redireciona usuários já logados para a galeria.
 */
export const authGuard: NavigationGuard = async (to) => {
  const isAuthenticated = await authService.isAuthenticated();

  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
    return '/login';
  }

  if (to.matched.some((record) => record.meta.guestOnly) && isAuthenticated) {
    return '/tabs/home';
  }

  return true;
};
