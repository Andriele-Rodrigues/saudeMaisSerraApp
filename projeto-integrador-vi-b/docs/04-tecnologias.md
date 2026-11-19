# Tecnologias, linguagens e bibliotecas

[← Voltar ao índice](../README.md)

Relação das tecnologias utilizadas na construção do aplicativo, com os respectivos links oficiais.

---

## Linguagens

| Tecnologia | Uso no projeto | Link |
|---|---|---|
| TypeScript 5.9 | Linguagem principal do aplicativo | <https://www.typescriptlang.org/> |
| JavaScript (ES2023) | Scripts auxiliares e arquivos de configuração | <https://developer.mozilla.org/pt-BR/docs/Web/JavaScript> |
| SQL (dialeto SQLite) | Criação do esquema e consultas ao banco local | <https://www.sqlite.org/lang.html> |

---

## Framework e plataforma

| Tecnologia | Uso no projeto | Link |
|---|---|---|
| React Native 0.81 | Framework de construção da interface móvel | <https://reactnative.dev/> |
| React 19.1 | Biblioteca de componentes e estado | <https://react.dev/> |
| Expo SDK 54 | Plataforma de desenvolvimento, execução e build | <https://expo.dev/> |
| Expo Router 6 | Navegação baseada em sistema de arquivos | <https://docs.expo.dev/router/introduction/> |
| EAS Build | Serviço de geração do arquivo APK | <https://docs.expo.dev/build/introduction/> |

---

## Banco de dados local

| Tecnologia | Uso no projeto | Link |
|---|---|---|
| SQLite 3 | Banco de dados relacional embarcado no dispositivo | <https://www.sqlite.org/> |
| expo-sqlite | Biblioteca de acesso ao SQLite no React Native | <https://docs.expo.dev/versions/latest/sdk/sqlite/> |

---

## Bibliotecas de interface e navegação

| Tecnologia | Uso no projeto | Link |
|---|---|---|
| React Navigation 7 | Base das pilhas e abas usadas pelo Expo Router | <https://reactnavigation.org/> |
| @expo/vector-icons | Ícones da interface (Ionicons e MaterialCommunityIcons) | <https://docs.expo.dev/guides/icons/> |
| react-native-screens | Otimização nativa das telas de navegação | <https://github.com/software-mansion/react-native-screens> |
| react-native-safe-area-context | Ajuste de áreas seguras da tela | <https://github.com/th3rdwave/react-native-safe-area-context> |
| react-native-gesture-handler | Tratamento de gestos de toque usado pela navegação | <https://docs.swmansion.com/react-native-gesture-handler/> |
| react-native-reanimated 4 | Animações usadas pela navegação | <https://docs.swmansion.com/react-native-reanimated/> |
| expo-splash-screen | Tela de abertura do aplicativo (configurada no `app.json`) | <https://docs.expo.dev/versions/latest/sdk/splash-screen/> |
| expo-linking | Abertura de links externos (telefone e rotas no mapa) | <https://docs.expo.dev/versions/latest/sdk/linking/> |

Também estão no `package.json`, por virem do modelo inicial do Expo, `expo-constants`, `expo-font`, `expo-haptics`, `expo-image`, `expo-status-bar`, `expo-symbols`, `expo-system-ui`, `expo-web-browser`, `react-native-web`, `react-native-webview` e `react-native-worklets`. Elas não são usadas diretamente pelas telas.

---

## Visualização de dados

O painel de indicadores (`app/(tabs)/indicadores.tsx`) desenha os gráficos de barras com componentes `View` do próprio React Native, com largura proporcional ao valor. Não foi adicionada nenhuma biblioteca de gráficos.

---

## Trabalhos futuros

Bibliotecas previstas na Etapa 1 que não foram usadas nesta entrega:

| Tecnologia | Uso previsto | Link |
|---|---|---|
| react-native-maps | Exibição de estabelecimentos no mapa (está no `package.json`, mas nenhuma tela a usa; as rotas abrem o Google Maps por link) | <https://github.com/react-native-maps/react-native-maps> |
| expo-location | Obtenção da localização para ordenar por proximidade | <https://docs.expo.dev/versions/latest/sdk/location/> |
| expo-notifications | Lembretes locais de consultas e exames | <https://docs.expo.dev/versions/latest/sdk/notifications/> |
| react-native-gifted-charts e react-native-svg | Gráficos mais elaborados no painel de indicadores | <https://github.com/Abhinandan-Kushwaha/react-native-gifted-charts> |

---

## Ferramentas de desenvolvimento

| Tecnologia | Uso no projeto | Link |
|---|---|---|
| Node.js | Ambiente de execução das ferramentas | <https://nodejs.org/> |
| npm | Gerenciador de pacotes | <https://www.npmjs.com/> |
| ESLint 9 + eslint-config-expo | Padronização e análise estática do código | <https://eslint.org/> |
| Metro | Empacotador de módulos do React Native | <https://metrobundler.dev/> |
| Git e GitHub | Versionamento e repositório público | <https://github.com/> |
| Figma | Prototipação dos wireframes | <https://www.figma.com/> |
| Visual Studio Code | Editor de código | <https://code.visualstudio.com/> |
| Expo Go / Development Build | Execução do aplicativo durante o desenvolvimento | <https://docs.expo.dev/develop/development-builds/introduction/> |

---

