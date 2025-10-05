
// Lista de especialidades para a tela Guia Médico -> Especialidades
export const ESPECIALIDADES = [
  "Acupuntura",
  "Alergia e Imunologia",
  "Análises Clínicas",
  "Anestesiologia",
  "Cardiologia",
  "Dermatologia",
  "Ortopedia",
  "Pediatria",
  "Psicologia",
  "Raio X",
];

// Lista de clínicas/hospitais para a tela de Resultados
export const PRESTADORES = [
  {
    id: '1',
    nome: 'Clínica Marquês',
    especialidade: 'Ortopedia',
    endereco: 'R. Visconde de Maricá, 1115, Caxias do Sul',
    telefone: '(54) 99123-4567',
    coords: { latitude: -29.1685, longitude: -51.1797 }, // <-- VERIFIQUE ESTA PROPRIEDADE
  },
  {
    id: '2',
    nome: 'SerraMed Center',
    especialidade: 'Raio X',
    endereco: 'R. Júlio de Castilhos, 287, Caxias do Sul',
    telefone: '(54) 99890-1234',
    coords: { latitude: -29.1654, longitude: -51.1834 }, // <-- E ESTA
  },
  {
    id: '3',
    nome: 'Bem Estar Saúde',
    especialidade: 'Cardiologia',
    endereco: 'R. Sinimbu, 560, Caxias do Sul',
    telefone: '(54) 3301-2277',
    coords: { latitude: -29.1711, longitude: -51.1782 }, // <-- E ESTA
  },
  {
    id: '4',
    nome: 'Harmonia Saúde',
    especialidade: 'Clínica Geral',
    endereco: 'Avenida Rio Branco, 456, Caxias do Sul',
    telefone: '(54) 3222-8899',
    coords: { latitude: -29.1670, longitude: -51.1750 }, // <-- E ESTA
  },]
// Lista de médicos para a tela de Agendamento -> Selecionar Médico
export const MEDICOS = [
    {
      id: '1',
      nome: 'Dr. Carlos Silva',
      especialidade: 'Clínico Geral',
      inicial: 'CS',
      // Adicione os campos abaixo
      endereco: 'Avenida Rio Branco, 456, Caxias do Sul',
      telefone: '(54) 3222-8899',
      foto: 'https://placehold.co/100x100/00A896/FFFFFF/png?text=CS'
    },
  ];

// Lista de horários para a tela de Agendamento -> Selecionar Horário
export const HORARIOS = [
    '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30'
];