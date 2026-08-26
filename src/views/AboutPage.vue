<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title><span>f</span> foco</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <section class="about-hero">
        <div class="mark">f</div>
        <p>VERSÃO {{ appVersion }}</p>
        <h1>Feito para guardar<br /><em>o que importa.</em></h1>
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
import {
  IonAccordion,
  IonAccordionGroup,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import packageJson from '../../package.json';

const appVersion = packageJson.version;
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
  background: #6857e8;
  color: #fff;
}

.about-hero {
  padding: 48px 25px 34px;
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
  box-shadow: 0 13px 24px #d0cafc;
}

.about-hero p {
  font-size: 10px;
  letter-spacing: 1.5px;
  font-weight: 800;
  color: #6857e8;
  margin: 29px 0 9px;
}

.about-hero h1 {
  font-size: 30px;
  line-height: 1.1;
  letter-spacing: -1.3px;
  margin: 0;
}

.about-hero em {
  font: 400 31px Georgia;
  color: #6857e8;
}

ion-accordion-group {
  margin: 0 16px;
  border: 1px solid #e8e5f5;
  border-radius: 20px;
  overflow: hidden;
}

ion-item {
  --background: #fff;
}

ion-label b,
ion-label small {
  display: block;
}

ion-label small {
  color: #8887a0;
  margin-top: 4px;
}
</style>

