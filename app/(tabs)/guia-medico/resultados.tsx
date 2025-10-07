import { MEDICOS, PRESTADORES } from '@/app/api/mockData';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';


// Tipagem unificada
interface Provider {
  id: string;
  nome: string;
  especialidade: string;
  tipo: 'Clínica' | 'Médico';
  endereco?: string;
  telefone?: string;
}

const ProviderCard = ({ item }: { item: Provider }) => {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleCall = (phoneNumber?: string) => {
    if (phoneNumber) Linking.openURL(`tel:${phoneNumber}`);
    else Alert.alert("Telefone não disponível");
  };

  const handleLocation = (address?: string) => {
    if (address) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      Linking.openURL(url);
    } else {
      Alert.alert("Endereço não disponível");
    }
  };

  const handleSchedule = (providerId: string) => {
    router.push({ pathname: '/(tabs)/guia-medico/agendar-consulta', params: { medicoId: providerId } });
  };

  const handleDetails = (provider: Provider) => {
    if (provider.tipo === 'Clínica') {
      router.push({
        pathname: '/(tabs)/guia-medico/equipe',
        params: { endereco: provider.endereco || '' }
      });
    } else {
      router.push({
        pathname: '/(tabs)/guia-medico/detalhes',
        params: { id: provider.id }
      });
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos!");
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.nome}</Text>
        <Text style={styles.cardSubtitle}>{item.especialidade}</Text>
        {item.endereco && <Text style={styles.cardText}>{item.endereco}</Text>}
      </View>

      <View style={styles.iconContainer}>
        {item.tipo === 'Médico' ? (
          <>
            <TouchableOpacity onPress={toggleFavorite} style={styles.iconButton}>
              <Ionicons name={isFavorite ? "star" : "star-outline"} size={28} color="#FFD700" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCall(item.telefone)} style={styles.iconButton}>
              <Ionicons name="call" size={26} color="#00A896" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLocation(item.endereco)} style={styles.iconButton}>
              <Ionicons name="location-sharp" size={26} color="#00A896" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSchedule(item.id)} style={styles.iconButton}>
              <Ionicons name="calendar" size={26} color="#00A896" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={toggleFavorite} style={styles.iconButton}>
              <Ionicons name={isFavorite ? "star" : "star-outline"} size={28} color="#FFD700" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCall(item.telefone)} style={styles.iconButton}>
              <Ionicons name="call" size={26} color="#00A896" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDetails(item)} style={styles.iconButton}>
              <Ionicons name="information-circle" size={26} color="#00A896" />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default function ResultadosScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [filteredResults, setFilteredResults] = useState<Provider[]>([]);

  useEffect(() => {
    const allProviders: Provider[] = [
      ...PRESTADORES.map((p): Provider => ({ ...p, tipo: 'Clínica' })),
      ...MEDICOS.map((m): Provider => ({ ...m, tipo: 'Médico' }))
    ];
    let results = allProviders;

    if (params.prestador && params.prestador !== 'Todos') {
      const prestadorFiltro = String(params.prestador)
        .normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
      results = results.filter((provider) => {
        const tipoNormalizado = provider.tipo
          .normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
        return tipoNormalizado === prestadorFiltro;
      });
    }

    if (params.especialidade && params.especialidade !== 'Todas') {
      const especialidadeQuery = String(params.especialidade)
        .normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
      results = results.filter((provider) => {
        const especialidadeNormalizada = provider.especialidade
          .normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
        return especialidadeNormalizada.includes(especialidadeQuery);
      });
    }

    setFilteredResults(results);
  }, [params]);

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={60} color="#ccc" />
      <Text style={styles.emptyText}>Nenhum resultado encontrado.</Text>
      <Text style={styles.emptySubtext}>Tente ajustar seus filtros de busca.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#333" />
        <Text style={styles.backButtonText}>Voltar para Filtros</Text>
      </TouchableOpacity>

      <View style={styles.filterInfo}>
        <Text style={styles.filterText}>
          Exibindo resultados para: <Text style={{ fontWeight: 'bold' }}>{params.prestador}</Text> em <Text style={{ fontWeight: 'bold' }}>{params.especialidade}</Text>
        </Text>
      </View>

      <FlatList
        data={filteredResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProviderCard item={item} />}
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20 }}
        ListEmptyComponent={renderEmptyList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  backButton: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  backButtonText: { fontSize: 16, marginLeft: 8, color: '#333' },
  filterInfo: {
    padding: 15,
    backgroundColor: '#e9ecef',
    borderBottomWidth: 1,
    borderColor: '#dee2e6'
  },
  filterText: { fontSize: 14, color: '#495057' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginTop: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  cardSubtitle: { fontSize: 14, color: '#555', marginTop: 2, marginBottom: 8 },
  cardText: { fontSize: 14, color: '#777', marginTop: 4 },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 10,
    marginTop: 10
  },
  iconButton: {
    marginLeft: 20
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100
  },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#888', marginTop: 10 },
  emptySubtext: { fontSize: 14, color: '#aaa', marginTop: 5 }
});
