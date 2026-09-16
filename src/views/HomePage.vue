<template>
  <ion-page>
    <ion-header class="glass">
      <ion-toolbar>
        <ion-title><span>f</span> foco</ion-title>

        <ion-button slot="end" fill="clear" @click="handleToggleTheme" aria-label="Alternar tema">
          <ion-icon :icon="isDarkMode ? sunnyOutline : moonOutline" />
        </ion-button>

        <ion-button slot="end" fill="clear" @click="leave" aria-label="Sair da conta">
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
          <span>{{ photos.length === 1 ? "foto" : "fotos" }}</span>
          <small v-if="!isOnline">offline</small>
        </div>
      </section>

      <ion-grid v-if="photos.length" class="gallery">
        <ion-row>
          <ion-col size="6" v-for="(photo, index) in photos" :key="photo.id">
            <PhotoCard
              :photo="photo"
              :alt-text="index === 0 ? 'Foto em destaque' : 'Foto salva'"
              @share="sharePhoto"
              @remove="remove"
            />
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Geolocation } from "@capacitor/geolocation";
import { Share } from "@capacitor/share";
import {
  actionSheetController,
  alertController,
  onIonViewWillEnter,
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
} from "@ionic/vue";
import {
  addOutline,
  imagesOutline,
  logOutOutline,
  moonOutline,
  sunnyOutline,
} from "ionicons/icons";
import { useTheme } from "@/composables/useTheme";
import { useNetwork } from "@/composables/useNetwork";
import PhotoCard from "@/components/PhotoCard.vue";
import { addPhoto, getPhotos, logout, removePhoto, type Photo } from "@/services/storage";

const photos = ref<Photo[]>([]);
const router = useRouter();
const { isDarkMode, toggleTheme } = useTheme();
const { isOnline } = useNetwork();

async function mostrarToast(
  message: string,
  color: "success" | "danger" | "warning",
): Promise<void> {
  const toast = await toastController.create({
    message,
    color,
    duration: 2200,
    position: "bottom",
  });

  await toast.present();
}

async function carregarFotos(): Promise<void> {
  try {
    photos.value = await getPhotos();
  } catch {
    photos.value = [];
    await mostrarToast("Não foi possível carregar as fotos", "danger");
  }
}

onIonViewWillEnter(carregarFotos);

async function handleToggleTheme(): Promise<void> {
  await toggleTheme();
}

async function pick(): Promise<void> {
  const sheet = await actionSheetController.create({
    header: "Nova memória",
    subHeader: "Como você quer adicionar?",
    buttons: [
      {
        text: "Tirar uma foto",
        icon: "camera-outline",
        handler: () => void capture(CameraSource.Camera),
      },
      {
        text: "Escolher da galeria",
        icon: "images-outline",
        handler: () => void capture(CameraSource.Photos),
      },
      { text: "Cancelar", role: "cancel" },
    ],
  });

  await sheet.present();
}

async function showPermissionNotice(message: string): Promise<void> {
  const toast = await toastController.create({
    message,
    duration: 3500,
    color: "warning",
    position: "bottom",
  });

  await toast.present();
}

async function getLocationMetadata(): Promise<Partial<Photo> | undefined> {
  const permission = await Geolocation.checkPermissions();

  if (permission.location !== "granted") {
    const requested = await Geolocation.requestPermissions();
    if (requested.location !== "granted") {
      await showPermissionNotice("A localização foi descartada. Sua foto será salva sem coordenadas.");
      return undefined;
    }
  }

  try {
    const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      altitude: position.coords.altitude ?? null,
    };
  } catch {
    await showPermissionNotice("Não foi possível obter sua localização agora, mas a foto foi salva normalmente.");
    return undefined;
  }
}

