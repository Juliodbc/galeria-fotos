# Foco — Galeria de Fotos

- **Aluno:** [PREENCHER]
- **Curso:** [PREENCHER]
- **Unidade curricular:** [PREENCHER]

Aplicativo mobile de galeria pessoal: o usuário cria uma conta e entra para acessar a galeria protegida. Pode fotografar, escolher imagens do dispositivo e excluir memórias. Sessão, usuário e fotos são persistidos localmente pelo Capacitor Preferences; nenhuma rota de fotos funciona sem sessão ativa.

## Tecnologias

Ionic Framework, Angular, TypeScript, Reactive Forms, Capacitor Camera, Preferences, Filesystem e Action Sheet.

## Estrutura

`src/app/core` contém models, serviços e AuthGuard. `src/app/pages` contém Login, Cadastro, Tabs, Home e Sobre. Fotos são associadas ao e-mail da sessão ativa.

## Como rodar

```bash
# 1. Instalar Ionic CLI globalmente (se ainda não tiver)
npm install -g @ionic/cli

# 2. Criar o projeto (Angular + template blank)
ionic start galeria-fotos blank --type=angular --capacitor

cd galeria-fotos

# 3. Instalar dependências principais do Capacitor
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli

# 4. Instalar plugins nativos necessários
npm install @capacitor/camera
npm install @capacitor/preferences
npm install @capacitor/filesystem
npm install @capacitor/action-sheet

# 5. Instalar Ionicons (geralmente já vem, mas garantir)
npm install ionicons

# 6. Adicionar a plataforma Android
npx cap add android

# 7. Buildar o projeto web
ionic build

# 8. Sincronizar com o projeto nativo
npx cap sync android

# 9. Abrir no Android Studio
npx cap open android
```

No Android Studio, selecione um emulador ou dispositivo físico e clique em **Run**. Após cada alteração web, execute `ionic build && npx cap sync android`.

## Permissões Android

No `android/app/src/main/AndroidManifest.xml`, mantenha `CAMERA`, `READ_MEDIA_IMAGES`, `READ_EXTERNAL_STORAGE` (até SDK 32) e o recurso de câmera não obrigatório. O app verifica e solicita permissões em runtime antes de câmera ou galeria, explicando ao usuário caso o acesso seja negado.
