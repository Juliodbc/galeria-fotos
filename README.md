# Foco — Galeria de Fotos

- **Aluno:** [PREENCHER]
- **Curso:** [PREENCHER]
- **Unidade curricular:** [PREENCHER]

## Explicação do projeto

Este projeto é um aplicativo mobile de galeria pessoal desenvolvido em Ionic + Vue + TypeScript com Capacitor. A aplicação possui fluxo completo de autenticação local, controle de sessão com Preferences e uma área protegida para guardar fotos capturadas ou selecionadas da galeria.

O usuário pode:
- criar uma conta com validação de nome, e-mail e senha;
- fazer login somente com credenciais salvas localmente;
- acessar a Home e a tela Sobre somente quando há sessão ativa;
- adicionar imagens pela câmera ou pela galeria do dispositivo;
- visualizar o grid de fotos em formato responsivo;
- remover imagens com confirmação antes da exclusão;
- fazer logout para encerrar a sessão e bloquear o acesso às telas protegidas.

## Tecnologias utilizadas

- Ionic Vue
- Vue 3
- TypeScript
- Vue Router
- Capacitor
- Capacitor Camera
- Capacitor Preferences
- Capacitor Action Sheet
- Ionicons
- Vite

## Estrutura de pastas

```text
galeria-fotos/
├── android/                     # projeto Android nativo gerado pelo Capacitor
├── public/                      # arquivos públicos estáticos
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   └── guards/
│   │   │       └── auth.guard.ts
│   │   ├── models/
│   │   │   ├── photo.ts
│   │   │   └── user.ts
│   │   └── services/
│   │       ├── auth.service.ts
│   │       └── photo.service.ts
│   ├── router/
│   │   └── index.ts
│   ├── services/
│   │   └── storage.ts
│   ├── theme/
│   │   └── variables.css
│   ├── views/
│   │   ├── AboutPage.vue
│   │   ├── HomePage.vue
│   │   ├── LoginPage.vue
│   │   ├── RegisterPage.vue
│   │   └── TabsPage.vue
│   ├── App.vue
│   ├── main.ts
│   └── vite-env.d.ts
├── capacitor.config.ts
├── index.html
├── package.json
├── README.md
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── ...
```

## Como rodar

A sequência abaixo reproduce a criação do projeto, a instalação das dependências, o preparo do Android e a abertura no emulador/dispositivo:

```bash
# 1) Instalar o Ionic CLI globalmente (se ainda não estiver instalado)
npm install -g @ionic/cli

# 2) Criar o projeto Ionic com Vue + Capacitor
ionic start galeria-fotos blank --type=vue --capacitor
cd galeria-fotos

# 3) Instalar dependências do app
npm install

# 4) Instalar plugins do Capacitor que o projeto usa
npm install @capacitor/core @capacitor/android @capacitor/camera @capacitor/preferences @capacitor/action-sheet @capacitor/filesystem ionicons

# 5) Adicionar o Android ao projeto
npx cap add android

# 6) Rodar build do front-end
npm run build

# 7) Sincronizar o projeto nativo com os arquivos web gerados
npx cap sync android

# 8) Abrir o Android Studio
npx cap open android
```

Após abrir no Android Studio:
- selecione um emulador ou dispositivo conectado;
- clique em Run;
- teste o fluxo de login, cadastro, galeria, exclusão e logout.

Se houver alterações no código após a primeira execução, repita:

```bash
npm run build
npx cap sync android
```

## Fluxo de uso

1. O usuário acessa a tela de login.
2. Se não tiver conta, pode navegar para cadastro.
3. Após registrar, a conta fica salva localmente no armazenamento do dispositivo.
4. O login cria a sessão ativa e libera o acesso às telas protegidas.
5. Na tela Home, o usuário pode capturar uma foto ou escolher uma imagem da galeria.
6. A imagem é salva localmente e vinculada ao usuário logado.
7. O usuário pode remover fotos com confirmação.
8. Ao clicar em logout, a sessão é apagada e a navegação volta para a tela de login.

## Permissões Android

O aplicativo solicita permissões de câmera e galeria em runtime antes de abrir a câmera ou a seleção de imagens. O manifest do projeto inclui as permissões necessárias para garantir acesso compatível com Android.

## Observações finais

- Somente usuários autenticados podem acessar a galeria e a área Sobre.
- As fotos ficam persistidas localmente no dispositivo, separadas por conta.
- O projeto foi estruturado para facilitar manutenção, organização e evolução futura.
