import { PRESTADORES } from '@/app/(tabs)/api/mockData';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Linking, Platform, SafeAreaView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// A interface agora inclui as coordenadas (coords)
interface Prestador {
  id: string;
  nome: string;
  endereco: string;
  especialidade: string;
  telefone?: string;
  coords?: { latitude: number; longitude: number };
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

  // Função para ligar (já implementada)
  const handleLigar = () => {
    if (prestador?.telefone) {
      const phoneNumberUrl = `tel:${prestador.telefone}`;
      Linking.openURL(phoneNumberUrl).catch(() => {
        Alert.alert('Erro', 'Não foi possível abrir o discador.');
      });
    } else {
      Alert.alert('Sem telefone', 'Este estabelecimento não possui um número de telefone cadastrado.');
    }
  };

  // --- NOVA FUNÇÃO PARA ABRIR ROTAS ---
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

      if (url) {
        Linking.openURL(url).catch(() => {
          Alert.alert('Erro', 'Não foi possível abrir o aplicativo de mapas.');
        });
      }
    } else {
      Alert.alert('Sem localização', 'Este estabelecimento não possui coordenadas para traçar uma rota.');
    }
  };

  // --- NOVA FUNÇÃO PARA COMPARTILHAR ---
  const handleCompartilhar = async () => {
    if (prestador) {
      try {
        const mensagem = `Confira este local: ${prestador.nome} - Endereço: ${prestador.endereco}`;
        await Share.share({
          message: mensagem,
        });
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível compartilhar as informações.');
      }
    }
  };

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
        <Icon name="arrow-left" size={24} color="#008584" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>{prestador.nome}</Text>
        <Text style={styles.address}>{prestador.endereco}</Text>
        <Text style={styles.specialty}>Especialidade: {prestador.especialidade}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLigar}>
            <Icon name="phone" size={24} color="#fff" />
            <Text style={styles.buttonText}>Ligar</Text>
          </TouchableOpacity>

          {/* Botão "Rotas" agora chama a função handleRotas */}
          <TouchableOpacity style={styles.button} onPress={handleRotas}>
            <Icon name="map-marker" size={24} color="#fff" />
            <Text style={styles.buttonText}>Rotas</Text>
          </TouchableOpacity>

          {/* Botão "Compartilhar" agora chama a função handleCompartilhar */}
          <TouchableOpacity style={styles.button} onPress={handleCompartilhar}>
            <Icon name="share-variant" size={24} color="#fff" />
            <Text style={styles.buttonText}>Compartilhar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default DetalhesScreen;

// Estilos da tela (sem alterações)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
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
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 8,
    },
    address: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 10,
    },
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