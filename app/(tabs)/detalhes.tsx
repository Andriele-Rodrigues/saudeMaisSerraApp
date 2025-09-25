import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DetalhesScreen = ({ route, navigation } : {route: any, navigation: any}) => {
  const { name, specialty } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <Text>{specialty}</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Agendar Consulta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E0F2F1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008584',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#00A9A5',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DetalhesScreen;