import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Componente reutilizável para cada campo do filtro
const FilterInput = ({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress: () => void;
}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TouchableOpacity style={styles.input} onPress={onPress}>
      <Text style={styles.inputText}>{value}</Text>
      <Ionicons name="chevron-down" size={24} color="#888" />
    </TouchableOpacity>
  </View>
);

export default function GuiaMedicoFiltroScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Estados locais dos filtros
  const [plano, setPlano] = useState('Todos');
  const [regiao, setRegiao] = useState('Serra');
  const [prestador, setPrestador] = useState('Todos');
  const [especialidade, setEspecialidade] = useState('Todas');

  // Atualiza apenas os filtros que forem recebidos nos parâmetros
  useEffect(() => {
    if ('prestadorSelecionado' in params && params.prestadorSelecionado) {
      const valor = Array.isArray(params.prestadorSelecionado)
        ? params.prestadorSelecionado[0]
        : params.prestadorSelecionado;
      setPrestador(valor);
    }

    if ('especialidadeSelecionada' in params && params.especialidadeSelecionada) {
      const valor = Array.isArray(params.especialidadeSelecionada)
        ? params.especialidadeSelecionada[0]
        : params.especialidadeSelecionada;
      setEspecialidade(valor);
    }
  }, [params]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <FilterInput label="Plano" value={plano} onPress={() => alert('Abrir seleção de Planos')} />
        <FilterInput label="Região" value={regiao} onPress={() => alert('Abrir seleção de Região')} />

        {/* Agora mantém os valores anteriores ao navegar */}
        <FilterInput label="Prestador" value={prestador} onPress={() => router.push('/guia-medico/prestadores')} />
        <FilterInput label="Especialidade" value={especialidade} onPress={() => router.push('/guia-medico/especialidades')} />

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
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20 },
  inputContainer: { marginBottom: 15 },
  label: { fontSize: 14, color: '#555', marginBottom: 8, paddingLeft: 4 },
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
  inputText: { fontSize: 16, color: '#333' },
  searchButton: {
    backgroundColor: '#00A896',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 25,
  },
  searchButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
