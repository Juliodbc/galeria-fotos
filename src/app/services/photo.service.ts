import { Directory, Filesystem } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import type { Photo } from '@/app/models/photo';

class PhotoService {
  private static readonly PHOTO_META_KEY = 'galeria-fotos:photo-meta';

  private async getMetadataMap(): Promise<Record<string, Partial<Photo>>> {
    const result = await Preferences.get({ key: PhotoService.PHOTO_META_KEY });

    if (!result.value) {
      return {};
    }

    try {
      const parsed = JSON.parse(result.value) as Record<string, Partial<Photo>>;
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  private async persistMetadataMap(metadata: Record<string, Partial<Photo>>): Promise<void> {
    await Preferences.set({
      key: PhotoService.PHOTO_META_KEY,
      value: JSON.stringify(metadata),
    });
  }

  async list(): Promise<Photo[]> {
    const { files } = await Filesystem.readdir({
      directory: Directory.Data,
      path: '',
    });
    const metadataMap = await this.getMetadataMap();
    const photoFiles = files
      .filter((file) => file.name.startsWith('foto-') && file.name.endsWith('.jpg'))
      .sort((first, second) => second.name.localeCompare(first.name));

    return Promise.all(
      photoFiles.map(async (file) => {
        const result = await Filesystem.readFile({
          directory: Directory.Data,
          path: file.name,
        });
        const data = typeof result.data === 'string' ? result.data : '';
        const metadata = metadataMap[file.name] ?? {};

        return {
          id: file.name,
          dataUrl: `data:image/jpeg;base64,${data}`,
          createdAt: file.mtime ? new Date(file.mtime).toISOString() : new Date().toISOString(),
          latitude: metadata.latitude,
          longitude: metadata.longitude,
          altitude: metadata.altitude ?? null,
        };
      }),
    );
  }

  async add(dataUrl: string, metadata?: Partial<Photo>): Promise<Photo[]> {
    const base64Data = dataUrl.split(',')[1];

    if (!base64Data) {
      throw new Error('Dados da imagem inválidos.');
    }

    const name = `foto-${Date.now()}-${crypto.randomUUID()}.jpg`;
    await Filesystem.writeFile({
      directory: Directory.Data,
      path: name,
      data: base64Data,
    });

    if (metadata && (metadata.latitude !== undefined || metadata.longitude !== undefined || metadata.altitude !== undefined)) {
      const metadataMap = await this.getMetadataMap();
      metadataMap[name] = {
        latitude: metadata.latitude,
        longitude: metadata.longitude,
        altitude: metadata.altitude,
      };
      await this.persistMetadataMap(metadataMap);
    }

    return this.list();
  }

  async remove(id: string): Promise<Photo[]> {
    const metadataMap = await this.getMetadataMap();
    delete metadataMap[id];
    await this.persistMetadataMap(metadataMap);

    await Filesystem.deleteFile({
      directory: Directory.Data,
      path: id,
    });

    return this.list();
  }
}

export const photoService = new PhotoService();
