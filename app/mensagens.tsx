import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function MensagensScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Mensagens' }} />

      <Text style={styles.title}>Tela de Mensagens</Text>
      <Text style={styles.subtitle}>Suas conversas e comunicados estarão nesta área.</Text>
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