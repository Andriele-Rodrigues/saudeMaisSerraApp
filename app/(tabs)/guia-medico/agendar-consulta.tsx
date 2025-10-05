
import { MEDICOS } from '@/app/api/mockData';
import { useAppointments } from '@/contexts/AppointmentsContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';



// Dados de exemplo, substitua por sua lógica real se necessário
const AVAILABLE_DAYS = ['20', '21', '24', '25', '26'];
const AVAILABLE_TIMES = ['09:00', '09:30', '10:00', '11:30', '14:00', '15:30'];

export default function AgendarConsultaScreen() {
  const router = useRouter();
  const { medicoId } = useLocalSearchParams();
  const medico = MEDICOS.find(m => m.id === medicoId);
  
  const { addAppointment } = useAppointments();

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  if (!medico) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Médico não encontrado.</Text>
      </SafeAreaView>
    );
  }
  
  const handleConfirm = () => {
      if (!selectedDay || !selectedTime) {
          Alert.alert("Erro", "Por favor, selecione um dia e um horário.");
          return;
      }
      
      const newAppointment = {
        doctor: medico.nome,
        // --- CORREÇÃO APLICADA AQUI ---
        // Pegamos a primeira especialidade da lista para corresponder ao tipo esperado.
        specialty: medico.especialidades[0], 
        date: `${selectedDay}/10/2025`,
        time: selectedTime,
        address: medico.endereco,
        phone: medico.telefone,
        clinicName: medico.endereco ? 'Consultório Particular' : 'Clínica/Hospital',
      };

      addAppointment(newAppointment);

      Alert.alert(
          "Agendamento Concluído!",
          `A sua consulta com ${medico.nome} foi marcada com sucesso.`,
          [{ text: "OK", onPress: () => router.navigate('/') }]
      );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image source={{ uri: medico.foto }} style={styles.doctorImage} />
          <Text style={styles.doctorName}>{medico.nome}</Text>
          <Text style={styles.doctorSpecialty}>{medico.especialidades.join(' / ')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecione o Dia (Outubro 2025)</Text>
          <View style={styles.grid}>
            {AVAILABLE_DAYS.map(day => (
              <TouchableOpacity
                key={day}
                style={[styles.gridItem, selectedDay === day && styles.gridItemSelected]}
                onPress={() => setSelectedDay(day)}
              >
                <Text style={[styles.gridItemText, selectedDay === day && styles.gridItemSelectedText]}>{day}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {selectedDay && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selecione o Horário</Text>
            <View style={styles.grid}>
              {AVAILABLE_TIMES.map(time => (
                <TouchableOpacity
                  key={time}
                  style={[styles.gridItem, styles.timeItem, selectedTime === time && styles.gridItemSelected]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={[styles.gridItemText, selectedTime === time && styles.gridItemSelectedText]}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Adicionais (Opcional)</Text>
            <TextInput
                style={styles.notesInput}
                placeholder="Ex: motivo da consulta, sintomas..."
                multiline
                value={notes}
                onChangeText={setNotes}
            />
        </View>
      </ScrollView>

       <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Confirmar Agendamento</Text>
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