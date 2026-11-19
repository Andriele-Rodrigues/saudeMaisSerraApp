import type { SQLiteDatabase } from 'expo-sqlite';

export type TipoEstabelecimento = 'clinica' | 'hospital' | 'laboratorio' | 'consultorio';

export const ROTULO_TIPO: Record<TipoEstabelecimento, string> = {
  clinica: 'Clínica',
  hospital: 'Hospital',
  laboratorio: 'Laboratório',
  consultorio: 'Consultório',
};

export type Estabelecimento = {
  id: number;
  nome: string;
  tipo: TipoEstabelecimento;
  especialidades: string[];
  cidade: string;
  bairro: string | null;
  endereco: string | null;
  telefone: string | null;
  latitude: number | null;
  longitude: number | null;
  ativo: boolean;
};

export type Medico = {
  id: number;
  nome: string;
  especialidade: string;
  mediaAvaliacao: number;
  qtdAvaliacoes: number;
  idEstabelecimento: number | null;
  estabelecimento: string | null;
  tipoEstabelecimento: TipoEstabelecimento | null;
  endereco: string | null;
  telefone: string | null;
  latitude: number | null;
  longitude: number | null;
};

type LinhaEstabelecimento = Omit<Estabelecimento, 'especialidades' | 'ativo'> & {
  especialidades: string | null;
  ativo: number;
};

const SQL_ESTABELECIMENTOS = `
  SELECT
    es.id_estabelecimento AS id,
    es.nome_fantasia AS nome,
    es.tipo, es.cidade, es.bairro, es.endereco, es.telefone, es.latitude, es.longitude, es.ativo,
    (SELECT GROUP_CONCAT(nome, '|') FROM (
       SELECT DISTINCT e.nome
       FROM prestador_estabelecimento pe
       INNER JOIN prestador p ON p.id_prestador = pe.id_prestador AND p.ativo = 1
       INNER JOIN especialidade e ON e.id_especialidade = p.id_especialidade
       WHERE pe.id_estabelecimento = es.id_estabelecimento
       ORDER BY e.nome
    )) AS especialidades
  FROM estabelecimento es`;

function converterEstabelecimento(linha: LinhaEstabelecimento): Estabelecimento {
  return {
    ...linha,
    especialidades: linha.especialidades ? linha.especialidades.split('|') : [],
    ativo: linha.ativo === 1,
  };
}

const SQL_MEDICOS = `
  SELECT
    p.id_prestador AS id,
    p.nome_completo AS nome,
    e.nome AS especialidade,
    p.media_avaliacao AS mediaAvaliacao,
    p.qtd_avaliacoes AS qtdAvaliacoes,
    es.id_estabelecimento AS idEstabelecimento,
    es.nome_fantasia AS estabelecimento,
    es.tipo AS tipoEstabelecimento,
    es.endereco, es.telefone, es.latitude, es.longitude
  FROM prestador p
  INNER JOIN especialidade e ON e.id_especialidade = p.id_especialidade
  LEFT JOIN estabelecimento es ON es.id_estabelecimento = (
    SELECT MIN(pe.id_estabelecimento) FROM prestador_estabelecimento pe
    WHERE pe.id_prestador = p.id_prestador
  )`;

export async function listarEspecialidades(db: SQLiteDatabase): Promise<string[]> {
  const linhas = await db.getAllAsync<{ nome: string }>(
    'SELECT nome FROM especialidade ORDER BY nome'
  );
  return linhas.map(l => l.nome);
}

// Apenas estabelecimentos ativos aparecem nas buscas.
export async function listarEstabelecimentos(db: SQLiteDatabase): Promise<Estabelecimento[]> {
  const linhas = await db.getAllAsync<LinhaEstabelecimento>(
    `${SQL_ESTABELECIMENTOS} WHERE es.ativo = 1 ORDER BY es.nome_fantasia`
  );
  return linhas.map(converterEstabelecimento);
}

export async function buscarEstabelecimento(db: SQLiteDatabase, id: number): Promise<Estabelecimento | null> {
  const linha = await db.getFirstAsync<LinhaEstabelecimento>(
    `${SQL_ESTABELECIMENTOS} WHERE es.id_estabelecimento = ?`,
    [id]
  );
  return linha ? converterEstabelecimento(linha) : null;
}

export async function listarMedicos(db: SQLiteDatabase): Promise<Medico[]> {
  return db.getAllAsync<Medico>(`${SQL_MEDICOS} WHERE p.ativo = 1 ORDER BY p.nome_completo`);
}

export async function buscarMedico(db: SQLiteDatabase, id: number): Promise<Medico | null> {
  return db.getFirstAsync<Medico>(`${SQL_MEDICOS} WHERE p.id_prestador = ?`, [id]);
}

// Equipe médica que atende em um estabelecimento.
export async function listarEquipe(
  db: SQLiteDatabase,
  idEstabelecimento: number
): Promise<{ id: number; nome: string; especialidade: string }[]> {
  return db.getAllAsync(
    `SELECT p.id_prestador AS id, p.nome_completo AS nome, e.nome AS especialidade
     FROM prestador_estabelecimento pe
     INNER JOIN prestador p ON p.id_prestador = pe.id_prestador
     INNER JOIN especialidade e ON e.id_especialidade = p.id_especialidade
     WHERE pe.id_estabelecimento = ? AND p.ativo = 1
     ORDER BY p.nome_completo`,
    [idEstabelecimento]
  );
}
