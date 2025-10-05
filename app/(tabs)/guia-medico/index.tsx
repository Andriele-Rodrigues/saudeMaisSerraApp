import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
  const router = useRouter(); // Hook para navegar
  const params = useLocalSearchParams(); // Hook para receber dados de volta

  // Estados para guardar os valores selecionados
  const [plano, setPlano] = useState('Todos');
  const [regiao, setRegiao] = useState('Serra');
  const [prestador, setPrestador] = useState('Todos');
  const [especialidade, setEspecialidade] = useState('Todas');

  // Este "efeito" escuta as mudanças nos parâmetros da rota.
  // Quando um valor é selecionado e você volta, ele atualiza o campo.
  useEffect(() => {
    const prestadorParam = params.prestadorSelecionado;
    if (typeof prestadorParam === 'string') {
      setPrestador(prestadorParam);
    } else if (Array.isArray(prestadorParam)) {
      setPrestador(prestadorParam[0]);
    }

    const especialidadeParam = params.especialidadeSelecionada;
    if (typeof especialidadeParam === 'string') {
      setEspecialidade(especialidadeParam);
    } else if (Array.isArray(especialidadeParam)) {
      setEspecialidade(especialidadeParam[0]);
    }
  }, [params]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <FilterInput label="Plano" value={plano} onPress={() => alert('Abrir seleção de Planos')} />
        <FilterInput label="Região" value={regiao} onPress={() => alert('Abrir seleção de Região')} />
        
        {/* Passamos os outros filtros como parâmetros para que não se percam */}
        <FilterInput 
          label="Prestador" 
          value={prestador} 
          onPress={() => router.push({
            pathname: '/guia-medico/selecionar-prestador',
            params: { especialidadeAtual: especialidade },
          })}
        />
        <FilterInput 
          label="Especialidade" 
          value={especialidade} 
          onPress={() => router.push({
            pathname: '/guia-medico/selecionar-especialidade',
            params: { prestadorAtual: prestador },
          })}
        />

        <Link
          href={{
            pathname: '/guia-medico/resultados',
            params: { plano, regiao, prestador, especialidade },
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
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    paddingLeft: 4,
  },
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#00A896',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 25,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});