<template>
  <ion-page class="about-page">
    <ion-header>
      <ion-toolbar>
        <ion-title><span>f</span> foco</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <OfflineBanner :is-online="isOnline" />

      <section class="about-hero">
        <div class="mark">f</div>
        <p>VERSÃO {{ appVersion }}</p>
        <h1>Feito para guardar<br /><em>o que importa.</em></h1>
      </section>

      <section class="info-card">
        <div class="row">
          <span>Dark mode</span>
          <ion-toggle :checked="isDarkMode" @ionChange="handleThemeToggle" />
        </div>

        <div class="coords">
          <h3>Localização atual</h3>

          <div v-if="location.loading" class="state">Buscando sua localização...</div>
          <div v-else-if="location.error" class="state error">{{ location.error }}</div>
          <div v-else class="coords-grid">
            <div>
              <label>Latitude</label>
              <strong>{{ formatCoordinate(location.latitude) }}</strong>
            </div>
            <div>
              <label>Longitude</label>
              <strong>{{ formatCoordinate(location.longitude) }}</strong>
            </div>
            <div>
              <label>Altitude</label>
              <strong>{{ formatAltitude(location.altitude) }}</strong>
            </div>
          </div>
        </div>
      </section>

      <ion-accordion-group>
        <ion-accordion value="terms">
          <ion-item slot="header">
            <ion-label>
              <b>Termos de Uso</b>
              <small>Seu espaço, suas memórias</small>
            </ion-label>
          </ion-item>
          <div slot="content" class="ion-padding">
            O aplicativo armazena as fotos localmente no dispositivo, vinculadas à sessão ativa do usuário cadastrado.
          </div>
        </ion-accordion>

        <ion-accordion value="privacy">
          <ion-item slot="header">
            <ion-label>
              <b>Privacidade</b>
              <small>Controle sempre em suas mãos</small>
            </ion-label>
          </ion-item>
          <div slot="content" class="ion-padding">
            Nenhuma foto é enviada para servidores externos. Toda a coleção permanece salva no armazenamento local do celular.
          </div>
        </ion-accordion>
      </ion-accordion-group>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import {
  IonAccordion,
  IonAccordionGroup,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToggle,
  IonToolbar,
} from '@ionic/vue';
import packageJson from '../../package.json';
import { useLocation } from '@/composables/useLocation';
import { useNetwork } from '@/composables/useNetwork';
import { useTheme } from '@/composables/useTheme';
import OfflineBanner from '@/components/OfflineBanner.vue';

const appVersion = packageJson.version;
const { isDarkMode, toggleTheme } = useTheme();
const { isOnline, initializeNetwork } = useNetwork();
const { location, fetchCurrentLocation } = useLocation();

const locationValue = computed(() => location.value);

async function handleThemeToggle(): Promise<void> {
  await toggleTheme();
}

function formatCoordinate(value: number | null): string {
  return value === null ? '--' : value.toFixed(4);
}

function formatAltitude(value: number | null): string {
  return value === null ? 'N/A' : `${value.toFixed(2)} m`;
}

onMounted(async () => {
  await initializeNetwork();
  await fetchCurrentLocation();
});
</script>

<style scoped>
ion-toolbar {
  --border-style: none;
}

ion-title {
  font-weight: 800;
}

ion-title span {
  display: inline-grid;
  place-items: center;
  width: 23px;
  height: 23px;
  border-radius: 8px;
  background: linear-gradient(135deg, #7f6afc, #5846e4);
  color: #fff;
  box-shadow: 0 8px 18px rgba(104, 87, 232, 0.32);
}

.about-hero {
  padding: 48px 25px 24px;
}

.mark {
  width: 62px;
  height: 62px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #8f82ff, #5542df);
  color: white;
  border-radius: 22px 22px 22px 7px;
  font: bold 37px Georgia;
  box-shadow: 0 13px 24px rgba(104, 87, 232, 0.22);
}

.about-hero p {
  font-size: 10px;
  letter-spacing: 1.5px;
  font-weight: 800;
  color: #6857e8;
  margin: 29px 0 9px;
}

.about-hero h1 {
  font-size: clamp(2rem, 5vw, 2.7rem);
  line-height: 1.05;
  letter-spacing: -1.3px;
  margin: 0;
  color: #20203a;
}

.about-hero em {
  font: 400 31px Georgia;
  color: #6857e8;
}

.info-card {
  margin: 0 16px 18px;
  padding: 16px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(104, 87, 232, 0.06);
  box-shadow: 0 8px 18px rgba(33, 30, 67, 0.06);
  backdrop-filter: blur(10px);
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 700;
  color: #20203a;
}

.coords {
  margin-top: 16px;
}

.coords h3 {
  margin: 0 0 12px;
  font-size: 0.98rem;
}

.coords-grid {
  display: grid;
  gap: 10px;
}

.coords-grid div {
  background: linear-gradient(180deg, #f5f2ff 0%, #f0ebff 100%);
  border: 1px solid rgba(104, 87, 232, 0.06);
  border-radius: 14px;
  padding: 10px 12px;
}

.coords-grid label,
.state {
  display: block;
  font-size: 0.73rem;
  color: #69708c;
}

.coords-grid strong {
  display: block;
  margin-top: 4px;
  font-size: 1rem;
  color: #20203a;
}

.state.error {
  color: #c52a2a;
}

ion-accordion-group {
  margin: 0 16px 24px;
  border: 1px solid rgba(104, 87, 232, 0.08);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 24px rgba(59, 41, 126, 0.06);
}

ion-item {
  --background: rgba(255, 255, 255, 0.94);
}

ion-label b,
ion-label small {
  display: block;
}

ion-label small {
  color: #8887a0;
  margin-top: 4px;
}

body.dark .about-hero h1,
body.dark .row,
body.dark .coords-grid strong,
body.dark ion-label b {
  color: #edf1ff;
}

body.dark .info-card,
body.dark ion-item,
body.dark ion-accordion {
  background: rgba(28, 30, 45, 0.9);
  border-color: rgba(255, 255, 255, 0.05);
}

body.dark .coords-grid div {
  background: rgba(122, 112, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.04);
}
</style>

