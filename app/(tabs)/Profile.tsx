import { buscarPaciente, ID_PACIENTE_PADRAO, Paciente } from '@/src/database/repositories/pacienteRepository';
import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MenuButton = ({ icon, label, href }: { icon: keyof typeof Ionicons.glyphMap; label: string; href: Href }) => {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.menuButton} onPress={() => router.push(href)}>
      <Ionicons name={icon} size={24} color="#008584" />
      <Text style={styles.menuText}>{label}</Text>
      <Ionicons name="chevron-forward" size={22} color="#ccc" />
    </TouchableOpacity>
  );
};

export default function ProfileScreen() {
  const db = useSQLiteContext();
  const [paciente, setPaciente] = useState<Paciente | null>(null);

  useEffect(() => {
    buscarPaciente(db, ID_PACIENTE_PADRAO).then(setPaciente);
  }, [db]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Ionicons name="person-circle-outline" size={80} color="#008584" />
          <Text style={styles.name}>{paciente?.nome ?? ''}</Text>
          <Text style={styles.email}>{paciente?.email ?? ''}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Cidade</Text>
          <Text style={styles.infoValue}>{paciente?.cidade ?? 'Não informada'}</Text>
        </View>

        <MenuButton icon="bookmark-outline" label="Meus favoritos" href="/favoritos" />
        <MenuButton icon="bar-chart-outline" label="Painel de indicadores" href="/indicadores" />
        <MenuButton icon="people-outline" label="Equipe do projeto" href="/equipe-projeto" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  header: { alignItems: 'center', padding: 30, backgroundColor: '#fff', marginBottom: 10 },
  name: { fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  email: { fontSize: 16, color: '#777' },
  infoCard: {
    backgroundColor: '#fff', padding: 20, marginHorizontal: 20,
    borderRadius: 8, marginBottom: 10,
  },
  infoTitle: { fontSize: 14, color: '#888' },
  infoValue: { fontSize: 18, fontWeight: '500', marginTop: 5 },
  menuButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    padding: 18, marginHorizontal: 20, borderRadius: 8, marginBottom: 10,
  },
  menuText: { flex: 1, fontSize: 16, marginLeft: 12, color: '#333' },
});
