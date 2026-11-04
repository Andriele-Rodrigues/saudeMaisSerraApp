# Banco de Dados Local (SQLite)

[Voltar ao índice](../README.md)

## 1. Banco de dados escolhido

Para atender ao requisito de funcionamento local e offline do aplicativo, escolhemos o **SQLite 3** utilizando a biblioteca oficial **[expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/)**.

Optamos por essa solução pelos seguintes pontos práticos do projeto:

- O SQLite já vem nativo no Android e no iOS, então o banco roda direto no aparelho do usuário sem depender de internet ou de um servidor externo.
- Como o nosso projeto usa Expo (SDK 54), o pacote `expo-sqlite` funciona direto no build do APK sem precisar configurar código nativo Android manualmente.
- Ele dá suporte completo a chaves estrangeiras (`FOREIGN KEY`), validações (`CHECK`, `UNIQUE`), transações e consultas com agregação (`COUNT`, `AVG`, `GROUP BY`), que vamos usar na parte de análise de dados.
- O arquivo do banco (`saude_serra.db`) fica salvo no diretório interno privado do app (gerenciado pelo `defaultDatabaseDirectory` do próprio `expo-sqlite`), sendo criado automaticamente na primeira vez que o usuário abre o aplicativo.

## 2. Instalação no projeto

Na base atual do repositório (vinda da etapa anterior), os dados ainda estão fixos em memória no arquivo `app/api/mockData.tsx` (`PRESTADORES`, `MEDICOS` e `ESPECIALIDADES`) e nos contextos `contexts/AppointmentsContext.tsx` e `contexts/FavoritesContext.tsx`.

Para instalar a biblioteca compatível com a versão do Expo do projeto, utilizamos:

```bash
npx expo install expo-sqlite
```

## 3. Organização dos arquivos do banco

Para não espalhar comandos SQL dentro das telas em `app/(tabs)/`, separamos toda a parte de banco de dados dentro da pasta `src/database/`:

```text
src/database/
  schema.ts                 // criação das tabelas, índices e triggers
  migrations.ts             // controle de versão do banco ao abrir o app
  seed.ts                   // inserção dos dados iniciais (CNES e prestadores)
  repositories/
    pacienteRepository.ts
    prestadorRepository.ts
    agendamentoRepository.ts
    avaliacaoRepository.ts
    indicadoresRepository.ts
```

Com essa divisão, as telas e os contextos apenas chamam as funções dos arquivos em `repositories/`, substituindo as listas estáticas que hoje estão no `mockData.tsx`.

## 4. Estrutura e criação das tabelas

A inicialização do banco acontece no `app/_layout.tsx` usando o componente `SQLiteProvider` do `expo-sqlite`. O parâmetro `onInit` garante que as tabelas sejam criadas antes de carregar as telas:

```tsx
// app/_layout.tsx
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import React from 'react';
import { AppointmentsProvider } from '../contexts/AppointmentsContext';
import { migrateDbIfNeeded } from '../src/database/migrations';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="saude_serra.db" onInit={migrateDbIfNeeded}>
      <AppointmentsProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="guia-medico" options={{ headerShown: false }} />
        </Stack>
      </AppointmentsProvider>
    </SQLiteProvider>
  );
}
```

Abaixo está o script SQL definido em `src/database/schema.ts`, seguindo a modelagem definida no [Modelo ER](02-modelo-er.md):

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

- **`PRAGMA foreign_keys = ON`**: por padrão o SQLite não valida chaves estrangeiras se esse comando não for executado ao abrir a conexão, então deixamos ele ativo para garantir a integridade entre as tabelas.
- **`TRIGGER trg_atualiza_media_prestador_insert`**: sempre que o paciente avalia uma consulta na tabela `avaliacao`, essa trigger já recalcula a nota média (`media_avaliacao`) e a soma de avaliações (`qtd_avaliacoes`) na tabela `prestador`.

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

- **Mínimo de 4 tabelas:** 7 tabelas criadas.
- **Mínimo de 3 colunas por tabela:** todas têm entre 3 e 11 colunas.
- **Relação entre ao menos 2 tabelas:** 8 chaves estrangeiras relacionando as tabelas.

## 5. Inicialização e controle de versão (`migrations.ts`)

Para saber se o banco já foi criado no celular do usuário ou se é o primeiro acesso, consultamos o `PRAGMA user_version` do SQLite. Se a versão for `0`, o app roda o script das tabelas e faz a carga inicial dos dados:

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

Como o aplicativo precisa funcionar sem internet desde o primeiro uso, os dados de especialidades, hospitais, clínicas, laboratórios e médicos da Serra Gaúcha vão pré-carregados num arquivo JSON local (`assets/seed/dados-iniciais.json`) e são inseridos no SQLite na primeira abertura do app.

