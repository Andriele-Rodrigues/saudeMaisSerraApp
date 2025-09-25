import { StyleSheet, Text, View } from 'react-native';

export default function ExamesScreen() {
  // O título agora é definido automaticamente pelo nome do arquivo ou no _layout.tsx
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela de Exames</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold' },
});