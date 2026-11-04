# Geração do Arquivo APK

[Voltar ao índice](../README.md)

## 1. Ferramenta utilizada (EAS Build)

Como o aplicativo foi desenvolvido utilizando React Native com **Expo (SDK 54)**, a geração do arquivo instalável `.apk` para Android é feita através do **[EAS Build](https://docs.expo.dev/build/introduction/)** (Expo Application Services).

Durante o desenvolvimento usamos o Expo Go para testar as telas rapidamente, mas o Expo Go não gera um arquivo `.apk` independente. Com o EAS Build conseguimos compilar o aplicativo completo (já empacotando o banco de dados local `expo-sqlite` e os dados iniciais) diretamente nos servidores da Expo, com duas vantagens principais para a equipe:

- Não exige que todos os integrantes tenham o Android Studio pesado e o Android SDK configurados localmente para gerar o instalador.
- Garante que o build ocorra sempre no mesmo ambiente padronizado, evitando erros de versão de Java/Gradle entre computadores diferentes.

## 2. Pré-requisitos

Para gerar o APK a partir do repositório do projeto, é necessário ter:

1. **Node.js (versão LTS)** instalado na máquina (<https://nodejs.org/>).
2. **Conta gratuita no Expo** criada em <https://expo.dev/signup>.
3. **EAS CLI** instalado globalmente via terminal:

```bash
npm install -g eas-cli
```

Em seguida, fazemos a autenticação da conta no terminal:

```bash
eas login
```

## 3. Configuração do projeto para gerar APK

Na raiz do projeto, executamos o comando de configuração do EAS:

```bash
eas build:configure
```

Por padrão, o Expo configura os builds de Android no formato `.aab` (Android App Bundle), que é o formato exigido para publicar na Google Play Store, mas que não pode ser instalado diretamente no celular.

Para que o build gere um arquivo **`.apk`** instalável diretamente em qualquer aparelho Android ou emulador, ajustamos o arquivo `eas.json` na raiz do projeto definindo `"buildType": "apk"` no perfil `preview`:

```json
{
  "cli": {
    "version": ">= 12.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true,
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

Além disso, no arquivo `app.json` já existente no projeto, fica definido o identificador único do pacote Android (`android.package`):

```json
{
  "expo": {
    "name": "SaudeMaisSerraApp",
    "slug": "SaudeMaisSerraApp",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "SaudeMaisSerraApp",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "package": "br.ucs.saudemaisserra"
    }
  }
}
```

## 4. Comando para gerar o APK

Com o `eas.json` e o `app.json` configurados, disparamos a compilação pelo terminal:

```bash
eas build --platform android --profile preview
```

Durante a execução desse comando:

1. O EAS CLI verifica as dependências do `package.json`, compacta os arquivos do projeto e envia para o servidor de build da Expo.
2. Na primeira vez que o comando é rodado, o terminal pergunta se desejamos gerar uma nova *Android Keystore* para assinar o aplicativo (basta confirmar com `Yes`, e a Expo passa a gerenciar essa chave automaticamente nos próximos builds).
3. O servidor executa o `expo prebuild` (criando a pasta nativa `android/`) e roda o Gradle para compilar o código TypeScript/React Native e as bibliotecas nativas como o `expo-sqlite`.
4. Quando o processo termina (leva em média de 10 a 15 minutos), o terminal mostra o link direto para baixar o `.apk` e um QR Code para instalar direto no celular, além de deixar o arquivo salvo no painel web do Expo (em *Builds*).

## 5. Alternativa: compilação local (sem nuvem)

Caso seja necessário gerar o APK localmente na própria máquina (sem usar a fila na nuvem da Expo), tendo o **Android SDK** e o **JDK 17** instalados, também podemos gerar o projeto nativo e compilar direto pelo Gradle com os comandos:

```bash
# 1. Gera a pasta nativa android/ a partir do app.json
npx expo prebuild --platform android

# 2. Entra na pasta android e compila o APK de release
cd android
./gradlew assembleRelease
```

Nesse modo local, o arquivo `.apk` final é gerado na pasta:

```text
android/app/build/outputs/apk/release/app-release.apk
```

## 6. Instalação e disponibilização na entrega

Para instalar e testar o APK gerado:

1. Transferir o arquivo `.apk` para o celular Android (ou baixar pelo link/QR Code gerado pelo EAS Build) ou arrastar o arquivo para cima do emulador Android Studio.
2. Permitir a instalação no Android (caso o aparelho peça permissão para instalar aplicativos fora da Play Store).
3. Abrir o aplicativo **+ Saúde Serra**, momento em que o banco local `saude_serra.db` será inicializado no aparelho para uso offline.

Na entrega final do projeto (Etapa 2), o arquivo `.apk` gerado será anexado junto ao repositório no GitHub (na aba **Releases** ou na raiz do projeto, conforme solicitado na entrega).
