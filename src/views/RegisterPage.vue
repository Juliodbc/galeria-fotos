<template>
  <ion-page>
    <ion-content :fullscreen="true" class="auth-page">
      <div class="orb one" />
      <div class="orb two" />

      <main class="auth-card">
        <div class="brand-mark">
          <ion-icon :icon="personAddOutline" />
        </div>

        <p class="eyebrow">CRIE SUA CONTA</p>
        <h1>Comece a<br /><em>guardar memórias.</em></h1>

        <form @submit.prevent="submit">
          <ion-input v-model="name" label="Nome" label-placement="stacked" fill="outline" placeholder="Seu nome" :error-text="errors.name" @ionBlur="validateNameField" />
          <ion-input v-model="email" label="E-mail" label-placement="stacked" type="email" fill="outline" placeholder="voce@email.com" :error-text="errors.email" @ionBlur="validateEmailField" />
          <ion-input v-model="password" label="Senha (mín. 6)" label-placement="stacked" type="password" fill="outline" placeholder="••••••••" :error-text="errors.password" @ionBlur="validatePasswordField" />
          <ion-input v-model="confirmPassword" label="Confirmar senha" label-placement="stacked" type="password" fill="outline" placeholder="••••••••" :error-text="errors.confirmPassword" @ionBlur="validateConfirmPasswordField" />

          <ion-text color="danger" v-if="errorMessage">{{ errorMessage }}</ion-text>

          <ion-button expand="block" type="submit" :disabled="loading">
            <span v-if="!loading">Criar conta</span>
            <span v-else>Criando...</span>
          </ion-button>
        </form>

        <p class="switch">
          Já tem conta?
          <router-link to="/login">Fazer login</router-link>
        </p>
      </main>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { IonButton, IonContent, IonIcon, IonInput, IonPage, IonText } from '@ionic/vue';
import { personAddOutline } from 'ionicons/icons';
import { authService } from '@/app/services/auth.service';

const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const loading = ref(false);
const errors = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
});

function validateNameField(): void {
  errors.value.name = name.value.trim().length >= 2 ? '' : 'Informe um nome válido.';
}

function validateEmailField(): void {
  const value = email.value.trim();
  errors.value.email = value && /\S+@\S+\.\S+/.test(value) ? '' : 'Informe um e-mail válido.';
}

function validatePasswordField(): void {
  errors.value.password = password.value.length >= 6 ? '' : 'A senha deve ter no mínimo 6 caracteres.';
}

function validateConfirmPasswordField(): void {
  errors.value.confirmPassword =
    confirmPassword.value && confirmPassword.value === password.value ? '' : 'As senhas precisam coincidir.';
}

async function submit(): Promise<void> {
  validateNameField();
  validateEmailField();
  validatePasswordField();
  validateConfirmPasswordField();

  if (Object.values(errors.value).some(Boolean)) {
    errorMessage.value = 'Revise os campos antes de criar a conta.';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    await authService.register({
      name: name.value,
      email: email.value,
      password: password.value,
    });

    await router.replace('/login');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Não foi possível concluir o cadastro.';
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
  opacity: 0.9;
}

.one {
  width: 260px;
  height: 260px;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(167, 153, 255, 0.9) 28%, rgba(124, 108, 236, 0.66) 100%);
  top: -110px;
  right: -90px;
}

.two {
  width: 170px;
  height: 170px;
  background: radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.9), rgba(255, 210, 173, 0.9) 30%, rgba(255, 162, 97, 0.48) 100%);
  bottom: 5%;
  left: -90px;
}

.brand-mark {
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  border-radius: 20px;
  background: linear-gradient(135deg, #887afa, #5542df 48%, #4635be);
  color: #fff;
  box-shadow: 0 16px 30px rgba(104, 87, 232, 0.3);
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
  font-size: clamp(2.5rem, 6vw, 3.1rem);
  line-height: 0.98;
  letter-spacing: -2px;
  margin: 0;
  color: #20203a;
}

h1 em {
  font-family: Georgia, serif;
  font-weight: 400;
  color: #6857e8;
}

form {
  display: grid;
  gap: 15px;
  margin-top: 28px;
}

ion-input {
  --background: rgba(255, 255, 255, 0.9);
  --border-radius: 16px;
  --padding-start: 16px;
  --placeholder-color: #9ba0be;
  --highlight-color: #6857e8;
  --border-color: rgba(104, 87, 232, 0.12);
}

ion-button {
  height: 55px;
  margin-top: 6px;
  --border-radius: 17px;
  --background: linear-gradient(135deg, #7f6afc, #5846e4);
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

body.dark .auth-page {
  --background: #12131e;
}

body.dark .auth-card {
  background: rgba(20, 22, 35, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 18px 42px rgba(8, 10, 18, 0.55);
  backdrop-filter: blur(10px);
}

body.dark .auth-card h1,
body.dark .switch {
  color: #edf1ff;
}

body.dark ion-input {
  --background: rgba(17, 18, 28, 0.9);
  --color: #edf1ff;
  --placeholder-color: #9aa2c2;
  --border-color: rgba(160, 168, 255, 0.14);
}
</style>

