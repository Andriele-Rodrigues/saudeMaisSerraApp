import type { SQLiteDatabase } from 'expo-sqlite';
import type { Estabelecimento, TipoEstabelecimento } from './prestadorRepository';

type LinhaFavorito = Omit<Estabelecimento, 'especialidades' | 'ativo'> & { ativo: number };

export async function listarFavoritos(db: SQLiteDatabase, idPaciente: number): Promise<Estabelecimento[]> {
  const linhas = await db.getAllAsync<LinhaFavorito>(
    `SELECT
       es.id_estabelecimento AS id, es.nome_fantasia AS nome, es.tipo, es.cidade, es.bairro,
       es.endereco, es.telefone, es.latitude, es.longitude, es.ativo
     FROM favorito f
     INNER JOIN estabelecimento es ON es.id_estabelecimento = f.id_estabelecimento
     WHERE f.id_paciente = ?
     ORDER BY f.criado_em DESC`,
    [idPaciente]
  );
  return linhas.map(l => ({ ...l, tipo: l.tipo as TipoEstabelecimento, especialidades: [], ativo: l.ativo === 1 }));
}

export async function adicionarFavorito(db: SQLiteDatabase, idPaciente: number, idEstabelecimento: number) {
  await db.runAsync(
    'INSERT OR IGNORE INTO favorito (id_paciente, id_estabelecimento) VALUES (?, ?)',
    [idPaciente, idEstabelecimento]
  );
}

export async function removerFavorito(db: SQLiteDatabase, idPaciente: number, idEstabelecimento: number) {
  await db.runAsync(
    'DELETE FROM favorito WHERE id_paciente = ? AND id_estabelecimento = ?',
    [idPaciente, idEstabelecimento]
  );
}
