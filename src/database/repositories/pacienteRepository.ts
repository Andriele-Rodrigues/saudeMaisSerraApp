import type { SQLiteDatabase } from 'expo-sqlite';

// O aplicativo funciona com um único usuário local, criado na carga inicial.
export const ID_PACIENTE_PADRAO = 1;

export type Paciente = { id: number; nome: string; email: string; cidade: string | null };

export async function buscarPaciente(db: SQLiteDatabase, id: number): Promise<Paciente | null> {
  return db.getFirstAsync<Paciente>(
    'SELECT id_paciente AS id, nome_completo AS nome, email, cidade FROM paciente WHERE id_paciente = ?',
    [id]
  );
}
