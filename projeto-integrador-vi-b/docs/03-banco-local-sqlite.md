# Banco de Dados Local (SQLite)

[Voltar ao índice](../README.md)

## 1. Banco de dados escolhido

Para atender ao requisito de funcionamento local e offline do aplicativo, o aplicativo usa o **SQLite 3** utilizando a biblioteca oficial **[expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/)**.

A escolha se deve aos seguintes pontos práticos do projeto:

- O SQLite já vem nativo no Android e no iOS, então o banco roda direto no aparelho do usuário sem depender de internet ou de um servidor externo.
- Como o nosso projeto usa Expo (SDK 54), o pacote `expo-sqlite` funciona direto no build do APK sem precisar configurar código nativo Android manualmente.
- Ele dá suporte completo a chaves estrangeiras (`FOREIGN KEY`), validações (`CHECK`, `UNIQUE`), transações e consultas com agregação (`COUNT`, `AVG`, `GROUP BY`), usadas no painel de indicadores.
- O arquivo do banco (`saude_serra.db`) fica salvo no diretório interno privado do app (gerenciado pelo `defaultDatabaseDirectory` do próprio `expo-sqlite`), sendo criado automaticamente na primeira vez que o usuário abre o aplicativo.

## 2. Instalação no projeto

A biblioteca foi instalada na versão compatível com o Expo SDK 54:

```bash
npx expo install expo-sqlite
```

Antes desta etapa, os dados ficavam fixos em memória (arquivo `mockData`) e os agendamentos e favoritos eram perdidos ao fechar o aplicativo. Hoje todos esses dados vêm do banco local.

## 3. Organização dos arquivos do banco

Nenhuma tela contém SQL. Toda a parte de banco de dados fica na pasta `src/database/`, e as telas e os contextos chamam apenas as funções dos arquivos em `repositories/`:

```text
src/database/
  schema.ts                 // SCHEMA_V1: criação das tabelas, índices e trigger
  migrations.ts             // controle de versão do banco ao abrir o app (PRAGMA user_version)
  seed.ts                   // carga inicial a partir de assets/seed/dados-iniciais.json
  datas.ts                  // conversão de datas para o formato 'YYYY-MM-DD HH:MM:SS'
  repositories/
    pacienteRepository.ts       // usuário local do app (id_paciente = 1)
    prestadorRepository.ts      // especialidades, estabelecimentos, médicos e equipe
    agendamentoRepository.ts    // listar, criar (com validação de conflito) e cancelar
    avaliacaoRepository.ts      // registrar avaliação de atendimento realizado
    favoritoRepository.ts       // listar, adicionar e remover favoritos
    indicadoresRepository.ts    // consultas de agregação do painel
```

Os contextos `contexts/AppointmentsContext.tsx` e `contexts/FavoritesContext.tsx` usam `agendamentoRepository` e `favoritoRepository` e mantêm apenas uma cópia da lista em memória para as telas.

## 4. Estrutura e criação das tabelas

A inicialização do banco acontece em `app/_layout.tsx` com o componente `SQLiteProvider` do `expo-sqlite`. O parâmetro `onInit` garante que as tabelas sejam criadas antes de carregar as telas:

```tsx
// app/_layout.tsx
import { migrateDbIfNeeded } from '@/src/database/migrations';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import React from 'react';
import { AppointmentsProvider } from '../contexts/AppointmentsContext';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="saude_serra.db" onInit={migrateDbIfNeeded}>
      <AppointmentsProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </AppointmentsProvider>
    </SQLiteProvider>
  );
}
```

O script SQL abaixo é o conteúdo de `SCHEMA_V1`, em `src/database/schema.ts`, e segue o [Modelo ER](02-modelo-er.md):

