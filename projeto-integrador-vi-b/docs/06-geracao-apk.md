# Geração do arquivo APK

[← Voltar ao índice](../README.md)

O aplicativo é construído com Expo, e a geração do APK é feita pelo **[EAS Build](https://docs.expo.dev/build/introduction/)** — o serviço de compilação da própria Expo. O processo abaixo descreve o caminho completo, do projeto ao arquivo instalável.

---

## 1. Por que o EAS Build

Um projeto Expo pode ser executado durante o desenvolvimento pelo Expo Go, mas o Expo Go **não gera um arquivo instalável**. Para entregar um `.apk` que rode de forma independente no celular — inclusive com o banco SQLite embarcado e funcionando sem internet — é necessário compilar o projeto.

O EAS Build faz essa compilação na nuvem, o que traz duas vantagens práticas para o grupo:

- Não exige Android Studio, SDK do Android nem JDK instalados na máquina de cada integrante.
- Produz o mesmo artefato independentemente do sistema operacional de quem dispara o build (Windows, macOS ou Linux).

---

## 2. Pré-requisitos

| Requisito | Observação |
|---|---|
| Conta Expo | Gratuita, criada em <https://expo.dev/signup> |
| Node.js LTS | <https://nodejs.org/> |
| EAS CLI | Instalado globalmente |

```bash
npm install -g eas-cli
eas login
```

---

## 3. Configuração do projeto

Executado uma única vez, na raiz do projeto:

```bash
eas build:configure
```

O comando cria o arquivo `eas.json` e vincula o projeto à conta Expo. O arquivo é então ajustado para que o perfil de distribuição interna produza **APK** em vez de AAB (o formato padrão, exigido pela Play Store mas não instalável diretamente):

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
  },
  "submit": {
    "production": {}
  }
}
```

O ponto determinante é `"buildType": "apk"`. Sem ele, o EAS entrega um `.aab`, que não pode ser instalado diretamente no aparelho.

Também é conferido no `app.json` o identificador do pacote, que precisa ser único:

```json
{
  "expo": {
    "name": "+ Saúde Serra",
    "slug": "saude-mais-serra",
    "version": "1.0.0",
    "android": {
      "package": "br.ucs.saudemaisserra",
      "versionCode": 1
    }
  }
}
```

---

## 4. Geração do APK

```bash
eas build --platform android --profile preview
```

O que acontece a partir daí:

1. O EAS CLI compacta o projeto e o envia para os servidores da Expo.
2. Na primeira execução, é oferecida a geração automática da *keystore* de assinatura — o grupo aceita, e a chave passa a ficar guardada na conta Expo e é reutilizada nos builds seguintes.
3. O serviço instala as dependências, executa o `prebuild` (que gera o projeto nativo Android a partir da configuração do Expo) e compila com o Gradle.
4. Ao final, o terminal exibe um link para download e um QR Code. O arquivo `.apk` também fica disponível em <https://expo.dev> → projeto → *Builds*.

O tempo de compilação costuma ficar entre 10 e 20 minutos, variando conforme a fila do plano gratuito.

---

## 5. Instalação no aparelho

1. Baixar o `.apk` pelo link ou lendo o QR Code com o celular.
2. Autorizar a instalação de aplicativos de fontes desconhecidas (Android solicita na primeira vez).
3. Instalar e abrir.

Na primeira abertura, o aplicativo cria o banco SQLite e executa a carga inicial. A partir daí, pode ser usado em modo avião.

---

## 6. Alternativa: compilação local

Caso haja necessidade de gerar o APK sem depender da fila do serviço na nuvem, é possível compilar na própria máquina. Esse caminho exige **Android Studio**, **Android SDK** e **JDK 17** instalados:

```bash
eas build --platform android --profile preview --local
```

Ou, sem o EAS, usando diretamente o Gradle:

```bash
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```

O arquivo é gerado em `android/app/build/outputs/apk/release/app-release.apk`.

---

## 7. Entrega do artefato

Para a entrega da disciplina, o APK gerado é publicado em **Releases** do repositório público no GitHub, acompanhado de:

- Número da versão e data de geração;
- Link direto para download;
- Instruções de instalação;
- `SHA-256` do arquivo, permitindo verificar a integridade do download.

---

## 8. Resumo dos comandos

```bash
# Instalação única
npm install -g eas-cli
eas login
eas build:configure

# A cada versão
eas build --platform android --profile preview
```
