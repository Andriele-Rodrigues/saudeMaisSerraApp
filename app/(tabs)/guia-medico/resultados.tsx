import { Medico, MEDICOS, Prestador, PRESTADORES } from '@/app/api/mockData';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Linking, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// --- TIPO UNIFICADO PARA EXIBIÇÃO ---
// Um tipo comum que representa qualquer item que pode ser exibido na lista de resultados
type ResultadoItem = {
  id: string;
  nome: string;
  tipo: 'Médico' | 'Clínica' | 'Hospital' | 'Laboratório';
  especialidades: string[]; 
  endereco: string;
  telefone: string;
  foto: string;
  coords?: { latitude: number; longitude: number }; // A propriedade 'coords' é opcional
  originalItem: Medico | Prestador; 
};

// --- COMPONENTES DOS CARDS ---

const MedicoCard = ({ item }: { item: ResultadoItem }) => {
  const router = useRouter();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const isSaved = isFavorite(item.id);

  const handleSave = () => isSaved ? removeFavorite(item.id) : addFavorite(item.originalItem);
  const handleCall = () => Linking.openURL(`tel:${item.telefone}`).catch(() => Alert.alert("Erro", "Não foi possível realizar a chamada."));
  const handleMap = () => item.coords ? Linking.openURL(`http://maps.google.com/maps?q=${item.coords.latitude},${item.coords.longitude}`).catch(() => Alert.alert("Erro", "Não foi possível abrir o mapa.")) : Alert.alert("Localização Indisponível", "Este médico não possui uma localização principal definida.");
  const handleSchedule = () => router.push({ pathname: '/guia-medico/agendar-consulta', params: { medicoId: item.id } });
  
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.nome}</Text>
            <Text style={styles.cardSubtitle}>{item.especialidades.join(' / ')}</Text>
            <Text style={styles.cardText}>{item.endereco}</Text>
        </View>
        <TouchableOpacity onPress={handleSave}>
             <Ionicons name={isSaved ? "star" : "star-outline"} size={28} color="#FFD700" />
        </TouchableOpacity>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <Ionicons name="call" size={22} color="#00A896" />
            <Text style={styles.actionText}>Ligar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleMap}>
            <Ionicons name="map-outline" size={22} color="#00A896" />
            <Text style={styles.actionText}>Rotas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleSchedule}>
            <Ionicons name="calendar" size={22} color="#00A896" />
            <Text style={styles.actionText}>Agendar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const PrestadorCard = ({ item }: { item: ResultadoItem }) => {
    const router = useRouter();
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();
    const isSaved = isFavorite(item.id);

    const handleSave = () => isSaved ? removeFavorite(item.id) : addFavorite(item.originalItem);
    const handleCall = () => Linking.openURL(`tel:${item.telefone}`).catch(() => Alert.alert("Erro", "Não foi possível realizar a chamada."));
    const handleMap = () => item.coords ? Linking.openURL(`http://maps.google.com/maps?q=${item.coords.latitude},${item.coords.longitude}`).catch(() => Alert.alert("Erro", "Não foi possível abrir o mapa.")) : Alert.alert("Localização Indisponível");

    return (
        <View style={styles.card}>
            <TouchableOpacity onPress={() => router.push({ pathname: '/guia-medico/detalhes', params: { id: item.id } })}>
                <View style={styles.cardHeader}>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{item.nome}</Text>
                        <Text style={styles.cardSubtitle}>{item.especialidades.join(' / ')}</Text>
                        <Text style={styles.cardText}>{item.endereco}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={28} color="#ccc" />
                </View>
            </TouchableOpacity>
            <View style={styles.cardActions}>
                <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
                    <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={22} color="#00A896" />
                    <Text style={styles.actionText}>{isSaved ? "Salvo" : "Salvar"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
                    <Ionicons name="call" size={22} color="#00A896" />
                    <Text style={styles.actionText}>Ligar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleMap}>
                    <Ionicons name="map-outline" size={22} color="#00A896" />
                    <Text style={styles.actionText}>Rotas</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};


export default function ResultadosScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [filteredResults, setFilteredResults] = useState<ResultadoItem[]>([]);

  useEffect(() => {
    // --- LÓGICA CORRIGIDA ---
    // A lógica para encontrar o local principal foi melhorada para ser mais segura
    const medicosFormatados: ResultadoItem[] = MEDICOS.map(medico => {
      const localPrincipal = PRESTADORES.find(p => p.id === medico.locaisAtendimentoIds[0]);
      return {
        id: medico.id,
        nome: medico.nome,
        tipo: 'Médico',
        especialidades: medico.especialidades,
        endereco: medico.endereco || localPrincipal?.endereco || 'Endereço não informado',
        telefone: medico.telefone || localPrincipal?.telefone || 'Telefone não informado',
        foto: medico.foto,
        coords: localPrincipal?.coords, // Coords é opcional e pode ser undefined
        originalItem: medico,
      };
    });

    const prestadoresFormatados: ResultadoItem[] = PRESTADORES.map(prestador => ({
      ...prestador,
      foto: `https://placehold.co/100x100/00A896/FFFFFF?text=${prestador.nome.substring(0,2)}`,
      originalItem: prestador,
    }));

    let allProviders = [...medicosFormatados, ...prestadoresFormatados];

    const tipoFiltro = String(params.prestador || 'Todos').replace(/s$/, '');
    const especialidadeFiltro = String(params.especialidade || 'Todas');

    if (tipoFiltro !== 'Todo') {
      allProviders = allProviders.filter(provider => provider.tipo.toLowerCase() === tipoFiltro.toLowerCase());
    }

    if (especialidadeFiltro !== 'Todas') {
      allProviders = allProviders.filter(provider => provider.especialidades.includes(especialidadeFiltro));
    }
    
    setFilteredResults(allProviders);
  }, [params]);
  
  const renderItem = ({ item }: { item: ResultadoItem }) => {
      if (item.tipo === 'Médico') {
          return <MedicoCard item={item} />;
      }
      return <PrestadorCard item={item} />;
  };

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
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20 }}
        ListEmptyComponent={<View style={styles.emptyContainer}><Text style={styles.emptyText}>Nenhum resultado encontrado.</Text></View>}
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
    alignItems: 'center',
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
    color: '#888',
  },
});