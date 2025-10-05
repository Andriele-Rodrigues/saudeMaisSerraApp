import { PRESTADORES, Prestador } from '@/app/api/mockData';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, SafeAreaView, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// --- TELA DE DETALHES ---
// Esta tela é dedicada apenas a PRESTADORES (Clínicas, Hospitais, etc.)

export default function DetalhesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [prestador, setPrestador] = useState<Prestador | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && typeof id === 'string') {
      const foundItem = PRESTADORES.find(p => p.id === id);
      setPrestador(foundItem || null);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  if (!prestador) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Prestador não encontrado.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header prestador={prestador} />
      <PrestadorDetails prestador={prestador} />
    </SafeAreaView>
  );
}

// --- COMPONENTES DE LAYOUT ---

const Header = ({ prestador }: { prestador: Prestador }) => {
    const router = useRouter();
    const handleShare = async () => {
        try {
            await Share.share({ message: `Confira ${prestador.nome} no Saúde Mais Serra!` });
        } catch (error) {
            Alert.alert("Erro", "Não foi possível compartilhar.");
        }
    };

    return (
        <View style={styles.headerBar}>
            <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={28} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare}>
                <Ionicons name="share-social-outline" size={28} color="#333" />
            </TouchableOpacity>
        </View>
    );
};

const PrestadorDetails = ({ prestador }: { prestador: Prestador }) => {
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();
    const isSaved = isFavorite(prestador.id);

    const handleSave = () => {
        if (isSaved) {
            removeFavorite(prestador.id);
        } else {
            addFavorite(prestador);
        }
    };
    
    const handleAction = (action: string) => {
        Alert.alert(action, `Funcionalidade de "${action}" a ser implementada.`);
    };
    
    // --- NOTA IMPORTANTE ---
    // Para o mapa funcionar, substitua 'YOUR_API_KEY' pela sua chave da API Google Maps Static.
    const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${prestador.coords.latitude},${prestador.coords.longitude}&zoom=15&size=600x300&markers=color:red%7C${prestador.coords.latitude},${prestador.coords.longitude}&key=YOUR_API_KEY`;

    return (
        <ScrollView style={styles.prestadorScrollView}>
            {/* --- MAPA COMO IMAGEM ESTÁTICA --- */}
            <View style={styles.mapContainer}>
                <Image
                    source={{ uri: mapImageUrl }}
                    style={styles.mapImage}
                />
            </View>
            <View style={styles.prestadorInfoCard}>
                <Text style={styles.prestadorTitle}>{prestador.nome}</Text>
                <Text style={styles.prestadorSubtitle}>{prestador.especialidades.join(' / ')}</Text>
            </View>

            <View style={styles.actionGrid}>
                <GridButton icon="call-outline" label="Ligar" onPress={() => Linking.openURL(`tel:${prestador.telefone}`)} />
                <GridButton 
                    icon={isSaved ? "bookmark" : "bookmark-outline"} 
                    label={isSaved ? "Salvo" : "Salvar"} 
                    onPress={handleSave} 
                />
                <GridButton icon="map-outline" label="Rotas" onPress={() => Linking.openURL(`http://maps.google.com/maps?q=${prestador.coords.latitude},${prestador.coords.longitude}`)} />
                <GridButton icon="calendar-outline" label="Agenda" onPress={() => handleAction('Agenda')} />
                <GridButton icon="document-text-outline" label="Planos" onPress={() => handleAction('Planos')} />
                <GridButton icon="people-outline" label="Equipe" onPress={() => handleAction('Equipe')} />
            </View>
        </ScrollView>
    );
};

// Componente auxiliar
const GridButton = ({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) => (
    <TouchableOpacity style={styles.gridButton} onPress={onPress}>
        <Ionicons name={icon} size={30} color="#008584" />
        <Text style={styles.gridButtonText}>{label}</Text>
    </TouchableOpacity>
);


// --- ESTILOS ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E0F2F1' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { textAlign: 'center', marginTop: 50, fontSize: 18 },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  prestadorScrollView: { flex: 1 },
  mapContainer: {
      margin: 20,
      height: 200,
      borderRadius: 15,
      overflow: 'hidden',
      elevation: 5,
      backgroundColor: '#e0e0e0' // Cor de fundo enquanto a imagem carrega
  },
  mapImage: {
      width: '100%',
      height: '100%',
  },
  prestadorInfoCard: {
      backgroundColor: '#fff',
      borderRadius: 15,
      padding: 20,
      marginHorizontal: 20,
      marginTop: -50,
      alignItems: 'center',
      elevation: 5,
  },
  prestadorTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
  },
  prestadorSubtitle: {
      fontSize: 16,
      color: '#666',
      marginTop: 4,
      textAlign: 'center',
  },
  actionGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      marginTop: 10,
  },
  gridButton: {
      backgroundColor: '#fff',
      borderRadius: 15,
      width: '30%',
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 15,
      elevation: 3,
  },
  gridButtonText: {
      marginTop: 5,
      fontSize: 12,
      color: '#008584',
      fontWeight: '600',
  },
});