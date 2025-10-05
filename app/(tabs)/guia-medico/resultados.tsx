// <-- CAMINHO CORRIGIDO
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Linking, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MEDICOS, PRESTADORES } from '../api/mockData';

// --- TIPO UNIFICADO PARA EXIBIÇÃO ---
type ResultadoItem = {
  id: string;
  nome: string;
  tipo: 'Médico' | 'Clínica' | 'Hospital' | 'Laboratório';
  // A especialidade agora é uma lista de strings
  especialidades: string[]; 
  endereco: string;
  telefone: string;
  foto: string;
  coords?: { latitude: number; longitude: number };
};

// --- COMPONENTE DO CARD DE RESULTADO ---
const ResultadoCard = ({ item }: { item: ResultadoItem }) => {
  const router = useRouter();

  // Funções de ação para os botões do card
  const handleCall = () => Linking.openURL(`tel:${item.telefone}`).catch(() => Alert.alert("Erro", "Não foi possível realizar a chamada."));
  
  const handleMap = () => {
    if (item.coords) {
      Linking.openURL(`http://maps.google.com/maps?q=${item.coords.latitude},${item.coords.longitude}`).catch(() => Alert.alert("Erro", "Não foi possível abrir o mapa."));
    } else {
      Alert.alert("Localização Indisponível", "Este prestador não possui coordenadas de mapa.");
    }
  };

  const handleSchedule = () => {
    if (item.tipo === 'Médico') {
      router.push({
        pathname: '/guia-medico/agendar-consulta',
        params: { medicoId: item.id },
      });
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.nome}</Text>
            {/* Exibe as especialidades formatadas */}
            <Text style={styles.cardSubtitle}>{item.especialidades.join(' / ')}</Text>
            <Text style={styles.cardText}>{item.endereco}</Text>
        </View>
        <TouchableOpacity>
             <Ionicons name="star-outline" size={28} color="#FFD700" />
        </TouchableOpacity>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <Ionicons name="call" size={22} color="#00A896" />
            <Text style={styles.actionText}>Ligar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleMap}>
            <Ionicons name="location" size={22} color="#00A896" />
            <Text style={styles.actionText}>Localização</Text>
        </TouchableOpacity>
        {item.tipo === 'Médico' && (
            <TouchableOpacity style={styles.actionButton} onPress={handleSchedule}>
                <Ionicons name="calendar" size={22} color="#00A896" />
                <Text style={styles.actionText}>Agendar</Text>
            </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// --- TELA PRINCIPAL DE RESULTADOS ---
export default function ResultadosScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [filteredResults, setFilteredResults] = useState<ResultadoItem[]>([]);

  useEffect(() => {
    // 1. Mapeia os MÉDICOS para o formato de exibição unificado
    const medicosFormatados: ResultadoItem[] = MEDICOS.map(medico => ({
      id: medico.id,
      nome: medico.nome,
      tipo: 'Médico',
      especialidades: medico.especialidades,
      endereco: medico.endereco || PRESTADORES.find(p => p.id === medico.locaisAtendimentoIds[0])?.endereco || 'Endereço não informado',
      telefone: medico.telefone || PRESTADORES.find(p => p.id === medico.locaisAtendimentoIds[0])?.telefone || 'Telefone não informado',
      foto: medico.foto,
      coords: PRESTADORES.find(p => p.id === medico.locaisAtendimentoIds[0])?.coords,
    }));

    // 2. Mapeia os PRESTADORES para o formato de exibição unificado
    const prestadoresFormatados: ResultadoItem[] = PRESTADORES.map(prestador => ({
      ...prestador,
      foto: `https://placehold.co/100x100/00A896/FFFFFF?text=${prestador.nome.substring(0,2)}`,
    }));

    // 3. Combina as duas listas numa só
    let allProviders = [...medicosFormatados, ...prestadoresFormatados];

    // 4. Aplica os filtros
    const tipoFiltro = String(params.prestador || 'Todos').replace(/s$/, ''); // Remove o 's' do final (ex: Médicos -> Médico)
    const especialidadeFiltro = String(params.especialidade || 'Todos');

    if (tipoFiltro !== 'Todo') {
      allProviders = allProviders.filter(
        (provider) => provider.tipo.toLowerCase() === tipoFiltro.toLowerCase()
      );
    }

    if (especialidadeFiltro !== 'Todos') {
      // --- LÓGICA DE FILTRO CORRIGIDA ---
      // Verifica se a especialidade do filtro existe na LISTA de especialidades do prestador/médico
      allProviders = allProviders.filter(
        (provider) => provider.especialidades.includes(especialidadeFiltro)
      );
    }
    
    setFilteredResults(allProviders);
  }, [params]);

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={60} color="#ccc" />
      <Text style={styles.emptyText}>Nenhum resultado encontrado.</Text>
      <Text style={styles.emptySubtext}>Tente ajustar os seus filtros de busca.</Text>
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
        renderItem={({ item }) => <ResultadoCard item={item} />}
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
    marginTop: 15,
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2, 
    shadowRadius: 1.41,
  },
  cardHeader: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardContent: { flex: 1, marginRight: 10 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  cardSubtitle: { fontSize: 14, color: '#555', marginTop: 2, marginBottom: 8, flexWrap: 'wrap' },
  cardText: { fontSize: 14, color: '#777', marginTop: 4 },
  cardActions: {
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingVertical: 10,
  },
  actionButton: {
      alignItems: 'center',
  },
  actionText: {
      fontSize: 12,
      color: '#00A896',
      marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 5,
  }
});