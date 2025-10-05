// app/medicacao.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// 1. DEFININDO A ESTRUTURA DOS DADOS
//    Isso ajuda o TypeScript a entender o que é um "medicamento" e quais propriedades ele tem.
type Medicamento = {
  id: string;
  nome: string;
  dosagem: string; // Ex: "1 comprimido de 8 em 8 horas"
  inicio: string;
  fim: string;
};

// 2. CRIANDO DADOS DE EXEMPLO
//    Como ainda não temos um banco de dados, usamos essa lista para popular a tela.
const DADOS_MEDICAMENTOS: Medicamento[] = [
  {
    id: '1',
    nome: 'Paracetamol 750mg',
    dosagem: '1 comprimido de 8 em 8 horas',
    inicio: '20/09/2025',
    fim: '25/09/2025',
  },
  {
    id: '2',
    nome: 'Amoxicilina 500mg',
    dosagem: '1 cápsula de 12 em 12 horas',
    inicio: '18/09/2025',
    fim: '28/09/2025',
  },
  {
    id: '3',
    nome: 'Vitamina C',
    dosagem: '1 comprimido por dia',
    inicio: '01/01/2025',
    fim: 'Uso Contínuo',
  },
];

// 3. COMPONENTE PARA O CARD DE MEDICAÇÃO
//    Criar um componente separado para o card deixa o código principal mais limpo.
const MedicationCard = ({ item }: { item: Medicamento }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Icon name="pill" size={24} color="#008584" />
      <Text style={styles.medicationName}>{item.nome}</Text>
    </View>
    <Text style={styles.medicationDosage}>{item.dosagem}</Text>
    <View style={styles.dateContainer}>
      <Text style={styles.dateText}>Início: {item.inicio}</Text>
      <Text style={styles.dateText}>Fim: {item.fim}</Text>
    </View>
  </View>
);

// 4. TELA PRINCIPAL DE MEDICAÇÃO
export default function MedicacaoScreen() {
  const router = useRouter(); // Hook do Expo Router para navegação
  const [medicamentos] = useState(DADOS_MEDICAMENTOS);

 console.log("Dados na tela de medicação:", medicamentos);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#E0F2F1" />
      
      {/* Cabeçalho da tela com botão de voltar e título */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Minhas Medicações</Text>
      </View>

      {/* Lista que renderiza os cards */}
      <FlatList
        data={medicamentos}
        renderItem={({ item }) => <MedicationCard item={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma medicação cadastrada.</Text>}
      />

      {/* Botão flutuante para adicionar novos medicamentos */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => Alert.alert('Adicionar Medicação', 'Esta funcionalidade ainda será implementada.')}
      >
        <Icon name="plus" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// 5. ESTILOS DOS COMPONENTES
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E0F2F1',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    color: '#333',
  },
  listContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  medicationDosage: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    marginTop: 5,
  },
  dateText: {
    fontSize: 14,
    color: '#777',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#008584',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});