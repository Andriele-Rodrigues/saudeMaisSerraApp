// Funções auxiliares para o formato de data usado no banco: 'YYYY-MM-DD HH:MM:SS' (horário local).

const doisDigitos = (n: number) => String(n).padStart(2, '0');

export function formatarDataBanco(data: Date): string {
  return (
    `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())} ` +
    `${doisDigitos(data.getHours())}:${doisDigitos(data.getMinutes())}:00`
  );
}

// Monta a data a partir de um dia (Date) e de um horário 'HH:MM'.
export function combinarDiaHora(dia: Date, hora: string): Date {
  const [h, m] = hora.split(':').map(Number);
  const data = new Date(dia);
  data.setHours(h, m, 0, 0);
  return data;
}

export function somarMinutos(data: Date, minutos: number): Date {
  return new Date(data.getTime() + minutos * 60 * 1000);
}

// '2026-11-25 10:30:00' -> { data: '25/11/2026', hora: '10:30' }
export function separarDataBanco(valor: string): { data: string; hora: string } {
  const [dia, hora] = valor.split(' ');
  const [ano, mes, d] = dia.split('-');
  return { data: `${d}/${mes}/${ano}`, hora: hora.slice(0, 5) };
}
