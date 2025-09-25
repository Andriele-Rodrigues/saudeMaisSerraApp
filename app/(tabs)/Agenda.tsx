import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const appointments = [
  { id: '1', doctor: 'Dra. Ana Souza', time: 'Amanhã, 10:30', specialty: 'Cardiologia' },
  { id: '2', doctor: 'Dr. Carlos Silva', time: '28/09, 15:00', specialty: 'Clínico Geral' },
];

export default function AgendaScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Meus Agendamentos</Text>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.specialty}</Text>
            <Text style={styles.cardText}>Com: {item.doctor}</Text>
            <Text style={styles.cardTime}>{item.time}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  header: { fontSize: 24, fontWeight: 'bold', padding: 20 },
  card: {
    backgroundColor: '#fff', padding: 15, marginHorizontal: 20,
    marginBottom: 10, borderRadius: 8, elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardText: { fontSize: 16, color: '#555', marginTop: 5 },
  cardTime: { fontSize: 16, color: '#00A896', fontWeight: 'bold', marginTop: 10 },
});