import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

interface Establishment {
  id_estabelecimento: number;
  nome_fantasia: string;
  endereco: string;
}

interface EstablishmentsProps {
  serviceTypeId: number;
  setSelectedEstablishment: React.Dispatch<React.SetStateAction<number | null>>;
}

const Establishments: React.FC<EstablishmentsProps> = ({ serviceTypeId, setSelectedEstablishment }) => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const baseUrl = `http://localhost:3000/estabelecimentos/${serviceTypeId}`; // Para emulador Android
    // Para dispositivos físicos, substitua pelo IP da sua máquina:
    // const baseUrl = `http://10.0.12.8:3000/estabelecimentos/${serviceTypeId}`; 

    axios.get(baseUrl)
      .then((response) => setEstablishments(response.data))
      .catch((err) => {
        setError('Error fetching establishments');
        console.error('Error fetching establishments:', err);
      });
  }, [serviceTypeId]);

  return (
    <ScrollView>
      <Text style={styles.title}>Estabelecimentos</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {establishments.map((establishment) => (
        <View key={establishment.id_estabelecimento} style={styles.card}>
          <Text style={styles.cardTitle}>{establishment.nome_fantasia}</Text>
          <Text style={styles.cardDescription}>{establishment.endereco}</Text>
          <Button
            title="Agendar Consulta"
            onPress={() => setSelectedEstablishment(establishment.id_estabelecimento)}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 14,
    marginVertical: 8,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default Establishments;