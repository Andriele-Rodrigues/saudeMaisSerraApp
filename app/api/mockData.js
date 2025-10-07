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
    coords: { latitude: -29.1685, longitude: -51.1797 },
    tipo: 'clínica',
    equipe: [
      { id: 'e1', nome: 'Dra. Helena Souza', especialidade: 'Ortopedia' },
      { id: 'e2', nome: 'Dr. João Mendes', especialidade: 'Fisioterapia' },
    ]
  },
  {
    id: '2',
    nome: 'SerraMed Center',
    especialidade: 'Raio X',
    endereco: 'R. Júlio de Castilhos, 287, Caxias do Sul',
    telefone: '(54) 99890-1234',
    coords: { latitude: -29.1654, longitude: -51.1834 },
    tipo: 'clínica',
    equipe: [
      { id: 'e3', nome: 'Dra. Fernanda Lima', especialidade: 'Radiologia' },
      { id: 'e4', nome: 'Dr. Paulo Henrique', especialidade: 'Radiologia' },
    ]
  },
  {
    id: '3',
    nome: 'Bem Estar Saúde',
    especialidade: 'Cardiologia',
    endereco: 'R. Sinimbu, 560, Caxias do Sul',
    telefone: '(54) 3301-2277',
    coords: { latitude: -29.1711, longitude: -51.1782 },
    tipo: 'clínica',
    equipe: [
      { id: 'e5', nome: 'Dr. Marcos Tavares', especialidade: 'Cardiologia' },
      { id: 'e6', nome: 'Dra. Luiza Carvalho', especialidade: 'Clínica Geral' },
    ]
  },
  {
    id: '4',
    nome: 'Harmonia Saúde',
    especialidade: 'Clínica Geral',
    endereco: 'Avenida Rio Branco, 456, Caxias do Sul',
    telefone: '(54) 3222-8899',
    coords: { latitude: -29.1670, longitude: -51.1750 },
    tipo: 'clínica',
    equipe: [
      { id: 'e7', nome: 'Dr. Carlos Silva', especialidade: 'Clínico Geral' }
    ]
  },
];

// Lista de médicos individuais (também podem aparecer em clínicas)
export const MEDICOS = [
  {
    id: '1',
    nome: 'Dr. Carlos Silva',
    especialidade: 'Clínico Geral',
    inicial: 'CS',
    endereco: 'Avenida Rio Branco, 456, Caxias do Sul',
    telefone: '(54) 3222-8899',
    foto: 'https://placehold.co/100x100/00A896/FFFFFF/png?text=CS',
  },
];

// Lista de horários disponíveis para agendamento
export const HORARIOS = [
  '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30'
];
