import { useAppointments } from '@/contexts/AppointmentsContext';
import { separarDataBanco } from '@/src/database/datas';
import { registrarAvaliacao } from '@/src/database/repositories/avaliacaoRepository';
import { ID_PACIENTE_PADRAO } from '@/src/database/repositories/pacienteRepository';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AvaliarScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { appointments, reload } = useAppointments();
  const agendamento = appointments.find(a => a.id === Number(id));

  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [salvando, setSalvando] = useState(false);

  if (!agendamento) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.vazio}>Agendamento não encontrado.</Text>
      </SafeAreaView>
    );
  }

  const { data, hora } = separarDataBanco(agendamento.inicio);

  const handleSalvar = async () => {
    if (nota < 1) {
      Alert.alert('Atenção', 'Escolha uma nota de 1 a 5 estrelas.');
      return;
    }
    setSalvando(true);
    try {
      await registrarAvaliacao(db, {
        agendamento: agendamento.id,
        paciente: ID_PACIENTE_PADRAO,
        nota,
        comentario: comentario.trim() || null,
      });
      await reload();
      Alert.alert('Obrigado!', 'Sua avaliação foi registrada.', [{ text: 'OK', onPress: () => router.back() }]);
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a avaliação. Este atendimento talvez já tenha sido avaliado.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Avaliar atendimento</Text>
        <View style={styles.headerIcon} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.medico}>{agendamento.medico}</Text>
          <Text style={styles.info}>{agendamento.especialidade}</Text>
          {agendamento.estabelecimento && <Text style={styles.info}>{agendamento.estabelecimento}</Text>}
          <Text style={styles.info}>{data} às {hora}</Text>
        </View>

        <Text style={styles.label}>Sua nota</Text>
        <View style={styles.estrelas}>
          {[1, 2, 3, 4, 5].map(n => (
            <TouchableOpacity key={n} onPress={() => setNota(n)} accessibilityLabel={`Nota ${n}`}>
              <Ionicons name={n <= nota ? 'star' : 'star-outline'} size={44} color="#FFC107" />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Comentário (opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Conte como foi o atendimento"
          multiline
          value={comentario}
          onChangeText={setComentario}
        />

        <TouchableOpacity style={styles.botao} onPress={handleSalvar} disabled={salvando}>
          <Text style={styles.botaoTexto}>{salvando ? 'Salvando...' : 'Enviar avaliação'}</Text>
        </TouchableOpacity>
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
  vazio: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#888' },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 20 },
  medico: { fontSize: 18, fontWeight: 'bold', color: '#005A59' },
  info: { fontSize: 14, color: '#555', marginTop: 4 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 10 },
  estrelas: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ced4da', borderRadius: 8,
    padding: 15, minHeight: 100, textAlignVertical: 'top', fontSize: 16,
  },
  botao: { backgroundColor: '#00A896', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 24 },
  botaoTexto: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
