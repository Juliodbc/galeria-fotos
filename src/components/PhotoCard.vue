<template>
  <article class="photo-card">
    <img :src="photo.dataUrl" :alt="altText" />
    <div class="shade" />

    <ion-button fill="clear" class="share" @click="$emit('share', photo)">
      <ion-icon :icon="shareSocialOutline" />
    </ion-button>

    <ion-button fill="clear" class="trash" @click="$emit('remove', photo.id)">
      <ion-icon :icon="trashOutline" />
    </ion-button>
  </article>
</template>

<script setup lang="ts">
import { IonButton, IonIcon } from '@ionic/vue';
import { shareSocialOutline, trashOutline } from 'ionicons/icons';
import type { Photo } from '@/types/photo';

const props = defineProps<{
  photo: Photo;
  altText?: string;
}>();

const emit = defineEmits<{
  share: [photo: Photo];
  remove: [id: string];
}>();

const altText = props.altText ?? 'Foto salva';
</script>

<style scoped>
.photo-card {
  position: relative;
  aspect-ratio: 0.88;
  overflow: hidden;
  border-radius: 21px;
  background: #e7e5f6;
  box-shadow: 0 10px 22px rgba(37, 29, 92, 0.1);
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.shade {
  position: absolute;
  inset: 55% 0 0;
  background: linear-gradient(transparent, rgba(20, 16, 48, 0.36));
}

.share,
.trash {
  position: absolute;
  top: 1px;
  --color: #fff;
  --background: rgba(21, 16, 45, 0.27);
  --border-radius: 50%;
}

.share {
  right: 40px;
}

.trash {
  right: 1px;
}
</style>