```sql
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS paciente (
  id_paciente INTEGER PRIMARY KEY AUTOINCREMENT,
  nome_completo TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  cpf TEXT UNIQUE,
  telefone TEXT,
  cidade TEXT,
  criado_em TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS especialidade (
  id_especialidade INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL UNIQUE,
  descricao TEXT,
  icone TEXT
);

CREATE TABLE IF NOT EXISTS estabelecimento (
  id_estabelecimento INTEGER PRIMARY KEY AUTOINCREMENT,
  nome_fantasia TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('clinica','hospital','laboratorio','consultorio')),
  codigo_cnes TEXT UNIQUE,
  cidade TEXT NOT NULL,
  bairro TEXT,
  endereco TEXT,
  telefone TEXT,
  latitude REAL,
  longitude REAL,
  ativo INTEGER NOT NULL DEFAULT 1 CHECK (ativo IN (0,1))
);

CREATE TABLE IF NOT EXISTS prestador (
  id_prestador INTEGER PRIMARY KEY AUTOINCREMENT,
  id_especialidade INTEGER NOT NULL,
  nome_completo TEXT NOT NULL,
  registro_profissional TEXT UNIQUE,
  biografia TEXT,
  media_avaliacao NUMERIC DEFAULT 0 CHECK (media_avaliacao BETWEEN 0 AND 5),
  qtd_avaliacoes INTEGER NOT NULL DEFAULT 0,
  ativo INTEGER NOT NULL DEFAULT 1 CHECK (ativo IN (0,1)),
  FOREIGN KEY (id_especialidade) REFERENCES especialidade (id_especialidade) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS prestador_estabelecimento (
  id_prestador INTEGER NOT NULL,
  id_estabelecimento INTEGER NOT NULL,
  modalidade TEXT NOT NULL DEFAULT 'presencial' CHECK (modalidade IN ('presencial','teleconsulta')),
  PRIMARY KEY (id_prestador, id_estabelecimento),
  FOREIGN KEY (id_prestador) REFERENCES prestador (id_prestador) ON DELETE CASCADE,
  FOREIGN KEY (id_estabelecimento) REFERENCES estabelecimento (id_estabelecimento) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS agendamento (
  id_agendamento INTEGER PRIMARY KEY AUTOINCREMENT,
  id_paciente INTEGER NOT NULL,
  id_prestador INTEGER NOT NULL,
  id_estabelecimento INTEGER,
  tipo TEXT NOT NULL CHECK (tipo IN ('consulta','exame')),
  inicio TEXT NOT NULL,
  fim TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'agendado' CHECK (status IN ('agendado','realizado','cancelado','faltou')),
  observacoes TEXT,
  criado_em TEXT NOT NULL DEFAULT (datetime('now','localtime')),
  CHECK (fim > inicio),
  UNIQUE (id_prestador, inicio),
  FOREIGN KEY (id_paciente) REFERENCES paciente (id_paciente) ON DELETE CASCADE,
  FOREIGN KEY (id_prestador) REFERENCES prestador (id_prestador) ON DELETE RESTRICT,
  FOREIGN KEY (id_estabelecimento) REFERENCES estabelecimento (id_estabelecimento) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS avaliacao (
  id_avaliacao INTEGER PRIMARY KEY AUTOINCREMENT,
  id_agendamento INTEGER NOT NULL UNIQUE,
  id_paciente INTEGER NOT NULL,
  id_prestador INTEGER NOT NULL,
  nota INTEGER NOT NULL CHECK (nota BETWEEN 1 AND 5),
  comentario TEXT,
  data_avaliacao TEXT NOT NULL DEFAULT (datetime('now','localtime')),
  FOREIGN KEY (id_agendamento) REFERENCES agendamento (id_agendamento) ON DELETE CASCADE,
  FOREIGN KEY (id_paciente) REFERENCES paciente (id_paciente) ON DELETE CASCADE,
  FOREIGN KEY (id_prestador) REFERENCES prestador (id_prestador) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS favorito (
  id_favorito INTEGER PRIMARY KEY AUTOINCREMENT,
  id_paciente INTEGER NOT NULL,
  id_estabelecimento INTEGER NOT NULL,
  criado_em TEXT NOT NULL DEFAULT (datetime('now','localtime')),
  UNIQUE (id_paciente, id_estabelecimento),
  FOREIGN KEY (id_paciente) REFERENCES paciente (id_paciente) ON DELETE CASCADE,
  FOREIGN KEY (id_estabelecimento) REFERENCES estabelecimento (id_estabelecimento) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_estab_cidade ON estabelecimento (cidade, tipo);
CREATE INDEX IF NOT EXISTS idx_prest_espec ON prestador (id_especialidade);
CREATE INDEX IF NOT EXISTS idx_agend_paciente ON agendamento (id_paciente, inicio);
CREATE INDEX IF NOT EXISTS idx_agend_prestador ON agendamento (id_prestador, inicio);

CREATE TRIGGER IF NOT EXISTS trg_atualiza_media_prestador_insert
AFTER INSERT ON avaliacao
BEGIN
  UPDATE prestador
  SET media_avaliacao = (
    SELECT ROUND(AVG(nota), 2)
    FROM avaliacao
    WHERE id_prestador = NEW.id_prestador
  ),
  qtd_avaliacoes = (
    SELECT COUNT(*)
    FROM avaliacao
    WHERE id_prestador = NEW.id_prestador
  )
  WHERE id_prestador = NEW.id_prestador;
END;
```

