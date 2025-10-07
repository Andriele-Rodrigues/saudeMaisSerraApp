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

function DetalhesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params;

  const [prestador, setPrestador] = useState<Prestador | null>(null);

  useEffect(() => {
    if (id) {
      const found = PRESTADORES.find(p => p.id === id);
      setPrestador(found || null);
    }
  }, [id]);

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

  const equipeDaClinica = prestador
    ? (prestador.equipe ?? MEDICOS.filter(medico => medico.endereco === prestador.endereco))
    : [];

  if (!prestador) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
}

export default DetalhesScreen;

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
