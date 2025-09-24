import axios from 'axios';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

interface BookingProps {
  establishmentId: number;
}

const Booking: React.FC<BookingProps> = ({ establishmentId }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = () => {
    const bookingData = {
      id_paciente: '12345',
      id_prestador: '1',
      id_estabelecimento: establishmentId,
      inicio: `${date}T${time}:00`,
      fim: `${date}T${time}:30`,
      status: 'agendado',
      observacoes: '',
    };

    const baseUrl = 'http://localhost::3000/agendamentos'; // Para emulador Android
    // Para dispositivos físicos, substitua pelo IP da sua máquina:
    // const baseUrl = 'http://10.0.12.8:3000/agendamentos'; 

    axios.post(baseUrl, bookingData)
      .then((response) => {
        alert('Agendamento confirmado!');
      })
      .catch((error) => {
        console.error('Erro ao criar agendamento:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agendar Consulta</Text>
      <TextInput
        style={styles.input}
        placeholder="Data (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Hora (HH:MM)"
        value={time}
        onChangeText={setTime}
      />
      <Button title="Confirmar Agendamento" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
});

export default Booking;