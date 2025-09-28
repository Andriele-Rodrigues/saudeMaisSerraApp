import { PRESTADORES } from '@/app/data/mockData';
import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ProviderCard = ({ item }: { item: typeof PRESTADORES[0] }) => (
  <Link href={{ pathname: '/guia-medico/detalhes', params: { id: item.id } }} asChild>
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.nome}</Text>
        <Text style={styles.cardSubtitle}>{item.especialidade}</Text>
        <Text style={styles.cardText}>{item.endereco}</Text>
        <Text style={styles.cardText}>{item.telefone}</Text>
      </View>
      <View style={styles.cardActions}>
        <Ionicons name="star-outline" size={28} color="#FFD700" />
        <Ionicons name="call" size={26} color="#00A896" style={{ marginTop: 15 }} />
      </View>
    </TouchableOpacity>
  </Link>
);

export default function ResultadosScreen() {
  const { plano, regiao, especialidade } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.filterInfo}>
        <Text style={styles.filterText}>Filtros: {plano}, {regiao}, {especialidade}</Text>
      </View>
      <FlatList
        data={PRESTADORES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProviderCard item={item} />}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      />
    </SafeAreaView>
  );
}

// ... (os styles continuam os mesmos do arquivo anterior)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  filterInfo: { padding: 15, backgroundColor: '#e0e0e0', borderBottomWidth: 1, borderColor: '#ccc' },
  filterText: { fontSize: 14, color: '#333' },
  card: {
    backgroundColor: '#fff', borderRadius: 8, padding: 15, marginTop: 15,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2, shadowRadius: 1.41,
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  cardSubtitle: { fontSize: 14, color: '#555', marginTop: 2, marginBottom: 8 },
  cardText: { fontSize: 14, color: '#777', marginTop: 4 },
  cardActions: {
    flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center',
    marginLeft: 10, paddingVertical: 5,
  },
});