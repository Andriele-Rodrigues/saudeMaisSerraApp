// Script de criação do banco local (versão 1 do esquema).
// Segue o modelo descrito em projeto-integrador-vi-b/docs/02-modelo-er.md.
export const SCHEMA_V1 = `
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
`;