```ts
// src/database/seed.ts
import type { SQLiteDatabase } from 'expo-sqlite';

export async function seedInicial(db: SQLiteDatabase) {
  const dados = require('../../assets/seed/dados-iniciais.json');

  await db.withTransactionAsync(async () => {
    for (const esp of dados.especialidades) {
      await db.runAsync(
        'INSERT INTO especialidade (nome, descricao, icone) VALUES (?, ?, ?)',
        [esp.nome, esp.descricao, esp.icone]
      );
    }

    for (const est of dados.estabelecimentos) {
      await db.runAsync(
        `INSERT INTO estabelecimento
          (nome_fantasia, tipo, codigo_cnes, cidade, bairro, endereco, telefone, latitude, longitude)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [est.nome, est.tipo, est.cnes, est.cidade, est.bairro, est.endereco, est.telefone, est.lat, est.lng]
      );
    }

    for (const prest of dados.prestadores) {
      await db.runAsync(
        `INSERT INTO prestador
          (id_especialidade, nome_completo, registro_profissional, biografia)
         VALUES (?, ?, ?, ?)`,
        [prest.idEspecialidade, prest.nome, prest.registro, prest.biografia]
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
  });
}
```

Usamos `withTransactionAsync` para que todos os `INSERT` rodem dentro de uma única transação (deixando a inserção inicial muito mais rápida e evitando que o banco fique com dados pela metade caso o app seja fechado durante o carregamento).

## 7. Exemplos de consultas e gravação no app

Nas telas do aplicativo, acessamos a instância do banco através do hook `useSQLiteContext()`.

### Busca de prestadores por especialidade e cidade

Substitui o filtro em memória que antes era feito sobre os arrays `PRESTADORES` e `MEDICOS` na tela `app/(tabs)/guia-medico/resultados.tsx`:

```tsx
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';

export function useBuscaPrestadores(especialidade: string, cidade: string) {
  const db = useSQLiteContext();

  return useCallback(async () => {
    return await db.getAllAsync(
      `SELECT
        p.id_prestador,
        p.nome_completo,
        p.media_avaliacao,
        p.qtd_avaliacoes,
        e.nome AS especialidade,
        es.nome_fantasia,
        es.endereco,
        es.bairro,
        es.telefone
      FROM prestador p
      INNER JOIN especialidade e ON e.id_especialidade = p.id_especialidade
      INNER JOIN prestador_estabelecimento pe ON pe.id_prestador = p.id_prestador
      INNER JOIN estabelecimento es ON es.id_estabelecimento = pe.id_estabelecimento
      WHERE p.ativo = 1
        AND e.nome LIKE ?
        AND es.cidade = ?
      ORDER BY p.media_avaliacao DESC`,
      [`%${especialidade}%`, cidade]
    );
  }, [db, especialidade, cidade]);
}
```

### Agendamento, cancelamento e avaliação

Substitui o estado temporário do `AppointmentsContext.tsx` (que perdia os agendamentos ao fechar o aplicativo) por operações reais no banco:

```ts
// Criar novo agendamento (usado em app/(tabs)/guia-medico/agendar-consulta.tsx)
export async function confirmarAgendamento(db: SQLiteDatabase, dados: NovoAgendamento) {
  await db.withTransactionAsync(async () => {
    await db.runAsync(
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
  });
}

// Cancelar agendamento (usado no modal de cancelamento em app/(tabs)/Agenda.tsx)
export async function cancelarAgendamento(
  db: SQLiteDatabase,
  idAgendamento: number,
  motivo: string
) {
  await db.runAsync(
    `UPDATE agendamento
     SET status = 'cancelado',
         observacoes = ?
     WHERE id_agendamento = ?`,
    [motivo, idAgendamento]
  );
}

// Salvar avaliação de atendimento
export async function registrarAvaliacao(db: SQLiteDatabase, dados: NovaAvaliacao) {
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `INSERT INTO avaliacao
        (id_agendamento, id_paciente, id_prestador, nota, comentario)
       VALUES (?, ?, ?, ?, ?)`,
      [dados.agendamento, dados.paciente, dados.prestador, dados.nota, dados.comentario]
    );
  });
}
```

## 8. Consultas para análise de dados (Indicadores)

Para cumprir a parte de Ciência de Dados do Projeto Integrador VI-B, o painel de indicadores executa consultas de agregação diretamente no SQLite local:

```sql
-- 1. Especialidades mais procuradas (Top 5)
SELECT e.nome, COUNT(*) AS total
FROM agendamento a
INNER JOIN prestador p ON p.id_prestador = a.id_prestador
INNER JOIN especialidade e ON e.id_especialidade = p.id_especialidade
GROUP BY e.nome
ORDER BY total DESC
LIMIT 5;

-- 2. Proporção de agendamentos por status (realizados, cancelados, agendados, faltou)
SELECT
  status,
  COUNT(*) AS qtd,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM agendamento), 1) AS percentual
FROM agendamento
GROUP BY status;

-- 3. Prestadores com melhor média de avaliação
SELECT
  p.nome_completo,
  ROUND(AVG(av.nota), 2) AS media,
  COUNT(av.id_avaliacao) AS total_avaliacoes
FROM prestador p
INNER JOIN avaliacao av ON av.id_prestador = p.id_prestador
GROUP BY p.id_prestador
ORDER BY media DESC;

-- 4. Horários com maior volume de agendamentos
SELECT strftime('%H:00', inicio) AS faixa_horario, COUNT(*) AS total
FROM agendamento
WHERE status != 'cancelado'
GROUP BY faixa_horario
ORDER BY total DESC;
```

## 9. Teste de funcionamento offline

O passo a passo para validar o funcionamento sem internet no celular ou emulador é:

1. Instalar o APK e abrir o aplicativo pela primeira vez (para criar o arquivo `saude_serra.db` e rodar o `seedInicial`).
2. Colocar o aparelho em **modo avião**.
3. Navegar pelo Guia Médico, filtrar uma especialidade, escolher um médico e confirmar um agendamento em `agendar-consulta`.
4. Abrir a aba **Agenda**, verificar que a consulta aparece listada, fechar o aplicativo completamente e abri-lo novamente (ainda em modo avião) para confirmar que os dados continuam salvos no dispositivo.
