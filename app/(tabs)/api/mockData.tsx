// --- TIPOS PARA OS DADOS FALSOS ---
// A definição de tipos garante que todos os seus dados sigam a mesma estrutura, evitando erros.

export type Prestador = {
  id: string;
  nome: string;
  tipo: 'Clínica' | 'Hospital' | 'Laboratório';
  especialidades: string[]; // Prestadores agora têm a sua própria lista de especialidades
  endereco: string;
  telefone: string;
  coords: { latitude: number; longitude: number };
};

export type Medico = {
  id: string;
  nome: string;
  especialidades: string[]; // Um médico pode ter mais de uma especialidade
  locaisAtendimentoIds: string[]; // IDs dos prestadores onde o médico atende
  foto: string;
  // Campos opcionais para médicos com consultório próprio
  endereco?: string;
  telefone?: string;
};


// --- LISTAS DE DADOS FALSOS ---

// Lista de todos os tipos de prestadores (para a tela de seleção)
export const TIPOS_PRESTADOR = ['Médicos', 'Clínicas', 'Laboratórios', 'Hospitais'];

// Lista completa de especialidades e procedimentos
export const ESPECIALIDADES: string[] = [
  "Acupuntura", "Alergia e Imunologia", "Análises Clínicas", "Anestesiologia", "Cardiologia", "Cirurgia Geral",
  "Clínico Geral", "Colonoscopia", "Densitometria Óssea", "Dermatologia", "Eletrocardiograma (ECG)", "Endocrinologia",
  "Endoscopia", "Exames de Sangue", "Fisioterapia", "Gastroenterologia", "Ginecologia", "Mamografia", "Neurologia",
  "Nutrição", "Oftalmologia", "Ortopedia", "Otorrinolaringologia", "Pediatria", "Pequenas Cirurgias", "Psicologia",
  "Psiquiatria", "Raio X", "Ressonância Magnética", "Tomografia Computadorizada", "Ultrassonografia / Ecografia", "Urologia"
];

// Lista de prestadores (hospitais, clínicas, laboratórios) com as suas especialidades
export const PRESTADORES: Prestador[] = [
  {
    id: 'p1',
    nome: 'Hospital Central da Serra',
    tipo: 'Hospital',
    especialidades: ['Cardiologia', 'Ortopedia', 'Pediatria', 'Cirurgia Geral', 'Ginecologia', 'Gastroenterologia'],
    endereco: 'Av. Júlio de Castilhos, 2045, Caxias do Sul',
    telefone: '(54) 3225-8899',
    coords: { latitude: -29.1654, longitude: -51.1834 },
  },
  {
    id: 'p2',
    nome: 'Clínica Saúde Plena',
    tipo: 'Clínica',
    especialidades: ['Clínico Geral', 'Dermatologia', 'Cardiologia', 'Pequenas Cirurgias'],
    endereco: 'Rua das Flores, 123, Caxias do Sul',
    telefone: '(54) 3223-1122',
    coords: { latitude: -29.1685, longitude: -51.1797 },
  },
  {
    id: 'p3',
    nome: 'Laboratório Exame Certo',
    tipo: 'Laboratório',
    especialidades: ['Análises Clínicas', 'Exames de Sangue', 'Raio X', 'Mamografia', 'Tomografia Computadorizada'],
    endereco: 'Rua Sinimbu, 1500, Caxias do Sul',
    telefone: '(54) 3228-4455',
    coords: { latitude: -29.1711, longitude: -51.1782 },
  },
   {
    id: 'p4',
    nome: 'Clínica Pediátrica Anjos',
    tipo: 'Clínica',
    especialidades: ['Pediatria', 'Alergia e Imunologia'],
    endereco: 'Rua Bento Gonçalves, 1890, Caxias do Sul',
    telefone: '(54) 3214-6677',
    coords: { latitude: -29.1720, longitude: -51.1790 },
  },
];

// Lista de médicos, interligados com especialidades e prestadores
export const MEDICOS: Medico[] = [
  {
    id: 'm1',
    nome: 'Dr. Carlos Silva',
    especialidades: ['Clínico Geral'],
    locaisAtendimentoIds: ['p2'], // Atende na Clínica Saúde Plena
    foto: 'https://placehold.co/100x100/EFEFEF/333?text=CS',
  },
  {
    id: 'm2',
    nome: 'Dra. Ana Souza',
    especialidades: ['Cardiologia', 'Eletrocardiograma (ECG)'],
    locaisAtendimentoIds: ['p1', 'p2'], // Atende no Hospital Central e na Saúde Plena
    foto: 'https://placehold.co/100x100/EFEFEF/333?text=AS',
  },
  {
    id: 'm3',
    nome: 'Dr. Pedro Oliveira',
    especialidades: ['Ortopedia', 'Traumatologia'],
    locaisAtendimentoIds: ['p1'], // Atende no Hospital Central
    foto: 'https://placehold.co/100x100/EFEFEF/333?text=PO',
  },
  {
    id: 'm4',
    nome: 'Dra. Beatriz Costa',
    especialidades: ['Pediatria'],
    locaisAtendimentoIds: ['p4'], // Atende na Clínica Pediátrica Anjos
    foto: 'https://placehold.co/100x100/EFEFEF/333?text=BC',
  },
  {
    id: 'm5',
    nome: 'Dr. João Mendes',
    especialidades: ['Dermatologia', 'Pequenas Cirurgias'],
    locaisAtendimentoIds: ['p2'], // Atende na Clínica Saúde Plena
    foto: 'https://placehold.co/100x100/EFEFEF/333?text=JM',
  },
  {
    id: 'm6',
    nome: 'Dra. Sofia Martins',
    especialidades: ['Ginecologia', 'Ultrassonografia / Ecografia'],
    locaisAtendimentoIds: ['p1'], // Atende no Hospital Central
    foto: 'https://placehold.co/100x100/EFEFEF/333?text=SM',
  },
  {
    id: 'm7',
    nome: 'Dr. Lucas Ferreira',
    especialidades: ['Gastroenterologia', 'Endoscopia'],
    locaisAtendimentoIds: ['p1', 'p2'],
    foto: 'https://placehold.co/100x100/EFEFEF/333?text=LF',
  },
  // Exemplo de médico com clínica própria
  {
    id: 'm8',
    nome: 'Dra. Helena Costa',
    especialidades: ['Psicologia'],
    locaisAtendimentoIds: [], // Não atende em nenhum dos prestadores listados
    foto: 'https://placehold.co/100x100/EFEFEF/333?text=HC',
    // Dados do consultório próprio
    endereco: 'Rua das Acácias, 789, Sala 304, Caxias do Sul',
    telefone: '(54) 99888-7777',
  },
];


// Lista de horários para a tela de Agendamento
export const HORARIOS: string[] = [
  '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30',
];