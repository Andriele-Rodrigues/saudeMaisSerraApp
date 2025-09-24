import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const VaccineCard = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carteira de Vacinas</Text>
      <Text>Vacina 1: Covid-19</Text>
      <Text>Vacina 2: Influenza</Text>
      <Text>Vacina 3: Hepatite B</Text>
      
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default VaccineCard;