Alguns detalhes importantes dessa estrutura:

- **`PRAGMA foreign_keys = ON`**: o SQLite só valida chaves estrangeiras quando esse comando é executado na conexão. Ele está no script e também é executado a cada abertura do app, em `migrateDbIfNeeded`.
- **`TRIGGER trg_atualiza_media_prestador_insert`**: sempre que uma avaliação é inserida na tabela `avaliacao`, a trigger recalcula a nota média (`media_avaliacao`) e a quantidade de avaliações (`qtd_avaliacoes`) do prestador.
- **Tabela `favorito`**: guarda os estabelecimentos marcados pelo paciente. A restrição `UNIQUE (id_paciente, id_estabelecimento)` impede favoritos duplicados.

### Conferência dos requisitos da disciplina para o banco local

| Tabela | Quantidade de colunas | Chave primária (PK) | Chaves estrangeiras (FK) |
|---|---|---|---|
| `paciente` | 7 colunas | `id_paciente` | Nenhuma |
| `especialidade` | 4 colunas | `id_especialidade` | Nenhuma |
| `estabelecimento` | 11 colunas | `id_estabelecimento` | Nenhuma |
| `prestador` | 8 colunas | `id_prestador` | `id_especialidade` (ref. `especialidade`) |
| `prestador_estabelecimento` | 3 colunas | `id_prestador`, `id_estabelecimento` | `id_prestador` (ref. `prestador`), `id_estabelecimento` (ref. `estabelecimento`) |
| `agendamento` | 10 colunas | `id_agendamento` | `id_paciente` (ref. `paciente`), `id_prestador` (ref. `prestador`), `id_estabelecimento` (ref. `estabelecimento`) |
| `avaliacao` | 7 colunas | `id_avaliacao` | `id_agendamento` (ref. `agendamento`), `id_paciente` (ref. `paciente`), `id_prestador` (ref. `prestador`) |
| `favorito` | 4 colunas | `id_favorito` | `id_paciente` (ref. `paciente`), `id_estabelecimento` (ref. `estabelecimento`) |

- **Mínimo de 4 tabelas:** 8 tabelas criadas.
- **Mínimo de 3 colunas por tabela:** todas têm entre 3 e 11 colunas.
- **Relação entre ao menos 2 tabelas:** 11 chaves estrangeiras relacionando as tabelas.

## 5. Inicialização e controle de versão (`migrations.ts`)

O app consulta o `PRAGMA user_version` do SQLite para saber se o banco já foi criado no aparelho. Se a versão for `0`, roda o script das tabelas e faz a carga inicial dos dados:

```ts
// src/database/migrations.ts
import type { SQLiteDatabase } from 'expo-sqlite';
import { SCHEMA_V1 } from './schema';
import { seedInicial } from './seed';

const VERSAO_ATUAL = 1;

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  await db.execAsync('PRAGMA foreign_keys = ON;');

  const resultado = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );
  const versaoBanco = resultado?.user_version ?? 0;

  if (versaoBanco >= VERSAO_ATUAL) {
    return;
  }

  if (versaoBanco === 0) {
    await db.execAsync(SCHEMA_V1);
    await seedInicial(db);
  }

  await db.execAsync(`PRAGMA user_version = ${VERSAO_ATUAL}`);
}
```

## 6. Carga inicial de dados (`seed.ts`)

Para funcionar sem internet desde o primeiro uso, as especialidades, os estabelecimentos, os profissionais e seus vínculos vêm de um arquivo JSON local, `assets/seed/dados-iniciais.json`, e são inseridos no SQLite na primeira abertura do app. O arquivo também traz o paciente padrão (o usuário local do app, `id_paciente = 1`) e alguns agendamentos e avaliações de exemplo, com status `realizado`, `cancelado`, `faltou` e `agendado`, para que a agenda e o painel de indicadores já tenham dados. As datas desses agendamentos são relativas ao dia da instalação.

