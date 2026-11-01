# Requisitos de usuário

[← Voltar ao índice](../README.md)

## 1. Características do aplicativo (funcionalidades)

### Funcionalidades essenciais

| # | Funcionalidade | Descrição |
|---|---|---|
| F01 | Catálogo de serviços de saúde | Listagem dos tipos de serviço (clínicas, hospitais, laboratórios, consultórios) em cards navegáveis |
| F02 | Busca por especialidade | Localização de prestadores por especialidade médica, sem necessidade de encaminhamento |
| F03 | Busca por proximidade | Filtro por cidade e bairro, com ordenação por distância |
| F04 | Detalhamento do prestador | Ficha com nome, registro profissional, especialidades, locais de atendimento, contatos e nota média |
| F05 | Agendamento de consultas e exames | Seleção de prestador, data e horário, com confirmação e gravação local |
| F06 | Minha agenda | Listagem dos agendamentos do usuário, com cancelamento e reagendamento |
| F07 | Acompanhamento de exames | Registro e acompanhamento do status de exames solicitados |
| F08 | Avaliação de serviços | Nota de 1 a 5 e comentário, liberados após a data do atendimento |
| F09 | Favoritos | Marcação de prestadores e estabelecimentos de uso frequente |
| F10 | Notificações e lembretes | Alertas locais de consultas próximas e de exames pendentes |
| F11 | Painel de indicadores | Visualização analítica dos dados armazenados localmente |
| F12 | Tela da equipe | Exibição do nome completo dos integrantes do grupo (requisito da disciplina) |

### Funcionalidade de análise de dados (F11, detalhada)

O painel consulta exclusivamente o banco SQLite do dispositivo e apresenta:

- **Especialidades mais procuradas** — ranking por número de agendamentos.
- **Melhores avaliados** — prestadores ordenados por nota média, com o número de avaliações ao lado para dar contexto à média.
- **Taxa de comparecimento** — proporção entre agendamentos realizados, cancelados e não comparecidos.
- **Horários de maior disputa** — distribuição dos agendamentos por faixa de horário e dia da semana.
- **Histórico pessoal** — evolução de consultas e exames do usuário ao longo do tempo.

Esses indicadores apoiam a decisão em duas frentes: para o paciente, qual prestador e qual horário escolher; para o estabelecimento, onde existe demanda não atendida.

### Requisito não funcional determinante

**RNF01 — Operação offline.** Todas as funcionalidades acima, com exceção da atualização opcional da base, devem operar com o aparelho em modo avião. O banco SQLite reside no dispositivo e é a única fonte de dados em tempo de execução.

---

## 2. Histórias de usuário

### HU01 — Visualizar os tipos de serviço disponíveis

> **Eu, como paciente**, gostaria de visualizar os tipos de serviços disponíveis (clínicas, hospitais, laboratórios, etc.), **para** escolher o serviço desejado e localizar estabelecimentos próximos da minha região.

**Descrição**
O sistema apresenta uma lista categorizada de tipos de serviço, lida da tabela `especialidade`/`estabelecimento` do banco local. Cada tipo é representado por um card com ícone que, ao ser tocado, abre a lista de estabelecimentos daquela categoria filtrada pela cidade do usuário.

**Critérios de aceite**
- A lista de tipos carrega sem conexão com a internet.
- Tocar em uma categoria exibe apenas estabelecimentos ativos daquela categoria.
- Os resultados são ordenados por proximidade quando a localização está disponível e por nome quando não está.
- Categoria sem resultados exibe mensagem orientando nova busca.

---

### HU02 — Consultar especializações dos prestadores

> **Eu, como paciente**, gostaria de consultar as especializações dos prestadores de saúde, **para** identificar rapidamente quais profissionais atendem à minha necessidade específica, sem precisar passar por um clínico geral para obter encaminhamento.

**Descrição**
O usuário filtra primeiro o tipo de prestador (hospital, clínica ou profissional) e depois a especialidade (cardiologia, ortopedia, pediatria etc.). O sistema retorna os prestadores correspondentes com suas informações completas.

**Critérios de aceite**
- A busca aceita texto parcial no nome da especialidade.
- Cada resultado exibe nome completo, especialidade, local de atendimento, contato e nota média.
- É possível refinar por cidade e bairro.
- Tocar em um resultado abre a ficha completa com acesso direto ao agendamento.
- Busca sem resultados exibe mensagem amigável com sugestões.

---

### HU03 — Escolher data e horário do atendimento

> **Eu, como usuário do aplicativo**, quero ver as datas e os horários disponíveis ao marcar uma consulta ou exame, **para** conseguir me planejar e escolher um horário que me atenda.

**Descrição**
Ao selecionar um prestador, o sistema exibe um calendário com as datas que possuem disponibilidade. Ao tocar em uma data, são exibidos os horários livres daquela data. O horário escolhido gera um registro em `agendamento` e dispara uma notificação local de confirmação.

**Critérios de aceite**
- Somente horários livres e futuros são exibidos como selecionáveis.
- A confirmação grava o agendamento no banco local imediatamente, sem depender de rede.
- O agendamento confirmado aparece em "Minha agenda".
- O usuário pode cancelar ou alterar o agendamento, e o horário liberado volta a ficar disponível.
- Um mesmo horário não pode ser reservado duas vezes para o mesmo prestador.

---

### HU04 — Avaliar o atendimento recebido

> **Eu, como paciente que já foi atendido**, gostaria de avaliar o prestador com nota e comentário, **para** ajudar outros usuários a escolherem melhor e dar retorno ao estabelecimento.

**Descrição**
Após a data do agendamento, o aplicativo habilita a avaliação daquele atendimento. A nota vai de 1 a 5 e alimenta a média exibida na ficha do prestador.

**Critérios de aceite**
- A avaliação só é liberada para agendamentos já ocorridos.
- Cada agendamento admite uma única avaliação.
- A nota média e a quantidade de avaliações do prestador são recalculadas no momento em que a avaliação é gravada.

---

### HU05 — Acompanhar meus indicadores de saúde

> **Eu, como paciente**, gostaria de ver um resumo visual dos meus atendimentos e das informações da rede, **para** tomar decisões melhores sobre onde e quando me consultar.

**Descrição**
Painel com gráficos construídos a partir de consultas de agregação (`COUNT`, `AVG`, `GROUP BY`) executadas diretamente no SQLite local.

**Critérios de aceite**
- Os gráficos são gerados sem conexão com a internet.
- Cada indicador informa o período considerado e o total de registros da amostra.
- A tela permanece utilizável quando ainda há poucos dados, exibindo um estado vazio explicativo em vez de gráficos vazios.
