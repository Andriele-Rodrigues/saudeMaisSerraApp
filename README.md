# + Saúde Serra

Aplicativo móvel para encontrar atendimento de saúde na Serra Gaúcha, agendar consultas e exames e acompanhar o próprio histórico, com **banco de dados local (SQLite)** que funciona **sem conexão com a internet**.

**Projeto Integrador VI-B — 2026/2**
Universidade de Caxias do Sul (EAD UCS) — Análise e Desenvolvimento de Sistemas

---

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Documentação](#documentação)
- [Tecnologias](#tecnologias)
- [Como executar](#como-executar)
- [Download do APK](#download-do-apk)
- [Vídeo demonstrativo](#vídeo-demonstrativo)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Integrantes](#integrantes)

---

## Sobre o projeto

Encontrar atendimento de saúde na Serra Gaúcha é um processo fragmentado. O paciente precisa descobrir sozinho quais clínicas, hospitais e laboratórios existem perto dele e quais profissionais atendem cada especialidade. Depois, ainda precisa controlar as consultas e os exames manualmente. Além disso, muitos municípios da região têm sinal de dados instável.

O **+ Saúde Serra** reúne esses serviços em um só lugar:

- busca de estabelecimentos e profissionais por tipo e por especialidade;
- agendamento e acompanhamento de consultas e exames;
- todos os dados armazenados no próprio celular, funcionando mesmo em modo avião;
- indicadores gerados a partir dos dados locais para apoiar a escolha de prestadores e horários.

A descrição completa do problema, do público-alvo e da origem dos dados está em [`projeto-integrador-vi-b/README.md`](projeto-integrador-vi-b/README.md).

---

## Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| Guia Médico | Busca de médicos e estabelecimentos por tipo e especialidade, lida do banco local |
| Detalhes do prestador | Tipo, especialidades, endereço, contato, rotas (mapa externo) e equipe médica |
| Agendamento | Escolha de médico, dia e horário, com validação de conflito e gravação no SQLite |
| Minha Agenda | Próximos agendamentos separados do histórico, com cancelamento |
| Exames e medicação | Telas de consulta com dados de exemplo (ainda sem gravação no banco) |
| Favoritos | Estabelecimentos marcados para acesso rápido, salvos no banco |
| Avaliação de atendimento | Nota de 1 a 5 e comentário para atendimentos realizados |
| Painel de indicadores | Gráficos de barras gerados por consultas de agregação no banco local |
| Equipe do projeto | Tela com os nomes completos dos integrantes, acessível pelo Perfil |

> A lista completa de requisitos e histórias de usuário está em [Requisitos de usuário](projeto-integrador-vi-b/docs/01-requisitos-de-usuario.md).

---

## Documentação

| # | Documento | Conteúdo |
|---|---|---|
| 1 | [Visão geral do projeto](projeto-integrador-vi-b/README.md) | Problema, público-alvo e origem dos dados |
| 2 | [Requisitos de usuário](projeto-integrador-vi-b/docs/01-requisitos-de-usuario.md) | Funcionalidades, requisitos não funcionais e histórias de usuário |
| 3 | [Modelo ER](projeto-integrador-vi-b/docs/02-modelo-er.md) | Modelagem entidade-relacionamento do banco local |
| 4 | [Banco de dados local](projeto-integrador-vi-b/docs/03-banco-local-sqlite.md) | Implementação do SQLite no aplicativo |
| 5 | [Tecnologias](projeto-integrador-vi-b/docs/04-tecnologias.md) | Linguagens, frameworks e bibliotecas, com links |
| 6 | [Wireframes](projeto-integrador-vi-b/docs/05-wireframes.md) | Design das telas e mapa de navegação |
| 7 | [Geração do APK](projeto-integrador-vi-b/docs/06-geracao-apk.md) | Processo de build do arquivo `.apk` |
| 8 | [Vídeo demonstrativo](projeto-integrador-vi-b/docs/07-video-demonstrativo.md) | Link e roteiro do vídeo de apresentação |

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Linguagem | [TypeScript](https://www.typescriptlang.org/) |
| Framework | [React Native](https://reactnative.dev/) com [Expo SDK 54](https://expo.dev/) |
| Navegação | [Expo Router](https://docs.expo.dev/router/introduction/) |
| Banco de dados local | [SQLite](https://www.sqlite.org/) via [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/) |
| Geração do APK | [EAS Build](https://docs.expo.dev/build/introduction/) |

A relação completa está em [Tecnologias](projeto-integrador-vi-b/docs/04-tecnologias.md).

---

## Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS)
- [Android Studio](https://developer.android.com/studio) com um emulador configurado **ou** o app [Expo Go](https://expo.dev/go) no celular

### Passo a passo

```bash
# 1. Clonar o repositório
git clone https://github.com/Andriele-Rodrigues/saudeMaisSerraApp.git
cd saudeMaisSerraApp

# 2. Instalar as dependências
npm install

# 3. Iniciar o projeto
npx expo start
```

Com o servidor iniciado, pressione `a` para abrir no emulador Android ou leia o QR Code com o Expo Go.

Na primeira execução, o aplicativo cria o banco `saude_serra.db` no aparelho e carrega os dados iniciais. A partir daí, ele funciona sem internet.

---

## Download do APK

O arquivo instalável está disponível na aba **[Releases](https://github.com/Andriele-Rodrigues/saudeMaisSerraApp/releases)** do repositório.

Para instalar:

1. Baixe o arquivo `.apk` no celular Android ou arraste-o para o emulador.
2. Permita a instalação de aplicativos de fontes externas, se o Android solicitar.
3. Abra o **+ Saúde Serra**.

O processo de geração do APK está descrito em [Geração do APK](projeto-integrador-vi-b/docs/06-geracao-apk.md).

---

## Vídeo demonstrativo

Apresentação do código-fonte, da organização do projeto e do aplicativo em funcionamento no emulador:

**[Assistir no YouTube](LINK_DO_VIDEO_AQUI)**

---

## Estrutura do repositório

```text
saudeMaisSerraApp/
├── app/                      # Telas do aplicativo (Expo Router)
│   ├── _layout.tsx           # Layout raiz, SQLiteProvider e providers
│   └── (tabs)/               # Abas: Início, Carteira, Agenda, Perfil e telas internas
│       └── guia-medico/      # Fluxo de busca e agendamento
├── src/
│   └── database/             # Esquema, migração, carga inicial e repositories do SQLite
├── assets/
│   ├── images/               # Ícones, logo e splash
│   └── seed/                 # dados-iniciais.json (carga inicial do banco)
├── contexts/                 # Estado compartilhado (agendamentos, favoritos)
├── constants/                # Tema e cores
├── hooks/                    # Hooks reutilizáveis
├── projeto-integrador-vi-b/  # Documentação do Projeto Integrador
│   ├── README.md
│   └── docs/                 # Requisitos, modelo ER, banco, tecnologias, wireframes, APK, vídeo
├── app.json                  # Configuração do Expo
├── eas.json                  # Perfis de build do EAS (APK)
└── package.json              # Dependências e scripts
```

---

## Integrantes

| Nome completo |
|---|
| Andriele Rodrigues |
| Bruno Kunzler Borges |
| Felipe Vicentini |
| Jeferson Rodrigues Duarte |
| Matheus Feijó Barp |
