import { authService } from '@/app/services/auth.service';
import { photoService } from '@/app/services/photo.service';
import type { User, RegisterPayload } from '@/app/models/user';
import type { Photo } from '@/app/models/photo';

export type { User, RegisterPayload } from '@/app/models/user';
export type { Photo } from '@/app/models/photo';
export { authService } from '@/app/services/auth.service';
export { photoService } from '@/app/services/photo.service';

export async function register(user: { name: string; email: string; password: string }): Promise<void> {
  await authService.register(user);
}

export async function login(email: string, password: string): Promise<boolean> {
  const user = await authService.login(email, password);
  return Boolean(user);
}

export async function logout(): Promise<void> {
  await authService.logout();
}

export async function isAuthenticated(): Promise<boolean> {
  return authService.isAuthenticated();
}

export async function getPhotos(): Promise<Photo[]> {
  return photoService.list();
}

export async function addPhoto(dataUrl: string, metadata?: Partial<Photo>): Promise<Photo[]> {
  return photoService.add(dataUrl, metadata);
}

export async function removePhoto(id: string): Promise<Photo[]> {
  return photoService.remove(id);
}
