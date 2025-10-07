import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';

type Especialidade = {
  id: string;
  nome: string;
};

const TiposEspecialidades: Especialidade[] = [
  { id: '1', nome: 'Todas' },
  { id: '3', nome: 'Clínico Geral' },
  { id: '2', nome: 'Cardiologia' },
  { id: '4', nome: 'Dermatologia' },
  { id: '5', nome: 'Ginecologia' },
  { id: '10', nome: 'Endocrinologia' },
  { id: '11', nome: 'Gastroenterologia' },
  { id: '12', nome: 'Neurologia' },
  { id: '6', nome: 'Oftalmologia' },
  { id: '7', nome: 'Ortopedia' },
  { id: '13', nome: 'Otorrinolaringologia' },
  { id: '8', nome: 'Pediatria' },
  { id: '14', nome: 'Psicologia' },
  { id: '15', nome: 'Psiquiatria' },
  { id: '16', nome: 'Urologia' },
  { id: '9', nome: 'Raio X' },
  { id: '20', nome: 'Tomografia Computadorizada' },
  { id: '21', nome: 'Ressonância Magnética' },
  { id: '22', nome: 'Ultrassonografia / Ecografia' },
  { id: '23', nome: 'Mamografia' },
  { id: '24', nome: 'Densitometria Óssea' },
  { id: '30', nome: 'Exames de Sangue' },
  { id: '31', nome: 'Eletrocardiograma (ECG)' },
  { id: '32', nome: 'Endoscopia' },
  { id: '33', nome: 'Colonoscopia' },
  { id: '40', nome: 'Fisioterapia' },
  { id: '41', nome: 'Acupuntura' },
  { id: '42', nome: 'Pequenas Cirurgias' },
  { id: '43', nome: 'Nutrição' },
];

export default function SelecionarEspecialidadeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams(); // ✅ mantém filtros anteriores

  const handleSelect = (item: Especialidade) => {
    router.replace({
      pathname: '/guia-medico',
      params: {
        ...params,
        especialidadeSelecionada: item.nome,
      },
    });
  };

  const renderItem = ({ item }: { item: Especialidade }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handleSelect(item)}>
      <Text style={styles.itemText}>{item.nome}</Text>
      <Ionicons name="chevron-forward" size={24} color="#008584" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={TiposEspecialidades}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: { fontSize: 16, color: '#444' },
});