async function capture(source: CameraSource): Promise<void> {
  try {
    const permission = await Camera.checkPermissions();

    if (permission.camera !== "granted" || permission.photos !== "granted") {
      const requested = await Camera.requestPermissions();

      if (requested.camera !== "granted" || requested.photos !== "granted") {
        await showPermissionNotice("A permissão para câmera e fotos é necessária para adicionar memórias.");
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
      const metadata = await getLocationMetadata();
      photos.value = await addPhoto(image.dataUrl, metadata);
      await mostrarToast("Foto salva com sucesso", "success");
    }
  } catch (error) {
    if (error instanceof Error && /cancel/i.test(error.message)) {
      return;
    }

    await mostrarToast("Não foi possível salvar a foto", "danger");
  }
}

async function sharePhoto(photo: Photo): Promise<void> {
  try {
    await Share.share({
      title: "Minha memória",
      text: "Confira esta foto da minha galeria.",
      url: photo.dataUrl,
    });
  } catch {
    await mostrarToast("Não foi possível compartilhar esta foto", "danger");
  }
}

async function remove(id: string): Promise<void> {
  const alert = await alertController.create({
    header: "Remover esta memória?",
    message: "A foto será apagada da sua galeria.",
    buttons: [
      { text: "Manter", role: "cancel" },
      {
        text: "Remover",
        role: "destructive",
        handler: async () => {
          try {
            photos.value = await removePhoto(id);
            await mostrarToast("Foto excluída com sucesso", "success");
          } catch {
            await mostrarToast("Não foi possível excluir a foto", "danger");
          }
        },
      },
    ],
  });

  await alert.present();
}

async function leave(): Promise<void> {
  await logout();
  await router.replace("/login");
}
</script>

<style scoped>
.glass ion-toolbar {
  --background: rgba(255, 255, 255, 0.7);
  --border-style: none;
  backdrop-filter: blur(16px);
  box-shadow: 0 8px 22px rgba(58, 49, 120, 0.08);
}

body.dark .glass ion-toolbar {
  --background: rgba(24, 25, 38, 0.78);
  box-shadow: none;
}

ion-title {
  font-weight: 800;
  letter-spacing: -0.5px;
  color: #20203a;
}

body.dark ion-title {
  color: #edf1ff;
}

ion-title span {
  display: inline-grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: linear-gradient(135deg, #7f6afc, #5846e4);
  color: white;
  margin-right: 4px;
  box-shadow: 0 8px 18px rgba(104, 87, 232, 0.35);
}

.hero {
  display: flex;
  justify-content: space-between;
  align-items: end;
  padding: 34px 22px 18px;
}

.hero p {
  margin: 0;
  color: #6857e8;
  letter-spacing: 1.5px;
  font-weight: 800;
  font-size: 10px;
}

.hero h1 {
  margin: 7px 0 0;
  font-size: clamp(2.2rem, 6vw, 3.1rem);
  line-height: 0.94;
  letter-spacing: -2px;
  color: #1d1d34;
}

body.dark .hero h1 {
  color: #edf1ff;
}

.hero h1 em {
  font-family: Georgia, serif;
  font-weight: 400;
  color: #6857e8;
}

.count {
  text-align: right;
  color: #777895;
  padding-bottom: 4px;
}

.count b {
  display: block;
  font-size: 28px;
  color: #20203a;
  line-height: 1;
}

.count span,
.count small {
  display: block;
}

.count small {
  margin-top: 2px;
  color: #b24d4d;
  font-weight: 700;
}

body.dark .count b {
  color: #edf1ff;
}

.gallery {
  padding: 0 12px 100px;
}

.gallery ion-col {
  padding: 6px;
}

.empty {
  text-align: center;
  padding: 56px 26px 80px;
}

.empty-art {
  width: 110px;
  height: 110px;
  margin: auto;
  display: grid;
  place-items: center;
  border-radius: 34px 34px 34px 12px;
  background: linear-gradient(135deg, #efeaff, #dfd5ff);
  color: #6857e8;
  box-shadow: 0 18px 28px rgba(104, 87, 232, 0.12);
}

.empty-art ion-icon {
  font-size: 50px;
}

.empty h2 {
  letter-spacing: -1px;
  margin: 22px 0 9px;
  color: #20203a;
}

body.dark .empty h2,
body.dark .empty p {
  color: #edf1ff;
}

.empty p {
  line-height: 1.5;
  color: #777895;
  margin: 0;
}

.ion-fab-button {
  --background: linear-gradient(135deg, #7f6afc, #5846e4);
  --box-shadow: 0 16px 28px rgba(104, 87, 232, 0.38);
}
</style>
