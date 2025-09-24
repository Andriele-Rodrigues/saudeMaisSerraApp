import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

// Mock data para a agenda
const appointments = [
  { id: 1, date: '2025-09-25', description: 'Consulta médica com Dr. João' },
  { id: 2, date: '2025-09-26', description: 'Exame de sangue no laboratório' },
  { id: 3, date: '2025-09-27', description: 'Consulta de retorno com Dr. Maria' },
];

const Agenda = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#008584" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Agenda</Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.agendaText}>Seus compromissos:</Text>

          {appointments.map((appointment) => (
            <View key={appointment.id} style={styles.appointmentCard}>
              <Text style={styles.appointmentDate}>{appointment.date}</Text>
              <Text style={styles.appointmentDescription}>{appointment.description}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E0F2F1',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#008584',
    paddingTop: 20,
    paddingBottom: 60,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  body: {
    marginTop: -40,
    paddingHorizontal: 20,
  },
  agendaText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  appointmentCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  appointmentDescription: {
    fontSize: 14,
    marginTop: 5,
    color: '#555',
  },
});

export default Agenda;