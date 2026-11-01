# Banco de dados local: SQLite no aplicativo

[← Voltar ao índice](../README.md)

## 1. Qual banco será usado e por quê

O aplicativo usa **SQLite 3**, acessado pela biblioteca oficial **[expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/)**.

A escolha atende diretamente o requisito tecnológico obrigatório da disciplina — banco de dados local funcionando no próprio celular, mesmo sem conexão. Os motivos técnicos:

- O SQLite já faz parte do sistema operacional Android e iOS; não há servidor para instalar nem processo externo para manter.
- A biblioteca `expo-sqlite` é mantida pela própria Expo e funciona tanto no *development build* quanto no APK final, sem código nativo escrito à mão.
- Suporta SQL completo: chaves estrangeiras, `CHECK`, `UNIQUE`, índices, transações e funções de agregação — tudo o que o modelo ER do projeto exige, inclusive as consultas analíticas do painel de indicadores.
- O arquivo do banco fica no diretório privado do aplicativo, isolado de outros apps e removido junto com a desinstalação.

**Localização do arquivo:** `FileSystem.documentDirectory + 'SQLite/saude_serra.db'`, criado automaticamente na primeira execução.

---

## 2. Instalação da dependência

O projeto atual (herdado do Projeto Integrador IV-A) usa Expo SDK 54 e ainda não possui a biblioteca. A inclusão é feita com:

```bash
npx expo install expo-sqlite
```

> O comando `npx expo install` é usado em vez de `npm install` porque ele resolve automaticamente a versão da biblioteca compatível com o SDK do projeto.

---

## 3. Arquitetura da camada de dados

A implementação é organizada em quatro camadas, isolando o SQL do restante do aplicativo:

```
src/database/
├── schema.ts        → comandos CREATE TABLE e CREATE INDEX
├── migrations.ts    → controle de versão do banco (PRAGMA user_version)
├── seed.ts          → carga inicial de dados do CNES
└── repositories/    → funções de acesso por entidade
    ├── pacienteRepository.ts
    ├── prestadorRepository.ts
    ├── agendamentoRepository.ts
    ├── avaliacaoRepository.ts
    └── indicadoresRepository.ts
```

As telas (`app/(tabs)/...`) **nunca escrevem SQL diretamente**: elas chamam funções dos *repositories*. Isso substitui o arquivo `app/api/mockData` usado na versão anterior do aplicativo, em que os dados eram fixos em memória.

---

## 4. Criação das tabelas

O esquema é criado uma única vez, na primeira abertura do aplicativo. O `SQLiteProvider` do `expo-sqlite` expõe um gancho `onInit` que roda antes de qualquer tela montar:

```tsx
// app/_layout.tsx
import { SQLiteProvider } from 'expo-sqlite';
import { migrateDbIfNeeded } from '@/src/database/migrations';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="saude_serra.db" onInit={migrateDbIfNeeded}>
      {/* navegação do expo-router */}
    </SQLiteProvider>
  );
}
```

O script de criação, em `schema.ts`:

```sql
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS paciente (
  id_paciente    INTEGER PRIMARY KEY AUTOINCREMENT,
  nome_completo  TEXT NOT NULL,
  email          TEXT NOT NULL UNIQUE,
  cpf            TEXT UNIQUE,
  telefone       TEXT,
  cidade         TEXT,
  criado_em      TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS especialidade (
  id_especialidade INTEGER PRIMARY KEY AUTOINCREMENT,
  nome             TEXT NOT NULL UNIQUE,
  descricao        TEXT,
  icone            TEXT
);

CREATE TABLE IF NOT EXISTS estabelecimento (
  id_estabelecimento INTEGER PRIMARY KEY AUTOINCREMENT,
  nome_fantasia      TEXT NOT NULL,
  tipo               TEXT NOT NULL
                     CHECK (tipo IN ('clinica','hospital','laboratorio','consultorio')),
  codigo_cnes        TEXT UNIQUE,
  cidade             TEXT NOT NULL,
  bairro             TEXT,
  endereco           TEXT,
  telefone           TEXT,
  latitude           REAL,
  longitude          REAL,
  ativo              INTEGER NOT NULL DEFAULT 1 CHECK (ativo IN (0,1))
);

CREATE TABLE IF NOT EXISTS prestador (
  id_prestador          INTEGER PRIMARY KEY AUTOINCREMENT,
  id_especialidade      INTEGER NOT NULL,
  nome_completo         TEXT NOT NULL,
  registro_profissional TEXT UNIQUE,
  biografia             TEXT,
  media_avaliacao       NUMERIC DEFAULT 0 CHECK (media_avaliacao BETWEEN 0 AND 5),
  qtd_avaliacoes        INTEGER NOT NULL DEFAULT 0,
  ativo                 INTEGER NOT NULL DEFAULT 1 CHECK (ativo IN (0,1)),
  FOREIGN KEY (id_especialidade)
    REFERENCES especialidade (id_especialidade) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS prestador_estabelecimento (
  id_prestador       INTEGER NOT NULL,
  id_estabelecimento INTEGER NOT NULL,
  modalidade         TEXT NOT NULL DEFAULT 'presencial'
                     CHECK (modalidade IN ('presencial','teleconsulta')),
  PRIMARY KEY (id_prestador, id_estabelecimento),
  FOREIGN KEY (id_prestador)
    REFERENCES prestador (id_prestador) ON DELETE CASCADE,
  FOREIGN KEY (id_estabelecimento)
    REFERENCES estabelecimento (id_estabelecimento) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS agendamento (
  id_agendamento     INTEGER PRIMARY KEY AUTOINCREMENT,
  id_paciente        INTEGER NOT NULL,
  id_prestador       INTEGER NOT NULL,
  id_estabelecimento INTEGER,
  tipo               TEXT NOT NULL CHECK (tipo IN ('consulta','exame')),
  inicio             TEXT NOT NULL,
  fim                TEXT NOT NULL,
  status             TEXT NOT NULL DEFAULT 'agendado'
                     CHECK (status IN ('agendado','realizado','cancelado','faltou')),
  observacoes        TEXT,
  criado_em          TEXT NOT NULL DEFAULT (datetime('now','localtime')),
  CHECK (fim > inicio),
  UNIQUE (id_prestador, inicio),
  FOREIGN KEY (id_paciente)
    REFERENCES paciente (id_paciente) ON DELETE CASCADE,
  FOREIGN KEY (id_prestador)
    REFERENCES prestador (id_prestador) ON DELETE RESTRICT,
  FOREIGN KEY (id_estabelecimento)
    REFERENCES estabelecimento (id_estabelecimento) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS avaliacao (
  id_avaliacao   INTEGER PRIMARY KEY AUTOINCREMENT,
  id_agendamento INTEGER NOT NULL UNIQUE,
  id_paciente    INTEGER NOT NULL,
  id_prestador   INTEGER NOT NULL,
  nota           INTEGER NOT NULL CHECK (nota BETWEEN 1 AND 5),
  comentario     TEXT,
  data_avaliacao TEXT NOT NULL DEFAULT (datetime('now','localtime')),
  FOREIGN KEY (id_agendamento)
    REFERENCES agendamento (id_agendamento) ON DELETE CASCADE,
  FOREIGN KEY (id_paciente)
    REFERENCES paciente (id_paciente) ON DELETE CASCADE,
  FOREIGN KEY (id_prestador)
    REFERENCES prestador (id_prestador) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_estab_cidade    ON estabelecimento (cidade, tipo);
CREATE INDEX IF NOT EXISTS idx_prest_espec     ON prestador (id_especialidade);
CREATE INDEX IF NOT EXISTS idx_agend_paciente  ON agendamento (id_paciente, inicio);
CREATE INDEX IF NOT EXISTS idx_agend_prestador ON agendamento (id_prestador, inicio);
```

Dois pontos merecem destaque:

- **`PRAGMA foreign_keys = ON`** é obrigatório. O SQLite desativa a verificação de chaves estrangeiras por padrão; sem essa linha, as restrições do modelo ER existem no esquema mas não são aplicadas.
- **`PRAGMA journal_mode = WAL`** melhora o desempenho de leitura concorrente, situação comum quando uma tela lista dados enquanto outra grava.

---

## 5. Controle de versão do esquema (migrations)

Para permitir evolução do banco sem perder os dados já gravados no celular do usuário, o controle é feito pelo `PRAGMA user_version`:

```ts
// src/database/migrations.ts
import type { SQLiteDatabase } from 'expo-sqlite';
import { SCHEMA_V1 } from './schema';
import { seedInicial } from './seed';

const VERSAO_ATUAL = 1;

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const linha = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );
  let versao = linha?.user_version ?? 0;

  if (versao === VERSAO_ATUAL) return;

  if (versao === 0) {
    await db.execAsync(SCHEMA_V1);
    await seedInicial(db);
    versao = 1;
  }

  // Versões futuras entram aqui como novos blocos `if (versao === n)`

  await db.execAsync(`PRAGMA user_version = ${VERSAO_ATUAL}`);
}
```

---

## 6. Carga inicial dos dados (seed)

Os dados de estabelecimentos, especialidades e prestadores vêm do **CNES**. Como o aplicativo precisa funcionar sem internet, a base **não é consultada em tempo de execução**. O fluxo é:

1. Durante o desenvolvimento, o grupo baixa o extrato do CNES em <http://cnes.datasus.gov.br/>.
2. Os registros são filtrados para os municípios da Serra Gaúcha e reduzidos às colunas do modelo ER.
3. O resultado é convertido em `assets/seed/dados-iniciais.json` e embarcado no APK.
4. Na primeira execução, `seedInicial()` lê esse JSON e o insere no SQLite dentro de uma única transação.

