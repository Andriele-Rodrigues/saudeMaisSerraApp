import { PRESTADORES } from '@/app/api/mockData';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function EquipeScreen() {
  const router = useRouter();
  const { endereco } = useLocalSearchParams();

  // Busca a clínica pelo endereço
  const prestador = PRESTADORES.find(p => p.endereco === endereco);
  const equipe = prestador?.equipe || [];

  const renderCard = ({ item }: any) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.especialidade}>{item.especialidade}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#008584" />
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Equipe médica</Text>

      <FlatList
        data={equipe}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#666' }}>
            Nenhum médico encontrado para esta clínica.
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backText: { fontSize: 16, marginLeft: 8, color: '#008584' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#333', textAlign: 'center' },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nome: { fontSize: 18, fontWeight: '600', color: '#333' },
  especialidade: { fontSize: 15, color: '#666', marginTop: 4 },
});
