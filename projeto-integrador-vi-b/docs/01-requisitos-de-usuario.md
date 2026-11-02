Requisitos de usuário
← Voltar ao índice
1. Características do aplicativo (funcionalidades)
Funcionalidades essenciais
#	Funcionalidade	Descrição
F01	Catálogo de serviços de saúde	Listagem dos tipos de estabelecimento (clínicas, hospitais, laboratórios, consultórios) em cards navegáveis
F02	Busca por especialidade	Localização de prestadores por especialidade médica, sem necessidade de encaminhamento
F03	Busca por proximidade	Filtro por cidade e bairro, com ordenação por distância
F04	Detalhamento do prestador	Ficha com nome, registro profissional, especialidades, locais de atendimento, contatos e nota média
F05	Agendamento de consultas e exames	Seleção de prestador, data e horário, com confirmação e gravação local
F06	Minha agenda	Listagem dos agendamentos do usuário, com cancelamento e reagendamento
F07	Acompanhamento de exames	Registro e acompanhamento do status de exames solicitados
F08	Avaliação de serviços	Nota de 1 a 5 e comentário, liberados após o término do atendimento
F09	Favoritos	Marcação de prestadores e estabelecimentos de uso frequente
F10	Notificações e lembretes	Alertas locais de consultas próximas e de exames pendentes
F11	Painel de indicadores	Visualização analítica dos dados armazenados localmente
F12	Tela da equipe	Exibição do nome completo dos integrantes do grupo (requisito da disciplina)
Funcionalidade de análise de dados (F11, detalhada)
O painel consulta exclusivamente o banco SQLite do dispositivo e apresenta:
Especialidades mais procuradas — ranking por número de agendamentos.
Melhores avaliados — prestadores ordenados por nota média, com o número de avaliações ao lado para dar contexto à média.
Taxa de comparecimento — proporção entre agendamentos realizados, cancelados e não comparecidos.
Horários de maior disputa — distribuição dos agendamentos por faixa de horário e dia da semana.
Histórico pessoal — evolução de consultas e exames do usuário ao longo do tempo.
Esses indicadores apoiam a decisão em duas frentes: para o paciente, qual prestador e qual horário escolher; para o estabelecimento, onde existe demanda não atendida.
Requisitos não funcionais
RNF01 — Operação offline. Todas as funcionalidades acima, com exceção da atualização opcional da base, devem operar com o aparelho em modo avião. O banco SQLite reside no dispositivo e é a única fonte de dados em tempo de execução.
RNF02 — Privacidade dos dados. Os dados pessoais e de saúde do usuário ficam armazenados somente no dispositivo, sem envio a servidores. Dados como CPF e telefone devem ser tratados conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
RNF03 — Plataforma. O aplicativo é distribuído para Android, em arquivo APK, conforme a Etapa 1 do Projeto Integrador VI-B.
RNF04 — Desempenho. Listagens, buscas e o painel de indicadores devem responder sem travar a interface, mesmo com a base local carregada.
---
2. Histórias de usuário
HU01 — Visualizar os tipos de serviço disponíveis
> **Eu, como paciente**, gostaria de visualizar os tipos de serviços disponíveis (clínicas, hospitais, laboratórios, etc.), **para** escolher o serviço desejado e localizar estabelecimentos próximos da minha região.
Descrição
O sistema apresenta uma lista categorizada de tipos de serviço, lida do banco local. Cada tipo é representado por um card com ícone que, ao ser tocado, abre a lista de estabelecimentos daquela categoria filtrada pela cidade do usuário.
Critérios de aceite
A lista de tipos carrega sem conexão com a internet.
Tocar em uma categoria exibe apenas estabelecimentos marcados como ativos no cadastro. Estabelecimentos desativados não aparecem nas buscas.
Os resultados são ordenados por proximidade quando a localização está disponível e por nome quando não está.
Categoria sem resultados exibe mensagem orientando nova busca.
---
HU02 — Consultar especializações dos prestadores
> **Eu, como paciente**, gostaria de consultar as especializações dos prestadores de saúde, **para** identificar rapidamente quais profissionais atendem à minha necessidade específica, sem precisar passar por um clínico geral para obter encaminhamento.
Descrição
O usuário filtra primeiro o tipo de estabelecimento (clínica, hospital, laboratório ou consultório) e depois a especialidade (cardiologia, ortopedia, pediatria etc.). O sistema retorna os prestadores correspondentes com suas informações completas.
Critérios de aceite
A busca aceita texto parcial no nome da especialidade.
Cada resultado exibe nome completo, especialidade, local de atendimento, contato e nota média.
É possível refinar por cidade e bairro.
Tocar em um resultado abre a ficha completa com acesso direto ao agendamento.
Busca sem resultados exibe mensagem amigável com sugestões.
---
HU03 — Escolher data e horário do atendimento
> **Eu, como usuário do aplicativo**, quero ver as datas e os horários disponíveis ao marcar uma consulta ou exame, **para** conseguir me planejar e escolher um horário que me atenda.
Descrição
Ao selecionar um prestador, o sistema exibe um calendário com as datas que possuem disponibilidade. Ao tocar em uma data, são exibidos os horários livres daquela data. O horário escolhido gera um agendamento local e dispara uma notificação de confirmação.
Critérios de aceite
Somente horários livres e futuros são exibidos como selecionáveis.
A confirmação grava o agendamento no aparelho imediatamente, sem depender de rede.
O agendamento confirmado aparece em "Minha agenda".
Um mesmo horário não pode ser reservado duas vezes para o mesmo prestador.
---
HU04 — Avaliar o atendimento recebido
> **Eu, como paciente que já foi atendido**, gostaria de avaliar o prestador com nota e comentário, **para** ajudar outros usuários a escolherem melhor e dar retorno ao estabelecimento.
Descrição
Assim que o horário de término do agendamento passa, o aplicativo habilita a avaliação daquele atendimento. A nota vai de 1 a 5 e alimenta a média exibida na ficha do prestador.
Critérios de aceite
A avaliação só é liberada para agendamentos cujo horário de término já passou.
Cada agendamento admite uma única avaliação.
A nota média e a quantidade de avaliações do prestador são atualizadas no momento em que a avaliação é gravada.
---
HU05 — Acompanhar meus indicadores de saúde
> **Eu, como paciente**, gostaria de ver um resumo visual dos meus atendimentos e das informações da rede, **para** tomar decisões melhores sobre onde e quando me consultar.
Descrição
Painel com gráficos construídos a partir dos dados armazenados no próprio aparelho. Esta história descreve a experiência do usuário; o conteúdo dos indicadores está detalhado na F11.
Critérios de aceite
Os gráficos são exibidos sem conexão com a internet.
Cada indicador informa o período considerado e o total de registros da amostra.
A tela permanece utilizável quando ainda há poucos dados, exibindo um estado vazio explicativo em vez de gráficos vazios.
---
HU06 — Gerenciar meus agendamentos
> **Eu, como paciente**, gostaria de ver, cancelar e reagendar minhas consultas e exames, **para** manter minha agenda atualizada sem precisar ligar para o estabelecimento.
Descrição
A tela "Minha agenda" separa os agendamentos futuros dos já realizados e permite alterar ou cancelar os futuros.
Critérios de aceite
Os agendamentos futuros aparecem separados dos realizados, ordenados por data e horário.
Ao cancelar, o horário volta a ficar disponível para outros pacientes.
Reagendar segue o mesmo fluxo de escolha de data e horário da HU03.
Agendamentos já realizados não podem ser cancelados nem reagendados.
---
HU07 — Acompanhar exames solicitados
> **Eu, como paciente**, gostaria de registrar os exames solicitados pelo médico e acompanhar o status de cada um, **para** não esquecer de realizá-los.
Descrição
O usuário cadastra cada exame com o tipo e a data da solicitação. O exame pode ser agendado pela HU03 e, a partir daí, seu status acompanha o agendamento.
Critérios de aceite
Cada exame exibe tipo, data da solicitação e status (solicitado, agendado ou realizado).
Exames pendentes aparecem destacados na tela inicial.
Um exame agendado mostra a data e o horário do agendamento.
Os exames permanecem disponíveis sem conexão.
---
HU08 — Salvar prestadores e estabelecimentos favoritos
> **Eu, como paciente que usa certos serviços com frequência**, gostaria de marcar prestadores e estabelecimentos como favoritos, **para** encontrá-los rapidamente.
Descrição
Uma marcação simples na ficha do prestador ou do estabelecimento adiciona o item a uma lista de favoritos.
Critérios de aceite
É possível marcar e desmarcar um favorito a partir da ficha.
A lista de favoritos é acessível a partir do perfil.
Um favorito que foi desativado no cadastro continua na lista, mas sinalizado como indisponível.
A lista funciona sem conexão.
---
HU09 — Receber lembretes de consultas e exames
> **Eu, como paciente**, gostaria de receber lembretes de consultas e exames próximos, **para** comparecer no dia e horário certos.
Descrição
O aplicativo gera notificações locais antes de cada consulta agendada e para exames pendentes.
Critérios de aceite
Cada consulta agendada gera um lembrete um dia antes do horário marcado.
Exames com status "solicitado" geram lembrete periódico até serem agendados.
Ao cancelar um agendamento, o lembrete correspondente é removido.
Os lembretes funcionam sem conexão.
---
HU10 — Conhecer a equipe do projeto
> **Eu, como avaliador do projeto**, gostaria de ver o nome completo dos integrantes do grupo em uma tela do aplicativo, **para** identificar os responsáveis pela solução.
Descrição
Tela simples, acessível pelo perfil, com a lista de todos os integrantes do grupo e sua função no projeto.
Critérios de aceite
A tela exibe o nome completo de todos os integrantes do grupo.
A tela funciona sem conexão.
