import { PRESTADORES } from '@/app/data/mockData';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const DetailButton = ({ icon, label }: { icon: any; label: string }) => (
  <TouchableOpacity style={styles.actionButton}>
    <Ionicons name={icon} size={26} color="#00A896" />
    <Text style={styles.actionButtonText}>{label}</Text>
  </TouchableOpacity>
);

export default function DetalhesScreen() {
  const { id } = useLocalSearchParams();
  const provider = PRESTADORES.find((p) => p.id === id);

  if (!provider) {
    return (
      <View style={styles.container}>
        <Text>Prestador não encontrado.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: provider.coords.latitude,
          longitude: provider.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={provider.coords} title={provider.nome} />
      </MapView>

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{provider.nome}</Text>
        <Text style={styles.subtitle}>{provider.especialidade}</Text>
      </View>

      <View style={styles.actionsContainer}>
        <DetailButton icon="call-outline" label="Ligar" />
        <DetailButton icon="bookmark-outline" label="Salvar" />
        <DetailButton icon="calendar-outline" label="Agenda" />
        <DetailButton icon="people-outline" label="Equipe" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { width: '100%', height: '40%' },
  infoContainer: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 4 },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: { alignItems: 'center' },
  actionButtonText: { fontSize: 14, color: '#00A896', marginTop: 5 },
});