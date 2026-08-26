import { Preferences } from '@capacitor/preferences';
import type { RegisterPayload, User } from '@/app/models/user';

/**
 * Centraliza login, logout, cadastro e persistência da sessão do usuário.
 * Toda informação sensível da conta fica salva no armazenamento local do app.
 */
class AuthService {
  private static readonly USERS_KEY = 'galeria-fotos:users';
  private static readonly SESSION_KEY = 'galeria-fotos:session';

  private parseUsers(value: string | null): User[] {
    if (!value) {
      return [];
    }

    try {
      const parsed = JSON.parse(value) as User[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  async getUsers(): Promise<User[]> {
    const result = await Preferences.get({ key: AuthService.USERS_KEY });
    return this.parseUsers(result.value);
  }

  private async saveUsers(users: User[]): Promise<void> {
    await Preferences.set({
      key: AuthService.USERS_KEY,
      value: JSON.stringify(users),
    });
  }

  async register(payload: RegisterPayload): Promise<User> {
    const trimmedName = payload.name.trim();
    const normalizedEmail = payload.email.trim().toLowerCase();

    if (!trimmedName || !normalizedEmail || payload.password.trim().length < 6) {
      throw new Error('Dados inválidos para cadastro.');
    }

    const users = await this.getUsers();
    const alreadyExists = users.some((user) => user.email.toLowerCase() === normalizedEmail);

    if (alreadyExists) {
      throw new Error('Este e-mail já foi cadastrado.');
    }

    const user: User = {
      id: crypto.randomUUID(),
      name: trimmedName,
      email: normalizedEmail,
      password: payload.password,
      createdAt: new Date().toISOString(),
    };

    users.push(user);
    await this.saveUsers(users);
    return user;
  }

  async login(email: string, password: string): Promise<User | null> {
    const normalizedEmail = email.trim().toLowerCase();
    const users = await this.getUsers();
    const user = users.find(
      (item) => item.email.toLowerCase() === normalizedEmail && item.password === password,
    );

    if (!user) {
      return null;
    }

    await Preferences.set({
      key: AuthService.SESSION_KEY,
      value: user.email.toLowerCase(),
    });

    return user;
  }

  async logout(): Promise<void> {
    await Preferences.remove({ key: AuthService.SESSION_KEY });
  }

  async isAuthenticated(): Promise<boolean> {
    const session = await Preferences.get({ key: AuthService.SESSION_KEY });
    return Boolean(session.value && session.value.trim().length > 0);
  }

  async getSessionEmail(): Promise<string | null> {
    const session = await Preferences.get({ key: AuthService.SESSION_KEY });
    return session.value ? session.value.trim() : null;
  }

  async getCurrentUser(): Promise<User | null> {
    const email = await this.getSessionEmail();

    if (!email) {
      return null;
    }

    const users = await this.getUsers();
    return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
  }
}

export const authService = new AuthService();
