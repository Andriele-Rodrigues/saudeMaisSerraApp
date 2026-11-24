import type { SQLiteDatabase } from 'expo-sqlite';

export type NovaAvaliacao = {
  agendamento: number;
  paciente: number;
  nota: number;
  comentario: string | null;
};

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