> Os dados da carga inicial são fictícios, criados para demonstração. A importação de dados reais do CNES fica como trabalho futuro.

```ts
// src/database/seed.ts
import type { SQLiteDatabase } from 'expo-sqlite';
import { combinarDiaHora, formatarDataBanco, somarMinutos } from './datas';

type DadosIniciais = {
  especialidades: { id: number; nome: string; descricao: string | null; icone: string | null }[];
  estabelecimentos: {
    id: number; nome: string; tipo: string; cnes: string | null; cidade: string; bairro: string | null;
    endereco: string | null; telefone: string | null; lat: number | null; lng: number | null;
  }[];
  prestadores: { id: number; idEspecialidade: number; nome: string; registro: string | null; biografia: string | null }[];
  prestadoresEstabelecimentos: { idPrestador: number; idEstabelecimento: number; modalidade: string }[];
  pacientes: { id: number; nome: string; email: string; cpf: string | null; telefone: string | null; cidade: string | null }[];
  agendamentos: {
    id: number; idPaciente: number; idPrestador: number; idEstabelecimento: number | null; tipo: string;
    diasAPartirDeHoje: number; hora: string; duracaoMin: number; status: string;
  }[];
  avaliacoes: { idAgendamento: number; idPaciente: number; idPrestador: number; nota: number; comentario: string | null }[];
};

export async function seedInicial(db: SQLiteDatabase) {
  const dados: DadosIniciais = require('../../assets/seed/dados-iniciais.json');

  await db.withTransactionAsync(async () => {
    for (const esp of dados.especialidades) {
      await db.runAsync(
        'INSERT INTO especialidade (id_especialidade, nome, descricao, icone) VALUES (?, ?, ?, ?)',
        [esp.id, esp.nome, esp.descricao, esp.icone]
      );
    }

    for (const est of dados.estabelecimentos) {
      await db.runAsync(
        `INSERT INTO estabelecimento
          (id_estabelecimento, nome_fantasia, tipo, codigo_cnes, cidade, bairro, endereco, telefone, latitude, longitude)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [est.id, est.nome, est.tipo, est.cnes, est.cidade, est.bairro, est.endereco, est.telefone, est.lat, est.lng]
      );
    }

    for (const prest of dados.prestadores) {
      await db.runAsync(
        `INSERT INTO prestador
          (id_prestador, id_especialidade, nome_completo, registro_profissional, biografia)
         VALUES (?, ?, ?, ?, ?)`,
        [prest.id, prest.idEspecialidade, prest.nome, prest.registro, prest.biografia]
      );
    }

    for (const vinculo of dados.prestadoresEstabelecimentos) {
      await db.runAsync(
        `INSERT INTO prestador_estabelecimento
          (id_prestador, id_estabelecimento, modalidade)
         VALUES (?, ?, ?)`,
        [vinculo.idPrestador, vinculo.idEstabelecimento, vinculo.modalidade]
      );
    }

    for (const pac of dados.pacientes) {
      await db.runAsync(
        `INSERT INTO paciente (id_paciente, nome_completo, email, cpf, telefone, cidade)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [pac.id, pac.nome, pac.email, pac.cpf, pac.telefone, pac.cidade]
      );
    }

    // As datas dos agendamentos de exemplo são relativas ao dia da instalação,
    // para que sempre existam consultas passadas e futuras.
    const hoje = new Date();
    for (const ag of dados.agendamentos) {
      const dia = new Date(hoje);
      dia.setDate(hoje.getDate() + ag.diasAPartirDeHoje);
      const inicio = combinarDiaHora(dia, ag.hora);
      const fim = somarMinutos(inicio, ag.duracaoMin);
      await db.runAsync(
        `INSERT INTO agendamento
          (id_agendamento, id_paciente, id_prestador, id_estabelecimento, tipo, inicio, fim, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [ag.id, ag.idPaciente, ag.idPrestador, ag.idEstabelecimento, ag.tipo,
          formatarDataBanco(inicio), formatarDataBanco(fim), ag.status]
      );
    }

    for (const av of dados.avaliacoes) {
      await db.runAsync(
        `INSERT INTO avaliacao (id_agendamento, id_paciente, id_prestador, nota, comentario)
         VALUES (?, ?, ?, ?, ?)`,
        [av.idAgendamento, av.idPaciente, av.idPrestador, av.nota, av.comentario]
      );
    }
  });
}
```

Todos os `INSERT` rodam dentro de uma única transação (`withTransactionAsync`). Isso deixa a carga mais rápida e evita que o banco fique com dados pela metade se o app for fechado durante o carregamento.

## 7. Exemplos de consultas e gravação no app

As telas obtêm a conexão com o hook `useSQLiteContext()` e a repassam para as funções dos repositories.

### Agendamento com validação de conflito de horário

Ao confirmar um agendamento, o app verifica se o mesmo profissional já tem outro agendamento (não cancelado) com intervalo sobreposto. Se tiver, a função lança `ConflitoHorarioError` e a tela mostra uma mensagem amigável pedindo outro horário:

```ts
// src/database/repositories/agendamentoRepository.ts
// Existe conflito quando novo_inicio < fim_existente e novo_fim > inicio_existente.
// Agendamentos cancelados não bloqueiam a agenda do profissional.
export async function existeConflito(
  db: SQLiteDatabase,
  idPrestador: number,
  inicio: string,
  fim: string
): Promise<boolean> {
  const linha = await db.getFirstAsync<{ total: number }>(
    `SELECT COUNT(*) AS total FROM agendamento
     WHERE id_prestador = ?
       AND status != 'cancelado'
       AND ? < fim
       AND ? > inicio`,
    [idPrestador, inicio, fim]
  );
  return (linha?.total ?? 0) > 0;
}

