import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router'; // ✅ Import para voltar de tela
import React, { useState } from 'react';
import {
  Button,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// ✅ Tipo dos exames
type Exame = {
  id: string;
  nome: string;
  medico: string;
  detalhes: string;
  tipo: 'sangue' | 'imagem' | 'ressonancia' | 'raiox';
};

// ✅ Lista de exames fictícios
const examesMock: Exame[] = [
  {
    id: '1',
    nome: 'Hemograma Completo',
    medico: 'Dr. João da Silva',
    detalhes: 'Jejum de 8h necessário. Exame de sangue completo.',
    tipo: 'sangue',
  },
  {
    id: '2',
    nome: 'Ultrassonografia Abdominal',
    medico: 'Dra. Ana Maria',
    detalhes: 'Jejum de 6h recomendado. Verifica fígado, rins, vesícula.',
    tipo: 'imagem',
  },
  {
    id: '3',
    nome: 'Ressonância Magnética',
    medico: 'Dr. Fernando Costa',
    detalhes: 'Evitar objetos metálicos. Dura cerca de 30 minutos.',
    tipo: 'ressonancia',
  },
  {
    id: '4',
    nome: 'Raio-X de Tórax',
    medico: 'Dra. Cláudia Ramos',
    detalhes: 'Remover acessórios e colares. Rápido e indolor.',
    tipo: 'raiox',
  },
];

// ✅ Define o ícone conforme o tipo de exame
const getIconeExame = (tipo: Exame['tipo']) => {
  switch (tipo) {
    case 'sangue':
      return <Ionicons name="water-outline" size={28} color="#d32f2f" />;
    case 'imagem':
      return <Ionicons name="images-outline" size={28} color="#1976d2" />;
    case 'ressonancia':
      return <Ionicons name="pulse-outline" size={28} color="#6a1b9a" />;
    case 'raiox':
      return <Ionicons name="scan-outline" size={28} color="#f57c00" />;
    default:
      return <Ionicons name="flask-outline" size={28} color="#555" />;
  }
};

export default function ExamesScreen() {
  const navigation = useNavigation(); // ✅ Para voltar à tela anterior
  const [exameSelecionado, setExameSelecionado] = useState<Exame | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const abrirDetalhes = (exame: Exame) => {
    setExameSelecionado(exame);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* ✅ Cabeçalho com botão de voltar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Seus Exames</Text>
      </View>

      {/* ✅ Lista de exames */}
      <FlatList
        data={examesMock}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => abrirDetalhes(item)}
            activeOpacity={0.7}
          >
            <View style={styles.cardIconArea}>
              {getIconeExame(item.tipo)}
            </View>
            <View style={styles.cardTextArea}>
              <Text style={styles.nomeExame}>{item.nome}</Text>
              <View style={styles.medicoRow}>
                <Ionicons name="person-circle-outline" size={18} color="#555" />
                <Text style={styles.medico}> {item.medico}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* ✅ Modal com detalhes do exame */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalFundo}>
          <View style={styles.modalConteudo}>
            <Text style={styles.modalTitulo}>{exameSelecionado?.nome}</Text>
            <Text style={styles.modalTexto}>{exameSelecionado?.detalhes}</Text>

            <TouchableOpacity style={styles.botao} onPress={() => {}}>
              <Text style={styles.botaoTexto}>Buscar locais próximos</Text>
            </TouchableOpacity>

            <Button title="Fechar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ✅ Estilos da tela
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f0ff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  cardIconArea: {
    marginRight: 16,
  },
  cardTextArea: {
    flex: 1,
  },
  nomeExame: {
    fontSize: 18,
    fontWeight: '600',
  },
  medicoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  medico: {
    fontSize: 14,
    color: '#555',
  },
  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalConteudo: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '80%',
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalTexto: {
    fontSize: 16,
    marginBottom: 20,
  },
  botao: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  botaoTexto: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});
