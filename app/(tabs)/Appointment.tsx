import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

const Appointment = ({ navigation }: any) => {
  const [appointment, setAppointment] = useState('');

  const handleSaveAppointment = () => {
    console.log('Agendamento salvo:', appointment);
    // Aqui você pode salvar a consulta ou fazer algum processamento
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agendamentos</Text>
      <TextInput 
        placeholder="Digite o motivo da consulta" 
        value={appointment}
        onChangeText={setAppointment}
        style={styles.input}
      />
      <Button title="Salvar Agendamento" onPress={handleSaveAppointment} />
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    width: '100%',
  },
});

export default Appointment;