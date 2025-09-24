import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const Profile = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text>Nome: João da Silva</Text>
      <Text>Email: joao.silva@gmail.com</Text>
      <Button title="Editar Perfil" onPress={() => console.log('Editar perfil')} />
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

export default Profile;