import { useAppointments } from '@/contexts/AppointmentsContext';
import { combinarDiaHora, formatarDataBanco, somarMinutos } from '@/src/database/datas';
import {
  ConflitoHorarioError,
  listarHorariosOcupados,
} from '@/src/database/repositories/agendamentoRepository';
import { buscarMedico, Medico } from '@/src/database/repositories/prestadorRepository';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const HORARIOS = ['09:00', '09:30', '10:00', '11:30', '14:00', '15:30'];
const DURACAO_MINUTOS = 30;
const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// Próximos dias úteis (segunda a sábado), a partir de amanhã.
function proximosDias(quantidade: number): Date[] {
  const dias: Date[] = [];
  const dia = new Date();
  dia.setHours(0, 0, 0, 0);
  while (dias.length < quantidade) {
    dia.setDate(dia.getDate() + 1);
    if (dia.getDay() !== 0) dias.push(new Date(dia));
  }
  return dias;
}

export default function AgendarConsultaScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const { medicoId } = useLocalSearchParams<{ medicoId: string }>();
  const { addAppointment } = useAppointments();

  const [medico, setMedico] = useState<Medico | null>(null);
  const [loading, setLoading] = useState(true);
  const dias = useMemo(() => proximosDias(6), []);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [ocupados, setOcupados] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    buscarMedico(db, Number(medicoId))
      .then(setMedico)
      .finally(() => setLoading(false));
  }, [db, medicoId]);

  // Ao trocar de dia, busca os horários já ocupados do profissional.
  useEffect(() => {
    if (!selectedDay || !medico) return;
    listarHorariosOcupados(db, medico.id, formatarDataBanco(selectedDay).slice(0, 10)).then(setOcupados);
  }, [db, medico, selectedDay]);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  if (!medico) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Médico não encontrado.</Text>
      </SafeAreaView>
    );
  }

  const handleConfirm = async () => {
    if (!selectedDay || !selectedTime) {
      Alert.alert("Atenção", "Por favor, selecione um dia e um horário.");
      return;
    }
    const inicio = combinarDiaHora(selectedDay, selectedTime);
    setSalvando(true);
    try {
      await addAppointment({
        prestador: medico.id,
        estabelecimento: medico.idEstabelecimento,
        tipo: medico.tipoEstabelecimento === 'laboratorio' ? 'exame' : 'consulta',
        inicio: formatarDataBanco(inicio),
        fim: formatarDataBanco(somarMinutos(inicio, DURACAO_MINUTOS)),
        observacoes: notes.trim() || null,
      });
      Alert.alert(
        "Agendamento concluído!",
        `O seu atendimento com ${medico.nome} foi marcado com sucesso.`,
        [{ text: "OK", onPress: () => router.navigate('/Agenda') }]
      );
    } catch (erro) {
      if (erro instanceof ConflitoHorarioError) {
        Alert.alert("Horário indisponível", erro.message);
        setSelectedTime(null);
        listarHorariosOcupados(db, medico.id, formatarDataBanco(selectedDay).slice(0, 10)).then(setOcupados);
      } else {
        Alert.alert("Erro", "Não foi possível salvar o agendamento. Tente novamente.");
      }
    } finally {
      setSalvando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.doctorName}>{medico.nome}</Text>
          <Text style={styles.doctorSpecialty}>{medico.especialidade}</Text>
          {medico.estabelecimento && <Text style={styles.doctorSpecialty}>{medico.estabelecimento}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecione o dia</Text>
          <View style={styles.grid}>
            {dias.map(dia => {
              const selecionado = selectedDay?.getTime() === dia.getTime();
              return (
                <TouchableOpacity
                  key={dia.toISOString()}
                  style={[styles.gridItem, selecionado && styles.gridItemSelected]}
                  onPress={() => { setSelectedDay(dia); setSelectedTime(null); }}
                >
                  <Text style={[styles.dayLabel, selecionado && styles.gridItemSelectedText]}>{DIAS_SEMANA[dia.getDay()]}</Text>
                  <Text style={[styles.gridItemText, selecionado && styles.gridItemSelectedText]}>{dia.getDate()}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {selectedDay && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selecione o horário</Text>
            <View style={styles.grid}>
              {HORARIOS.map(time => {
                const ocupado = ocupados.includes(time);
                return (
                  <TouchableOpacity
                    key={time}
                    disabled={ocupado}
                    style={[styles.gridItem, styles.timeItem, selectedTime === time && styles.gridItemSelected, ocupado && styles.gridItemDisabled]}
                    onPress={() => setSelectedTime(time)}
                  >
                    <Text style={[styles.gridItemText, selectedTime === time && styles.gridItemSelectedText, ocupado && styles.gridItemDisabledText]}>{time}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações adicionais (opcional)</Text>
            <TextInput
                style={styles.notesInput}
                placeholder="Ex: motivo da consulta, sintomas..."
                multiline
                value={notes}
                onChangeText={setNotes}
            />
        </View>
      </ScrollView>

       <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} disabled={salvando}>
            <Text style={styles.confirmButtonText}>{salvando ? 'Salvando...' : 'Confirmar Agendamento'}</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: { alignItems: 'center', padding: 20, backgroundColor: '#fff' },
    doctorImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
    doctorName: { fontSize: 22, fontWeight: 'bold' },
    doctorSpecialty: { fontSize: 16, color: '#6c757d' },
    section: { padding: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
    gridItem: {
        width: 60, height: 60, borderRadius: 30, backgroundColor: '#e9ecef',
        justifyContent: 'center', alignItems: 'center', margin: 7,
    },
    timeItem: { width: 90, borderRadius: 8 },
    gridItemSelected: { backgroundColor: '#00A896' },
    gridItemText: { fontSize: 16, fontWeight: 'bold' },
    gridItemSelectedText: { color: '#fff' },
    gridItemDisabled: { backgroundColor: '#f1f3f5' },
    gridItemDisabledText: { color: '#bbb', textDecorationLine: 'line-through' },
    dayLabel: { fontSize: 11, color: '#555' },
    notesInput: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ced4da',
        borderRadius: 8,
        padding: 15,
        minHeight: 100,
        textAlignVertical: 'top',
        fontSize: 16,
    },
    confirmButton: {
        backgroundColor: '#00A896',
        padding: 20,
        margin: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});