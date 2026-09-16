import { computed, ref } from 'vue';
import { getPhotos, addPhoto, removePhoto, type Photo } from '@/services/storage';

const photos = ref<Photo[]>([]);

export function usePhotos() {
  const list = computed(() => photos.value);

  async function loadPhotos(): Promise<Photo[]> {
    photos.value = await getPhotos();
    return photos.value;
  }

  async function addNewPhoto(dataUrl: string, metadata?: Partial<Photo>): Promise<Photo[]> {
    photos.value = await addPhoto(dataUrl, metadata);
    return photos.value;
  }

  async function removePhotoById(id: string): Promise<Photo[]> {
    photos.value = await removePhoto(id);
    return photos.value;
  }

  return {
    photos: list,
    loadPhotos,
    addNewPhoto,
    removePhotoById,
  };
}
