# Foco — Galeria de Fotos

## Visão geral

Aplicativo mobile de galeria de fotos em Ionic + Vue 3 + TypeScript + Capacitor com autenticação local, galeria protegida, persistência no armazenamento do dispositivo e UX moderna.

## Stack obrigatória

- Ionic Framework + Vue 3 + TypeScript
- Vue Router com navigation guard para rotas protegidas
- Pinia para estado global
- Capacitor Camera, Preferences, Filesystem, Action Sheet, Share, Geolocation, Network
- Ionicons

## Setup completo (ordem correta)

```bash
# 1. Instalar Ionic CLI globalmente (se ainda não tiver)
npm install -g @ionic/cli

# 2. Criar o projeto Ionic com Vue (não usar Angular)
ionic start galeria-fotos blank --type=vue --capacitor

cd galeria-fotos

# 3. Instalar dependências principais do Capacitor
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli

# 4. Instalar plugins nativos necessários
npm install @capacitor/camera
npm install @capacitor/preferences
npm install @capacitor/filesystem
npm install @capacitor/action-sheet
npm install @capacitor/share
npm install @capacitor/geolocation
npm install @capacitor/network

# 5. Instalar Pinia
npm install pinia

# 6. Instalar Ionicons
npm install ionicons

# 7. Adicionar a plataforma Android
npx cap add android

# 8. Buildar o projeto web
ionic build

# 9. Sincronizar com o projeto nativo
npx cap sync android

# 10. Abrir no Android Studio
npx cap open android
```

Após abrir no Android Studio, execute o app em um emulador ou dispositivo físico. Sempre que modificar o código web, repita:

```bash
ionic build && npx cap sync android
```

## Permissões Android

No arquivo AndroidManifest, incluir:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-feature android:name="android.hardware.camera" android:required="false" />
```

No runtime, antes de usar câmera ou geolocalização:

```ts
const cameraPerm = await Camera.checkPermissions();
if (cameraPerm.camera !== 'granted' || cameraPerm.photos !== 'granted') {
  await Camera.requestPermissions();
}

const locationPerm = await Geolocation.checkPermissions();
if (locationPerm.location !== 'granted') {
  await Geolocation.requestPermissions();
}
```

## Funcionalidades do app

- Login e cadastro com validação
- Sessão persistida em Preferences
- Rotas protegidas com navigation guard
- Galeria com fotos capturadas ou escolhidas da biblioteca
- Remoção com confirmação
- Compartilhamento via Share
- Geolocalização opcional na foto
- Tema escuro/claro salvo e aplicado
- Status online/offline
- Logout completo

## Estrutura principal

- [src/router/index.ts](src/router/index.ts)
- [src/views/LoginPage.vue](src/views/LoginPage.vue)
- [src/views/RegisterPage.vue](src/views/RegisterPage.vue)
- [src/views/HomePage.vue](src/views/HomePage.vue)
- [src/views/AboutPage.vue](src/views/AboutPage.vue)
- [src/app/services/auth.service.ts](src/app/services/auth.service.ts)
- [src/app/services/photo.service.ts](src/app/services/photo.service.ts)
- [src/app/core/stores/app.store.ts](src/app/core/stores/app.store.ts)
- [src/app/core/guards/auth.guard.ts](src/app/core/guards/auth.guard.ts)

## Observações finais

- Fotos e sessão ficam armazenadas localmente no dispositivo.
- O acesso a Home e Sobre só é liberado após login ativo.
- O projeto foi estruturado para facilitar manutenção, extensão e apresentação acadêmica.
