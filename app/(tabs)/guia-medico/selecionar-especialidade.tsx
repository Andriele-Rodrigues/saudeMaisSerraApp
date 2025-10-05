
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ESPECIALIDADES } from '../api/mockData';

const ListItem = ({ item, onPress }: { item: string; onPress: () => void }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
    <Text style={styles.itemText}>{item}</Text>
    <Ionicons name="chevron-forward" size={24} color="#ccc" />
  </TouchableOpacity>
);

export default function SelecionarEspecialidadeScreen() {
  const router = useRouter();
  // Recebe o parâmetro do prestador que já estava selecionado
  const { prestadorAtual } = useLocalSearchParams();

  const handleSelect = (especialidade: string) => {
    // Usamos o caminho absoluto '/guia-medico' para garantir que voltamos
    // para a tela de filtros correta.
    router.navigate({
      pathname: '/guia-medico',
      params: { 
        prestadorSelecionado: prestadorAtual || 'Todos',
        especialidadeSelecionada: especialidade 
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={['Todas', ...ESPECIALIDADES]}
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  itemText: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 20,
  },
});