export async function confirmarAgendamento(db: SQLiteDatabase, dados: NovoAgendamento): Promise<number> {
  let idCriado = 0;
  await db.withExclusiveTransactionAsync(async (txn) => {
    if (await existeConflito(txn, dados.prestador, dados.inicio, dados.fim)) {
      throw new ConflitoHorarioError();
    }
    const resultado = await txn.runAsync(
      `INSERT INTO agendamento
        (id_paciente, id_prestador, id_estabelecimento, tipo, inicio, fim, observacoes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        dados.paciente,
        dados.prestador,
        dados.estabelecimento,
        dados.tipo,
        dados.inicio,
        dados.fim,
        dados.observacoes,
      ]
    );
    idCriado = resultado.lastInsertRowId;
  });
  return idCriado;
}
```

### Cancelamento

O agendamento não é apagado: o status passa a ser `cancelado`, o que preserva o histórico e libera o horário.

```ts
// src/database/repositories/agendamentoRepository.ts
// O registro é mantido com status 'cancelado' para preservar o histórico.
export async function cancelarAgendamento(
  db: SQLiteDatabase,
  idAgendamento: number,
  motivo: string
) {
  await db.runAsync(
    `UPDATE agendamento
     SET status = 'cancelado',
         observacoes = ?
     WHERE id_agendamento = ? AND status = 'agendado'`,
    [motivo, idAgendamento]
  );
}
```

Ao carregar a agenda, os agendamentos cujo horário de término já passou são marcados como `realizado`. Isso libera o botão "Avaliar" na tela `app/(tabs)/Agenda.tsx`:

```ts
// src/database/repositories/agendamentoRepository.ts
// Agendamentos cujo horário de término já passou deixam de estar "agendados".
export async function atualizarAgendamentosRealizados(db: SQLiteDatabase) {
  await db.runAsync(
    `UPDATE agendamento SET status = 'realizado'
     WHERE status = 'agendado' AND fim <= ?`,
    [formatarDataBanco(new Date())]
  );
}
```

### Avaliação de atendimento

```ts
// src/database/repositories/avaliacaoRepository.ts
// Grava a avaliação de um agendamento realizado. O prestador é lido do próprio
// agendamento para manter os dados consistentes, e a trigger
// trg_atualiza_media_prestador_insert recalcula a média do prestador.
export async function registrarAvaliacao(db: SQLiteDatabase, dados: NovaAvaliacao) {
  await db.withExclusiveTransactionAsync(async (txn) => {
    const agendamento = await txn.getFirstAsync<{ id_prestador: number; status: string }>(
      'SELECT id_prestador, status FROM agendamento WHERE id_agendamento = ? AND id_paciente = ?',
      [dados.agendamento, dados.paciente]
    );
    if (!agendamento || agendamento.status !== 'realizado') {
      throw new Error('Só é possível avaliar atendimentos realizados.');
    }
    await txn.runAsync(
      `INSERT INTO avaliacao
        (id_agendamento, id_paciente, id_prestador, nota, comentario)
       VALUES (?, ?, ?, ?, ?)`,
      [dados.agendamento, dados.paciente, agendamento.id_prestador, dados.nota, dados.comentario]
    );
  });
}
```

## 8. Consultas para análise de dados (Indicadores)

O painel de indicadores (`app/(tabs)/indicadores.tsx`) executa consultas de agregação diretamente no SQLite local, definidas em `src/database/repositories/indicadoresRepository.ts`:

```ts
// 1. Especialidades mais procuradas (Top 5)
export async function especialidadesMaisProcuradas(db: SQLiteDatabase): Promise<ItemIndicador[]> {
  const linhas = await db.getAllAsync<{ nome: string; total: number }>(
    `SELECT e.nome, COUNT(*) AS total
     FROM agendamento a
     INNER JOIN prestador p ON p.id_prestador = a.id_prestador
     INNER JOIN especialidade e ON e.id_especialidade = p.id_especialidade
     GROUP BY e.nome
     ORDER BY total DESC
     LIMIT 5`
  );
  return linhas.map(l => ({ rotulo: l.nome, valor: l.total }));
}

// 2. Proporção de agendamentos por status
export async function agendamentosPorStatus(db: SQLiteDatabase): Promise<ItemIndicador[]> {
  const linhas = await db.getAllAsync<{ status: string; qtd: number; percentual: number }>(
    `SELECT
       status,
       COUNT(*) AS qtd,
       ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM agendamento), 1) AS percentual
     FROM agendamento
     GROUP BY status
     ORDER BY qtd DESC`
  );
  return linhas.map(l => ({ rotulo: l.status, valor: l.percentual, detalhe: `${l.qtd}` }));
}

// 3. Prestadores com melhor média de avaliação
export async function prestadoresMaisBemAvaliados(db: SQLiteDatabase): Promise<ItemIndicador[]> {
  const linhas = await db.getAllAsync<{ nome_completo: string; media: number; total_avaliacoes: number }>(
    `SELECT
       p.nome_completo,
       ROUND(AVG(av.nota), 2) AS media,
       COUNT(av.id_avaliacao) AS total_avaliacoes
     FROM prestador p
     INNER JOIN avaliacao av ON av.id_prestador = p.id_prestador
     GROUP BY p.id_prestador
     ORDER BY media DESC
     LIMIT 5`
  );
  return linhas.map(l => ({ rotulo: l.nome_completo, valor: l.media, detalhe: `${l.total_avaliacoes}` }));
}

// 4. Horários com maior volume de agendamentos
export async function horariosMaisAgendados(db: SQLiteDatabase): Promise<ItemIndicador[]> {
  const linhas = await db.getAllAsync<{ faixa_horario: string; total: number }>(
    `SELECT strftime('%H:00', inicio) AS faixa_horario, COUNT(*) AS total
     FROM agendamento
     WHERE status != 'cancelado'
     GROUP BY faixa_horario
     ORDER BY total DESC`
  );
  return linhas.map(l => ({ rotulo: l.faixa_horario, valor: l.total }));
}
```

Os resultados são desenhados como barras horizontais com `View`, com largura proporcional ao valor. Quando não há agendamentos, a tela mostra um estado vazio explicativo.

## 9. Teste de funcionamento offline

O passo a passo para validar o funcionamento sem internet no celular ou emulador é:

1. Instalar o APK e abrir o aplicativo pela primeira vez (para criar o arquivo `saude_serra.db` e rodar o `seedInicial`).
2. Colocar o aparelho em **modo avião**.
3. Navegar pelo Guia Médico, filtrar uma especialidade, escolher um médico e confirmar um agendamento na tela `app/(tabs)/guia-medico/agendar-consulta.tsx`.
4. Abrir a aba **Agenda**, verificar que a consulta aparece listada, fechar o aplicativo completamente e abri-lo novamente (ainda em modo avião) para confirmar que os dados continuam salvos no dispositivo.
