import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotificacoesScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Notificações' }} />

      <Text style={styles.title}>Tela de Notificações</Text>
      <Text style={styles.subtitle}>Avisos e lembretes importantes aparecerão aqui.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
