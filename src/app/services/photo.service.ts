import { Preferences } from '@capacitor/preferences';
import type { Photo } from '@/app/models/photo';
import { authService } from './auth.service';

/**
 * Mantém a coleção de fotos separada por usuário logado.
 * O armazenamento é individual por e-mail para evitar misturar registros entre contas.
 */
class PhotoService {
  private static readonly PHOTOS_PREFIX = 'galeria-fotos:photos:';

  private parsePhotos(value: string | null): Photo[] {
    if (!value) {
      return [];
    }

    try {
      const parsed = JSON.parse(value) as Photo[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private async getPhotosKey(): Promise<string> {
    const email = await authService.getSessionEmail();

    if (!email) {
      throw new Error('Sessão de usuário não encontrada.');
    }

    return `${PhotoService.PHOTOS_PREFIX}${email.toLowerCase()}`;
  }

  async list(): Promise<Photo[]> {
    const key = await this.getPhotosKey();
    const result = await Preferences.get({ key });
    return this.parsePhotos(result.value);
  }

  async add(dataUrl: string): Promise<Photo[]> {
    const key = await this.getPhotosKey();
    const photos = await this.list();

    const photo: Photo = {
      id: crypto.randomUUID(),
      dataUrl,
      createdAt: new Date().toISOString(),
    };

    const nextPhotos = [photo, ...photos];
    await Preferences.set({ key, value: JSON.stringify(nextPhotos) });
    return nextPhotos;
  }

  async remove(id: string): Promise<Photo[]> {
    const key = await this.getPhotosKey();
    const photos = await this.list();
    const nextPhotos = photos.filter((photo) => photo.id !== id);

    await Preferences.set({ key, value: JSON.stringify(nextPhotos) });
    return nextPhotos;
  }
}

export const photoService = new PhotoService();
