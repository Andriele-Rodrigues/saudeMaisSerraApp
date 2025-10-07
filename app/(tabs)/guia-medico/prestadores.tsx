import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';

type Prestador = {
  id: string;
  nome: string;
};

const tiposDePrestador: Prestador[] = [
  { id: '1', nome: 'Todos' },
  { id: '2', nome: 'Médicos' },
  { id: '3', nome: 'Clínicas' },
  { id: '4', nome: 'Laboratórios' },
  { id: '5', nome: 'Hospitais' },
];

export default function SelecionarPrestadorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams(); // ✅ mantém filtros anteriores

  const handleSelect = (item: Prestador) => {
    router.replace({
      pathname: '/guia-medico',
      params: {
        ...params,
        prestadorSelecionado: item.nome,
      },
    });
  };

  const renderItem = ({ item }: { item: Prestador }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handleSelect(item)}>
      <Text style={styles.itemText}>{item.nome}</Text>
      <Ionicons name="chevron-forward" size={24} color="#008584" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={tiposDePrestador}
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
