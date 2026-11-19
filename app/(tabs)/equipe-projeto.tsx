import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const INTEGRANTES = [
  'Andriele Rodrigues',
  'Bruno Kunzler Borges',
  'Felipe Vicentini',
  'Jeferson Rodrigues Duarte',
  'Matheus Feijó Barp',
];

export default function EquipeProjetoScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Equipe do projeto</Text>
        <View style={styles.headerIcon} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitulo}>Projeto Integrador VI-B — UCS — 2026/2</Text>
        {INTEGRANTES.map(nome => (
          <View key={nome} style={styles.card}>
            <Ionicons name="person-outline" size={22} color="#008584" />
            <Text style={styles.nome}>{nome}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 15, paddingVertical: 10, backgroundColor: '#fff', elevation: 2,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  headerIcon: { width: 40 },
  content: { padding: 20 },
  subtitulo: { fontSize: 15, color: '#555', textAlign: 'center', marginBottom: 20 },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    padding: 16, borderRadius: 10, marginBottom: 12, elevation: 2,
  },
  nome: { fontSize: 17, marginLeft: 12, color: '#333', fontWeight: '500' },
});
