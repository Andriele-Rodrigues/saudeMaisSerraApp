import type { SQLiteDatabase } from 'expo-sqlite';
import { formatarDataBanco } from '../datas';

export type StatusAgendamento = 'agendado' | 'realizado' | 'cancelado' | 'faltou';

export type Agendamento = {
  id: number;
  idPrestador: number;
  idEstabelecimento: number | null;
  tipo: 'consulta' | 'exame';
  inicio: string;
  fim: string;
  status: StatusAgendamento;
  observacoes: string | null;
  medico: string;
  especialidade: string;
  estabelecimento: string | null;
  endereco: string | null;
  telefone: string | null;
  avaliado: number;
};

export type NovoAgendamento = {
  paciente: number;
  prestador: number;
  estabelecimento: number | null;
  tipo: 'consulta' | 'exame';
  inicio: string;
  fim: string;
  observacoes: string | null;
};

export class ConflitoHorarioError extends Error {
  constructor() {
    super('Este profissional já possui um agendamento nesse horário. Escolha outro horário.');
    this.name = 'ConflitoHorarioError';
  }
}

// Agendamentos cujo horário de término já passou deixam de estar "agendados".
export async function atualizarAgendamentosRealizados(db: SQLiteDatabase) {
  await db.runAsync(
    `UPDATE agendamento SET status = 'realizado'
     WHERE status = 'agendado' AND fim <= ?`,
    [formatarDataBanco(new Date())]
  );
}

export async function listarAgendamentos(db: SQLiteDatabase, idPaciente: number): Promise<Agendamento[]> {
  return db.getAllAsync<Agendamento>(
    `SELECT
       a.id_agendamento AS id,
       a.id_prestador AS idPrestador,
       a.id_estabelecimento AS idEstabelecimento,
       a.tipo, a.inicio, a.fim, a.status, a.observacoes,
       p.nome_completo AS medico,
       e.nome AS especialidade,
       es.nome_fantasia AS estabelecimento,
       es.endereco, es.telefone,
       EXISTS (SELECT 1 FROM avaliacao av WHERE av.id_agendamento = a.id_agendamento) AS avaliado
     FROM agendamento a
     INNER JOIN prestador p ON p.id_prestador = a.id_prestador
     INNER JOIN especialidade e ON e.id_especialidade = p.id_especialidade
     LEFT JOIN estabelecimento es ON es.id_estabelecimento = a.id_estabelecimento
     WHERE a.id_paciente = ?
     ORDER BY a.inicio`,
    [idPaciente]
  );
}

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

// Horários de início já ocupados de um profissional em um dia ('YYYY-MM-DD').
export async function listarHorariosOcupados(
  db: SQLiteDatabase,
  idPrestador: number,
  dia: string
): Promise<string[]> {
  const linhas = await db.getAllAsync<{ hora: string }>(
    `SELECT strftime('%H:%M', inicio) AS hora FROM agendamento
     WHERE id_prestador = ? AND status != 'cancelado' AND date(inicio) = ?`,
    [idPrestador, dia]
  );
  return linhas.map(l => l.hora);
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
