import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function GuiaMedicoScreen() {
  return (
    <View style={styles.container}>
       {/* O Stack.Screen aqui permite que essa tela tenha seu próprio cabeçalho */}
      <Stack.Screen options={{ title: 'Guia Médico' }} />
      <Text style={styles.title}>Tela do Guia Médico</Text>
      <Text>A partir daqui, você pode construir o fluxo de especialidades.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
});