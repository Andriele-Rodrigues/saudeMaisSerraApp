# Vídeo demonstrativo

[← Voltar ao índice](../README.md)

**Link do vídeo:** [Assistir no YouTube](LINK_DO_VIDEO_AQUI)

## O que o vídeo mostra

1. **Organização do repositório:** pastas `app/` (telas com Expo Router), `src/database/` (esquema, migração, carga inicial e repositories), `contexts/`, `assets/seed/` e a documentação em `projeto-integrador-vi-b/`.
2. **Banco de dados local:** criação do `saude_serra.db` na primeira abertura, com as tabelas do modelo ER e a carga inicial a partir de `assets/seed/dados-iniciais.json`.
3. **Fluxo principal no emulador:** busca no Guia Médico por tipo e especialidade, escolha de um médico, agendamento de dia e horário, conferência na Agenda e cancelamento.
4. **Validação de conflito:** tentativa de agendar um horário já ocupado pelo mesmo profissional.
5. **Avaliação de atendimento:** avaliação de um agendamento realizado, com nota em estrelas e comentário.
6. **Painel de indicadores:** gráficos de barras gerados pelas consultas de agregação no SQLite.
7. **Favoritos e equipe:** marcação de um estabelecimento como favorito e a tela "Equipe do projeto".
8. **Funcionamento offline:** o aplicativo em modo avião, fechado e reaberto, mantendo os dados salvos.