```ts
// src/database/seed.ts
export async function seedInicial(db: SQLiteDatabase) {
  const dados = require('../../assets/seed/dados-iniciais.json');

  await db.withTransactionAsync(async () => {
    for (const e of dados.especialidades) {
      await db.runAsync(
        'INSERT INTO especialidade (nome, descricao, icone) VALUES (?, ?, ?)',
        [e.nome, e.descricao, e.icone]
      );
    }
    for (const es of dados.estabelecimentos) {
      await db.runAsync(
        `INSERT INTO estabelecimento
           (nome_fantasia, tipo, codigo_cnes, cidade, bairro, telefone, latitude, longitude)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [es.nome, es.tipo, es.cnes, es.cidade, es.bairro, es.telefone, es.lat, es.lng]
      );
    }
    // demais entidades...
  });
}
```

A transação garante que, se o aplicativo for fechado no meio da carga, o banco não fique pela metade: ou tudo é gravado, ou nada é.

---

## 7. Acesso aos dados pelo aplicativo

Dentro das telas, o acesso é feito pelo hook `useSQLiteContext()`:

```tsx
// Exemplo: busca de prestadores por especialidade (HU02)
import { useSQLiteContext } from 'expo-sqlite';

export function useBuscaPrestadores(especialidade: string, cidade: string) {
  const db = useSQLiteContext();

  return useCallback(async () => {
    return db.getAllAsync(
      `SELECT p.id_prestador,
              p.nome_completo,
              p.media_avaliacao,
              p.qtd_avaliacoes,
              e.nome  AS especialidade,
              es.nome_fantasia,
              es.bairro
         FROM prestador p
         JOIN especialidade e
           ON e.id_especialidade = p.id_especialidade
         JOIN prestador_estabelecimento pe
           ON pe.id_prestador = p.id_prestador
         JOIN estabelecimento es
           ON es.id_estabelecimento = pe.id_estabelecimento
        WHERE p.ativo = 1
          AND e.nome LIKE ?
          AND es.cidade = ?
        ORDER BY p.media_avaliacao DESC`,
      [`%${especialidade}%`, cidade]
    );
  }, [db, especialidade, cidade]);
}
```

Todas as consultas usam **parâmetros ligados (`?`)** em vez de concatenação de strings — prática que elimina o risco de injeção de SQL e permite ao SQLite reaproveitar o plano de execução.

### Operação de escrita com transação

```ts
// Confirmação de agendamento (HU03)
export async function confirmarAgendamento(db: SQLiteDatabase, dados: NovoAgendamento) {
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `INSERT INTO agendamento
         (id_paciente, id_prestador, id_estabelecimento, tipo, inicio, fim, observacoes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [dados.paciente, dados.prestador, dados.estabelecimento,
       dados.tipo, dados.inicio, dados.fim, dados.observacoes]
    );
  });
}
```

A restrição `UNIQUE (id_prestador, inicio)` faz o próprio banco rejeitar a gravação de um horário já ocupado, mesmo que a interface permita o toque duplo.

---

## 8. Consultas analíticas (ciência de dados)

O painel de indicadores é alimentado por consultas de agregação executadas no próprio SQLite:

```sql
-- Especialidades mais procuradas
SELECT e.nome, COUNT(*) AS total
  FROM agendamento a
  JOIN prestador p     ON p.id_prestador = a.id_prestador
  JOIN especialidade e ON e.id_especialidade = p.id_especialidade
 GROUP BY e.nome
 ORDER BY total DESC
 LIMIT 5;

-- Taxa de comparecimento
SELECT status,
       COUNT(*) AS qtd,
       ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) AS percentual
  FROM agendamento
 GROUP BY status;

-- Prestadores mais bem avaliados (mínimo de 3 avaliações)
SELECT p.nome_completo,
       ROUND(AVG(av.nota), 2) AS media,
       COUNT(av.id_avaliacao) AS avaliacoes
  FROM prestador p
  JOIN avaliacao av ON av.id_prestador = p.id_prestador
 GROUP BY p.id_prestador
HAVING COUNT(av.id_avaliacao) >= 3
 ORDER BY media DESC;

-- Horários de maior procura
SELECT strftime('%H', inicio) AS hora, COUNT(*) AS total
  FROM agendamento
 WHERE status <> 'cancelado'
 GROUP BY hora
 ORDER BY total DESC;
```

O resultado dessas consultas é entregue diretamente aos gráficos da tela, sem processamento em servidor.

---

## 9. Verificação do funcionamento offline

Para comprovar o atendimento ao requisito, o roteiro de teste é:

1. Instalar o APK no aparelho e abrir o aplicativo uma vez (a carga inicial acontece aqui).
2. Ativar o modo avião.
3. Executar o fluxo completo: buscar especialidade → escolher prestador → agendar → consultar "Minha agenda" → avaliar um atendimento passado → abrir o painel de indicadores.
4. Fechar e reabrir o aplicativo, ainda em modo avião, confirmando que os dados gravados persistiram.

---

## 10. Observação sobre o projeto herdado

A versão do Projeto Integrador IV-A trazia as dependências `express`, `cors` e `axios` no `package.json`, usadas para servir dados por uma API. Como o VI-B exige banco local e operação offline, essas dependências deixam de ser necessárias em tempo de execução e devem ser removidas junto com o arquivo `app/api/mockData`, evitando que o aplicativo carregue código de servidor no pacote final.
