import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Componente reutilizável para cada campo do filtro
const FilterInput = ({ label, value, onPress }: { label: string; value: string; onPress: () => void }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TouchableOpacity style={styles.input} onPress={onPress}>
      <Text style={styles.inputText}>{value}</Text>
      <Ionicons name="chevron-down" size={24} color="#888" />
    </TouchableOpacity>
  </View>
);

export default function GuiaMedicoFiltroScreen() {
  // Estados para guardar os valores selecionados nos filtros
  const [plano, setPlano] = useState('Todos');
  const [regiao, setRegiao] = useState('Serra');
  const [especialidade, setEspecialidade] = useState('Raio X');

  // Em um app real, ao clicar em um filtro, você abriria um Modal com as opções
  const handleSelectPlano = () => alert('Abriria seleção de Planos');
  const handleSelectRegiao = () => alert('Abriria seleção de Região');
  const handleSelectEspecialidade = () => alert('Abriria seleção de Especialidade');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <FilterInput label="Plano" value={plano} onPress={handleSelectPlano} />
        <FilterInput label="Região" value={regiao} onPress={handleSelectRegiao} />
        <FilterInput label="Prestador" value="Todos" onPress={() => {}} />
        <FilterInput label="Especialidade" value={especialidade} onPress={handleSelectEspecialidade} />

        {/* O Link navega para a tela de resultados, passando os filtros como parâmetros */}
        <Link
          href={{
            pathname: '/guia-medico/resultados',
            params: { plano, regiao, especialidade },
          }}
          asChild
        >
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Pesquisar</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputText: {
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#00A896',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});