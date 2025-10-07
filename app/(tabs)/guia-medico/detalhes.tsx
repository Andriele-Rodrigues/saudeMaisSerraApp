<<<<<<< HEAD
import { PRESTADORES, Prestador } from '@/app/api/mockData';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, SafeAreaView, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// --- TELA DE DETALHES ---
// Esta tela é dedicada apenas a PRESTADORES (Clínicas, Hospitais, etc.)
=======
import { MEDICOS, PRESTADORES } from '@/app/api/mockData';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Linking,
  Platform,
  SafeAreaView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Prestador {
  id: string;
  nome: string;
  endereco: string;
  especialidade: string;
  telefone?: string;
  coords?: { latitude: number; longitude: number };
  tipo?: string;
  equipe?: {
    id: string;
    nome: string;
    especialidade: string;
  }[];
}
>>>>>>> feat/equipe-medica

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

<<<<<<< HEAD
  if (loading) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }
=======
  const handleLigar = () => {
    if (prestador?.telefone) {
      Linking.openURL(`tel:${prestador.telefone}`).catch(() => {
        Alert.alert('Erro', 'Não foi possível abrir o discador.');
      });
    } else {
      Alert.alert('Sem telefone', 'Este estabelecimento não possui telefone cadastrado.');
    }
  };

  const handleRotas = () => {
    if (prestador?.coords) {
      const { latitude, longitude } = prestador.coords;
      const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
      const latLng = `${latitude},${longitude}`;
      const label = prestador.nome;
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`
      });
      Linking.openURL(url || '').catch(() => {
        Alert.alert('Erro', 'Não foi possível abrir o aplicativo de mapas.');
      });
    } else {
      Alert.alert('Sem localização', 'Este estabelecimento não possui coordenadas.');
    }
  };

  const handleCompartilhar = async () => {
    if (prestador) {
      try {
        const mensagem = `Confira este local: ${prestador.nome} - Endereço: ${prestador.endereco}`;
        await Share.share({ message: mensagem });
      } catch {
        Alert.alert('Erro', 'Não foi possível compartilhar.');
      }
    }
  };
>>>>>>> feat/equipe-medica

  const equipeDaClinica = prestador
    ? (prestador.equipe ?? MEDICOS.filter(medico => medico.endereco === prestador.endereco))
    : [];

  if (!prestador) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Prestador não encontrado.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
<<<<<<< HEAD
      <Header prestador={prestador} />
      <PrestadorDetails prestador={prestador} />
=======
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <MaterialCommunityIcons name="arrow-left" size={24} color="#008584" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>{prestador.nome}</Text>
        <Text style={styles.address}>{prestador.endereco}</Text>
        <Text style={styles.specialty}>Especialidade: {prestador.especialidade}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLigar}>
            <MaterialCommunityIcons name="phone" size={24} color="#fff" />
            <Text style={styles.buttonText}>Ligar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleRotas}>
            <MaterialCommunityIcons name="map-marker" size={24} color="#fff" />
            <Text style={styles.buttonText}>Rotas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleCompartilhar}>
            <MaterialCommunityIcons name="share-variant" size={24} color="#fff" />
            <Text style={styles.buttonText}>Compartilhar</Text>
          </TouchableOpacity>
        </View>

        {prestador.tipo === 'clínica' && equipeDaClinica.length > 0 && (
          <View style={{ marginTop: 40 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Equipe médica:</Text>
            <FlatList
              data={equipeDaClinica}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={{ paddingVertical: 8 }}>
                  <Text style={{ fontSize: 16, color: '#333' }}>{item.nome}</Text>
                  <Text style={{ color: '#666' }}>{item.especialidade}</Text>
                </View>
              )}
            />
            <TouchableOpacity
              style={[styles.button, { marginTop: 20, alignSelf: 'center', paddingHorizontal: 24 }]}
              onPress={() => {
                router.push({
                  pathname: '(tabs)/guia-medico/equipe',
                  params: { endereco: prestador.endereco }
                });
              }}
            >
              <MaterialCommunityIcons name="account-group" size={24} color="#fff" />
              <Text style={styles.buttonText}>Ver Equipe Completa</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
>>>>>>> feat/equipe-medica
    </SafeAreaView>
  );
}

// --- COMPONENTES DE LAYOUT ---

<<<<<<< HEAD
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
=======
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  content: { flex: 1, justifyContent: 'center', padding: 20 },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    elevation: 3,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 8 },
  address: { fontSize: 18, color: '#666', textAlign: 'center', marginBottom: 10 },
  specialty: {
    fontSize: 16,
    color: '#008584',
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#008584',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
>>>>>>> feat/equipe-medica
