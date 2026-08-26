<template>
  <ion-page>
    <ion-content :fullscreen="true" class="auth-page">
      <div class="orb one" />
      <div class="orb two" />

      <main class="auth-card">
        <div class="brand-mark">
          <ion-icon :icon="apertureOutline" />
        </div>

        <p class="eyebrow">BEM-VINDO DE VOLTA</p>
        <h1>Seu mundo,<br /><em>em foco.</em></h1>
        <p class="subtitle">Entre para revisitar os momentos que importam.</p>

        <form @submit.prevent="submit">
          <ion-input
            v-model="email"
            label="E-mail"
            label-placement="stacked"
            type="email"
            fill="outline"
            placeholder="voce@email.com"
            :error-text="errors.email"
            @ionBlur="validateEmailField"
          />

          <ion-input
            v-model="password"
            label="Senha"
            label-placement="stacked"
            type="password"
            fill="outline"
            placeholder="••••••••"
            :error-text="errors.password"
            @ionBlur="validatePasswordField"
          />

          <ion-text color="danger" v-if="errorMessage">{{ errorMessage }}</ion-text>

          <ion-button expand="block" type="submit" :disabled="loading">
            <span v-if="!loading">Entrar na galeria</span>
            <span v-else>Entrando...</span>
            <ion-icon slot="end" :icon="arrowForwardOutline" />
          </ion-button>
        </form>

        <p class="switch">
          Primeira vez aqui?
          <router-link to="/cadastro">Criar conta</router-link>
        </p>
      </main>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { IonButton, IonContent, IonIcon, IonInput, IonPage, IonText } from '@ionic/vue';
import { apertureOutline, arrowForwardOutline } from 'ionicons/icons';
import { authService } from '@/app/services/auth.service';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const loading = ref(false);
const errors = ref({ email: '', password: '' });

function validateEmailField(): void {
  const value = email.value.trim();
  errors.value.email = value && /\S+@\S+\.\S+/.test(value) ? '' : 'Informe um e-mail válido.';
}

function validatePasswordField(): void {
  errors.value.password = password.value.trim().length > 0 ? '' : 'A senha é obrigatória.';
}

async function submit(): Promise<void> {
  validateEmailField();
  validatePasswordField();

  if (errors.value.email || errors.value.password) {
    errorMessage.value = 'Revise os campos antes de continuar.';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    const user = await authService.login(email.value, password.value);

    if (!user) {
      errorMessage.value = 'Credenciais inválidas.';
      return;
    }

    await router.replace('/tabs/home');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Não foi possível entrar agora.';
    errorMessage.value = message;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.auth-page {
  --background: #f6f5ff;
}

.auth-card {
  position: relative;
  z-index: 1;
  max-width: 430px;
  min-height: 100%;
  margin: auto;
  padding: 94px 27px 32px;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(4px);
}

.one {
  width: 260px;
  height: 260px;
  background: #ddd8ff;
  top: -110px;
  right: -90px;
}

.two {
  width: 160px;
  height: 160px;
  background: #ffd9bd;
  bottom: 4%;
  left: -90px;
}

.brand-mark {
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  border-radius: 19px;
  background: linear-gradient(135deg, #887afa, #5542df);
  color: #fff;
  box-shadow: 0 12px 28px #a69cf3;
}

.brand-mark ion-icon {
  font-size: 31px;
}

.eyebrow {
  color: #6857e8;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.6px;
  margin: 34px 0 9px;
}

h1 {
  font-size: 42px;
  line-height: 1.04;
  letter-spacing: -2px;
  margin: 0;
  color: #20203a;
}

h1 em {
  font-family: Georgia, serif;
  font-weight: 400;
  color: #6857e8;
}

.subtitle {
  line-height: 1.55;
  color: #777895;
  margin: 17px 0 34px;
  max-width: 275px;
}

form {
  display: grid;
  gap: 15px;
}

ion-input {
  --background: rgba(255, 255, 255, 0.9);
  --border-radius: 16px;
  --padding-start: 16px;
}

ion-button {
  height: 55px;
  margin-top: 6px;
  --border-radius: 17px;
  --box-shadow: 0 12px 22px rgba(104, 87, 232, 0.24);
}

.switch {
  text-align: center;
  margin-top: 28px;
  color: #777895;
}

.switch a {
  color: #6857e8;
  font-weight: 800;
  text-decoration: none;
}
</style>

