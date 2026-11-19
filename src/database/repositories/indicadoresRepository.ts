import type { SQLiteDatabase } from 'expo-sqlite';

export type ItemIndicador = { rotulo: string; valor: number; detalhe?: string };

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

export async function totalAgendamentos(db: SQLiteDatabase): Promise<number> {
  const linha = await db.getFirstAsync<{ total: number }>('SELECT COUNT(*) AS total FROM agendamento');
  return linha?.total ?? 0;
}
