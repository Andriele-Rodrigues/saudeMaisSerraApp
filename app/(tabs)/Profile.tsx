import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={80} color="#008584" />
        <Text style={styles.name}>Nome do Usuário</Text>
        <Text style={styles.email}>usuario@email.com</Text>
      </View>
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Plano</Text>
        <Text style={styles.infoValue}>Unimed Serra</Text>
      </View>
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Número da Carteirinha</Text>
        <Text style={styles.infoValue}>001.2345.6789-00</Text>
      </View>
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
});