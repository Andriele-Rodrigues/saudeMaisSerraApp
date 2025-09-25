import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function MedicacaoScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Medicação' }} />
      <Text style={styles.title}>Tela de Medicação</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold' },
});