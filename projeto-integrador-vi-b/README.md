# + Saúde Serra

**Projeto Integrador VI-B — 2026/2**
Universidade de Caxias do Sul — EAD UCS
Curso de Análise e Desenvolvimento de Sistemas

Aplicativo móvel para gestão de serviços de saúde na região da Serra Gaúcha, com **banco de dados local (SQLite)** que funciona integralmente **sem conexão com a internet**.

---

## Índice da documentação

| # | Documento | Conteúdo |
|---|---|---|
| 1 | Este arquivo | Nome do projeto, problema, público-alvo e integrantes |
| 2 | [Requisitos de usuário](docs/01-requisitos-de-usuario.md) | Funcionalidades e histórias de usuário |
| 3 | [Modelo ER](docs/02-modelo-er.md) | Modelagem entidade-relacionamento do banco local |
| 4 | [Banco de dados local](docs/03-banco-local-sqlite.md) | Como o SQLite será implementado no aplicativo |
| 5 | [Tecnologias](docs/04-tecnologias.md) | Linguagens, frameworks e bibliotecas utilizadas |
| 6 | [Wireframes](docs/05-wireframes.md) | Design das telas em alta definição |
| 7 | [Geração do APK](docs/06-geracao-apk.md) | Processo de build do arquivo `.apk` |

---

## 1. Nome do projeto

**+ Saúde Serra**

---

## 2. Problema que resolve

Encontrar atendimento de saúde na Serra Gaúcha hoje é um processo fragmentado. O paciente precisa descobrir por conta própria quais clínicas, hospitais e laboratórios existem perto dele, descobrir quais profissionais atendem cada especialidade, ligar para cada estabelecimento para saber de horários e, depois, controlar manualmente suas consultas e exames — geralmente em papel ou na memória. Quem não sabe qual especialista procurar acaba consumindo uma consulta com clínico geral apenas para conseguir um encaminhamento.

Some-se a isso um problema prático de conectividade: boa parte dos municípios da Serra tem áreas com sinal de dados instável, e aplicativos de saúde que dependem totalmente de conexão deixam o usuário sem acesso justamente no momento em que ele precisa conferir o endereço ou o horário da consulta.

**Como o aplicativo resolve:**

- Reúne em um só lugar os estabelecimentos de saúde da região, organizados por tipo e por especialidade, a partir de dados públicos do CNES.
- Permite buscar o profissional pela especialidade desejada, sem necessidade de encaminhamento prévio.
- Centraliza o agendamento e o acompanhamento de consultas e exames do usuário.
- Mantém **todo o conteúdo em um banco SQLite dentro do próprio celular**: a busca, a agenda e o histórico continuam funcionando mesmo sem internet.
- Transforma o histórico armazenado localmente em **informação para decisão**: o aplicativo analisa os próprios dados do usuário e da rede (especialidades mais procuradas, notas médias dos prestadores, taxa de cancelamento, horários de maior disputa) e apresenta esses indicadores de forma visual.

Esse último ponto responde à questão norteadora do Projeto Integrador VI-B: o aplicativo não apenas melhora a presença digital do serviço de saúde, mas gera análise de dados que apoia tanto a decisão do paciente (qual prestador escolher) quanto a do estabelecimento (onde há demanda reprimida).

---

## 3. Público-alvo

**Usuário primário — pacientes da região da Serra Gaúcha**
Pessoas de 18 a 70 anos, moradoras de Caxias do Sul e municípios vizinhos, que precisam marcar consultas e exames e acompanhar o próprio histórico de saúde. Inclui um perfil importante: usuários com baixa familiaridade digital e com plano de dados limitado, para quem o funcionamento offline é determinante.

**Usuário secundário — pacientes em deslocamento**
Moradores do interior e turistas que precisam localizar atendimento em uma cidade que não conhecem, frequentemente em áreas com sinal fraco.

**Beneficiário indireto — clínicas, consultórios e laboratórios da região**
Estabelecimentos de pequeno e médio porte que ganham visibilidade digital e passam a receber retorno estruturado (avaliações e indicadores de procura) sem precisar manter um sistema próprio.

---

## 4. Integrantes do grupo

O aplicativo possui uma tela dedicada (`app/(tabs)/guia-medico/equipe.tsx`) exibindo o nome completo de todos os integrantes, conforme exigido na Etapa 1.

| Nome completo | Função no projeto |
|---|---|
| Andriele Rodrigues | *(a definir)* |
| *(preencher)* | *(a definir)* |
| *(preencher)* | *(a definir)* |
| *(preencher)* | *(a definir)* |

> **Pendência:** completar os nomes e funções dos demais integrantes antes da entrega. A avaliação desconta 25% da nota final para grupos com menos de 3 integrantes.

---

## 5. Origem dos dados

| Fonte | Uso no projeto | Link |
|---|---|---|
| CNES — Cadastro Nacional de Estabelecimentos de Saúde | Carga inicial de estabelecimentos, tipos e especialidades da região da Serra | <http://cnes.datasus.gov.br/> |
| Portal Brasileiro de Dados Abertos | Complemento de dados de unidades públicas de saúde | <https://dados.gov.br/dataset> |

Como o requisito do projeto exige que o banco funcione **localmente, mesmo sem conexão**, essas bases **não são consultadas em tempo de execução**. Elas são baixadas e tratadas uma única vez durante o desenvolvimento, filtradas para os municípios da Serra e embarcadas no aplicativo como carga inicial (*seed*) do SQLite. O detalhamento desse processo está em [Banco de dados local](docs/03-banco-local-sqlite.md).
