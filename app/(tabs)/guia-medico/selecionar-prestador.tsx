
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TIPOS_PRESTADOR } from '../../api/mockData';

const ListItem = ({ item, onPress }: { item: string; onPress: () => void }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
    <Text style={styles.itemText}>{item}</Text>
    <Ionicons name="chevron-forward" size={24} color="#ccc" />
  </TouchableOpacity>
);

export default function SelecionarPrestadorScreen() {
  const router = useRouter();
  // Recebe o parâmetro da especialidade que já estava selecionada
  const { especialidadeAtual } = useLocalSearchParams();

  const handleSelect = (prestador: string) => {
    // --- CORREÇÃO APLICADA AQUI ---
    // Usamos o caminho absoluto '/guia-medico' para garantir que voltamos
    // para a tela de filtros correta, em vez de um caminho relativo.
    router.navigate({
      pathname: '/guia-medico', 
      params: { 
        prestadorSelecionado: prestador,
        especialidadeSelecionada: especialidadeAtual || 'Todas' 
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={TIPOS_PRESTADOR}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <ListItem item={item} onPress={() => handleSelect(item)} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  itemText: { fontSize: 16 },
  separator: { height: 1, backgroundColor: '#f0f0f0', marginLeft: 20 },
});