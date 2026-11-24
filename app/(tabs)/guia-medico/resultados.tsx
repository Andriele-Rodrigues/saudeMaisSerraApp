import { useFavorites } from '@/contexts/FavoritesContext';
import {
  listarEstabelecimentos,
  listarMedicos,
  ROTULO_TIPO,
} from '@/src/database/repositories/prestadorRepository';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// Tipo comum para qualquer item exibido na lista de resultados (médico ou estabelecimento)
type ResultadoItem = {
  chave: string;
  id: number;
  nome: string;
  tipo: string;
  especialidades: string[];
  endereco: string;
  telefone: string;
  latitude: number | null;
  longitude: number | null;
  detalhe?: string;
};

// Converte o filtro escolhido na tela anterior para o rótulo do tipo
const FILTRO_TIPO: Record<string, string> = {
  'Médicos': 'Médico',
  'Clínicas': ROTULO_TIPO.clinica,
  'Hospitais': ROTULO_TIPO.hospital,
  'Laboratórios': ROTULO_TIPO.laboratorio,
  'Consultórios': ROTULO_TIPO.consultorio,
};

const abrirMapa = (item: ResultadoItem) =>
  item.latitude !== null && item.longitude !== null
    ? Linking.openURL(`https://maps.google.com/maps?q=${item.latitude},${item.longitude}`).catch(() => Alert.alert("Erro", "Não foi possível abrir o mapa."))
    : Alert.alert("Localização indisponível");

const ligar = (item: ResultadoItem) =>
  Linking.openURL(`tel:${item.telefone}`).catch(() => Alert.alert("Erro", "Não foi possível realizar a chamada."));

// --- COMPONENTES DOS CARDS ---

const MedicoCard = ({ item }: { item: ResultadoItem }) => {
  const router = useRouter();
  const handleSchedule = () => router.push({ pathname: '/guia-medico/agendar-consulta', params: { medicoId: String(item.id) } });

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.nome}</Text>
            <Text style={styles.cardSubtitle}>{item.especialidades.join(' / ')}</Text>
            <Text style={styles.cardText}>{item.endereco}</Text>
            {item.detalhe && <Text style={styles.cardText}>{item.detalhe}</Text>}
        </View>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => ligar(item)}>
            <Ionicons name="call" size={22} color="#00A896" />
            <Text style={styles.actionText}>Ligar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => abrirMapa(item)}>
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
    const handleSave = () => (isSaved ? removeFavorite(item.id) : addFavorite(item.id));

    return (
        <View style={styles.card}>
            <TouchableOpacity onPress={() => router.push({ pathname: '/guia-medico/detalhes', params: { id: String(item.id) } })}>
                <View style={styles.cardHeader}>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{item.nome}</Text>
                        <Text style={styles.cardSubtitle}>{item.tipo} · {item.especialidades.join(' / ')}</Text>
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
                <TouchableOpacity style={styles.actionButton} onPress={() => ligar(item)}>
                    <Ionicons name="call" size={22} color="#00A896" />
                    <Text style={styles.actionText}>Ligar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => abrirMapa(item)}>
                    <Ionicons name="map-outline" size={22} color="#00A896" />
                    <Text style={styles.actionText}>Rotas</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default function ResultadosScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const { prestador, especialidade } = useLocalSearchParams<{ prestador?: string; especialidade?: string }>();
  const [filteredResults, setFilteredResults] = useState<ResultadoItem[] | null>(null);

  useEffect(() => {
    let ativo = true;
    (async () => {
      const [medicos, estabelecimentos] = await Promise.all([listarMedicos(db), listarEstabelecimentos(db)]);

      const medicosFormatados: ResultadoItem[] = medicos.map(medico => ({
        chave: `m${medico.id}`,
        id: medico.id,
        nome: medico.nome,
        tipo: 'Médico',
        especialidades: [medico.especialidade],
        endereco: medico.endereco ?? 'Endereço não informado',
        telefone: medico.telefone ?? '',
        latitude: medico.latitude,
        longitude: medico.longitude,
        detalhe: medico.qtdAvaliacoes > 0
          ? `Nota ${Number(medico.mediaAvaliacao).toFixed(1)} (${medico.qtdAvaliacoes} avaliações)`
          : undefined,
      }));

      const estabelecimentosFormatados: ResultadoItem[] = estabelecimentos.map(est => ({
        chave: `e${est.id}`,
        id: est.id,
        nome: est.nome,
        tipo: ROTULO_TIPO[est.tipo],
        especialidades: est.especialidades,
        endereco: est.endereco ?? 'Endereço não informado',
        telefone: est.telefone ?? '',
        latitude: est.latitude,
        longitude: est.longitude,
      }));

      let resultados = [...medicosFormatados, ...estabelecimentosFormatados];
      const tipoFiltro = FILTRO_TIPO[String(prestador || 'Todos')];
      const especialidadeFiltro = String(especialidade || 'Todas');

      if (tipoFiltro) {
        resultados = resultados.filter(item => item.tipo === tipoFiltro);
      }
      if (especialidadeFiltro !== 'Todas') {
        resultados = resultados.filter(item => item.especialidades.includes(especialidadeFiltro));
      }
      if (ativo) setFilteredResults(resultados);
    })();
    return () => { ativo = false; };
  }, [db, prestador, especialidade]);

  const renderItem = ({ item }: { item: ResultadoItem }) =>
    item.tipo === 'Médico' ? <MedicoCard item={item} /> : <PrestadorCard item={item} />;

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#333" />
        <Text style={styles.backButtonText}>Voltar para Filtros</Text>
      </TouchableOpacity>

      <View style={styles.filterInfo}>
        <Text style={styles.filterText}>
          Exibindo resultados para: <Text style={{ fontWeight: 'bold' }}>{prestador ?? 'Todos'}</Text> em <Text style={{ fontWeight: 'bold' }}>{especialidade ?? 'Todas'}</Text>
        </Text>
      </View>

      {filteredResults === null ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredResults}
          keyExtractor={(item) => item.chave}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum resultado encontrado.</Text>
              <Text style={styles.cardText}>Tente outra especialidade ou outro tipo de prestador.</Text>
            </View>
          }
        />
      )}
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
