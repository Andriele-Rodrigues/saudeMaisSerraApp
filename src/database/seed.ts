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
