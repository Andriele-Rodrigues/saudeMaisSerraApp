import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function FavoritosScreen() {
  return (
    <View style={styles.container}>
      {/* Configura o título do cabeçalho da tela */}
      <Stack.Screen options={{ title: 'Meus Favoritos' }} />

      <Text style={styles.title}>Tela de Favoritos</Text>
      <Text style={styles.subtitle}>Aqui você poderá ver seus médicos e clínicas salvos.</Text>
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