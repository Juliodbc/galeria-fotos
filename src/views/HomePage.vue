<template>
  <ion-page>
    <ion-header class="glass">
      <ion-toolbar>
        <ion-title><span>f</span> foco</ion-title>
        <ion-button slot="end" fill="clear" @click="leave">
          <ion-icon :icon="logOutOutline" />
        </ion-button>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <section class="hero">
        <div>
          <p>MINHA COLEÇÃO</p>
          <h1>Memórias<br /><em>vivas.</em></h1>
        </div>

        <div class="count">
          <b>{{ photos.length }}</b>
          <span>{{ photos.length === 1 ? 'foto' : 'fotos' }}</span>
        </div>
      </section>

      <ion-grid v-if="photos.length" class="gallery">
        <ion-row>
          <ion-col size="6" v-for="(photo, index) in photos" :key="photo.id">
            <article :class="{ featured: index === 0 }">
              <img :src="photo.dataUrl" alt="Foto salva" />
              <div class="shade" />
              <ion-button fill="clear" class="trash" @click="remove(photo.id)">
                <ion-icon :icon="trashOutline" />
              </ion-button>
            </article>
          </ion-col>
        </ion-row>
      </ion-grid>

      <section class="empty" v-else>
        <div class="empty-art">
          <ion-icon :icon="imagesOutline" />
        </div>
        <h2>Comece sua história</h2>
        <p>Capture ou escolha uma foto para criar sua coleção.</p>
      </section>

      <ion-fab vertical="bottom" horizontal="end">
        <ion-fab-button @click="pick">
          <ion-icon :icon="addOutline" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  actionSheetController,
  alertController,
  toastController,
  IonButton,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { addOutline, imagesOutline, logOutOutline, trashOutline } from 'ionicons/icons';
import { addPhoto, getPhotos, logout, removePhoto, type Photo } from '@/services/storage';

const photos = ref<Photo[]>([]);
const router = useRouter();

onMounted(async () => {
  photos.value = await getPhotos();
});

async function pick(): Promise<void> {
  const sheet = await actionSheetController.create({
    header: 'Nova memória',
    subHeader: 'Como você quer adicionar?',
    buttons: [
      { text: 'Tirar uma foto', icon: 'camera-outline', handler: () => void capture(CameraSource.Camera) },
      { text: 'Escolher da galeria', icon: 'images-outline', handler: () => void capture(CameraSource.Photos) },
      { text: 'Cancelar', role: 'cancel' },
    ],
  });

  await sheet.present();
}

async function showPermissionNotice(): Promise<void> {
  const toast = await toastController.create({
    message: 'A permissão para câmera e fotos é necessária para adicionar memórias.',
    duration: 3500,
    color: 'warning',
    position: 'bottom',
  });

  await toast.present();
}

async function capture(source: CameraSource): Promise<void> {
  try {
    const permission = await Camera.checkPermissions();

    if (permission.camera !== 'granted' || permission.photos !== 'granted') {
      const requested = await Camera.requestPermissions();

      if (requested.camera !== 'granted' || requested.photos !== 'granted') {
        await showPermissionNotice();
        return;
      }
    }

    const image = await Camera.getPhoto({
      source,
      resultType: CameraResultType.DataUrl,
      quality: 82,
      allowEditing: false,
    });

    if (image.dataUrl) {
      photos.value = await addPhoto(image.dataUrl);
    }
  } catch (error) {
    if (error instanceof Error && !/cancel/i.test(error.message)) {
      await showPermissionNotice();
    }
  }
}

async function remove(id: string): Promise<void> {
  const alert = await alertController.create({
    header: 'Remover esta memória?',
    message: 'A foto será apagada da sua galeria.',
    buttons: [
      { text: 'Manter', role: 'cancel' },
      {
        text: 'Remover',
        role: 'destructive',
        handler: async () => {
          photos.value = await removePhoto(id);
        },
      },
    ],
  });

  await alert.present();
}

async function leave(): Promise<void> {
  await logout();
  await router.replace('/login');
}
</script>

<style scoped>
.glass ion-toolbar {
  --background: rgba(246, 245, 255, 0.78);
  --border-style: none;
  backdrop-filter: blur(15px);
}

ion-title {
  font-weight: 800;
  letter-spacing: -0.5px;
  color: #20203a;
}

ion-title span {
  display: inline-grid;
  place-items: center;
  width: 23px;
  height: 23px;
  border-radius: 8px;
  background: #6857e8;
  color: white;
  margin-right: 4px;
}

.hero {
  display: flex;
  justify-content: space-between;
  align-items: end;
  padding: 38px 23px 21px;
}

.hero p {
  margin: 0;
  color: #6857e8;
  letter-spacing: 1.4px;
  font-weight: 800;
  font-size: 10px;
}

.hero h1 {
  margin: 7px 0 0;
  font-size: 37px;
  line-height: 0.93;
  letter-spacing: -2px;
}

.hero h1 em {
  font-family: Georgia, serif;
  font-weight: 400;
  color: #6857e8;
}

.count {
  text-align: right;
  color: #777895;
}

.count b {
  display: block;
  font-size: 27px;
  color: #20203a;
  line-height: 1;
}

.count span {
  font-size: 11px;
}

.gallery {
  padding: 0 12px 100px;
}

.gallery ion-col {
  padding: 5px;
}

article {
  position: relative;
  aspect-ratio: 0.88;
  overflow: hidden;
  border-radius: 21px;
  background: #e7e5f6;
  box-shadow: 0 10px 22px rgba(37, 29, 92, 0.1);
}

article.featured {
  border-radius: 21px 21px 21px 8px;
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

.trash {
  position: absolute;
  right: 1px;
  top: 1px;
  --color: #fff;
  --background: rgba(21, 16, 45, 0.27);
  --border-radius: 50%;
}

.empty {
  text-align: center;
  padding: 62px 36px;
}

.empty-art {
  width: 105px;
  height: 105px;
  margin: auto;
  display: grid;
  place-items: center;
  border-radius: 35px 35px 35px 10px;
  background: #e7e3ff;
  color: #6857e8;
}

.empty-art ion-icon {
  font-size: 49px;
}

.empty h2 {
  letter-spacing: -1px;
  margin: 23px 0 8px;
  color: #20203a;
}

.empty p {
  line-height: 1.5;
  color: #777895;
  margin: 0;
}

.ion-fab-button {
  --background: #6857e8;
  --box-shadow: 0 12px 24px rgba(104, 87, 232, 0.4);
}
</style>

