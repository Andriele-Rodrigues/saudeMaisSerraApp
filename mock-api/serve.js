const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Dados Mock
const tiposServicos = [
  { id_tipo: 1, nome: 'Clínica Geral', icone: 'clinic-icon.png', descricao: 'Consultas gerais para diagnóstico e acompanhamento.' },
  { id_tipo: 2, nome: 'Exames', icone: 'exams-icon.png', descricao: 'Laboratórios especializados para exames diversos.' },
  { id_tipo: 3, nome: 'Cirurgias', icone: 'surgery-icon.png', descricao: 'Consultas e realização de cirurgias especializadas.' },
];

const estabelecimentos = {
  1: [
    { id_estabelecimento: 1, nome_fantasia: 'Clínica Saúde Serra', cidade: 'Caxias do Sul', estado: 'RS', telefone: '1234-5678', endereco: 'Rua Exemplo, 123', id_tipo_servico: 1 },
    { id_estabelecimento: 2, nome_fantasia: 'Laboratório Serra Saúde', cidade: 'Caxias do Sul', estado: 'RS', telefone: '9876-5432', endereco: 'Av. Saúde, 456', id_tipo_servico: 2 },
  ],
  2: [
    { id_estabelecimento: 3, nome_fantasia: 'Hospital Geral', cidade: 'Caxias do Sul', estado: 'RS', telefone: '1234-9876', endereco: 'Rua dos Hospitais, 789', id_tipo_servico: 3 },
  ],
};

// Endpoints da API

// 1. Retorna os tipos de serviços
app.get('/tipos-servicos', (req, res) => {
  res.json(tiposServicos);
});

// 2. Retorna os estabelecimentos de um tipo de serviço específico
app.get('/estabelecimentos/:id_tipo_servico', (req, res) => {
  const id_tipo_servico = parseInt(req.params.id_tipo_servico);
  res.json(estabelecimentos[id_tipo_servico] || []);
});

// 3. Retorna os prestadores por especialidade
app.get('/prestadores/:especialidade', (req, res) => {
  const especialidade = req.params.especialidade;
  const prestadores = [
    { id_prestador: 1, nome_completo: 'Dr. João Silva', especialidade, cidade: 'Caxias do Sul', estado: 'RS', telefone: '1122-3344', email: 'joao@exemplo.com' },
    { id_prestador: 2, nome_completo: 'Dr. Maria Souza', especialidade, cidade: 'Caxias do Sul', estado: 'RS', telefone: '2233-4455', email: 'maria@exemplo.com' },
  ];
  res.json(prestadores);
});

// 4. Criação de um agendamento
app.post('/agendamentos', (req, res) => {
  const { id_paciente, id_prestador, id_estabelecimento, inicio, fim, status, observacoes } = req.body;
  // Aqui você pode salvar o agendamento no banco de dados, por enquanto, vamos retornar o que foi enviado.
  const agendamento = {
    id_agendamento: Math.floor(Math.random() * 1000),
    status,
    data_hora: inicio,
  };
  res.json(agendamento);
});

// 5. Retorna os agendamentos de um paciente
app.get('/agendamentos/:id_paciente', (req, res) => {
  const id_paciente = req.params.id_paciente;
  res.json([
    { id_agendamento: 1, id_prestador: 1, inicio: '2025-09-30T10:00:00', fim: '2025-09-30T10:30:00', status: 'agendado' },
  ]);
});

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});