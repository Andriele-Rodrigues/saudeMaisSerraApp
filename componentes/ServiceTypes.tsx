import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

interface ServiceType {
  id_tipo: number;
  nome: string;
  descricao: string;
}

interface ServiceTypesProps {
  setSelectedServiceType: React.Dispatch<React.SetStateAction<number | null>>;
}

const ServiceTypes: React.FC<ServiceTypesProps> = ({ setSelectedServiceType }) => {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
     const baseUrl = 'http://localhost:3000/tipos-servicos'; // Use para o emulador Android

    // Se estiver em dispositivo físico, substitua 'localhost' pelo IP da sua máquina:
    // const baseUrl = 'http://10.0.12.8:3000/tipos-servicos'; // Use para dispositivos físicos

    axios.get(baseUrl)
      .then((response) => setServiceTypes(response.data))
      .catch((err) => {
        setError('Error fetching service types');
        console.error('Error fetching service types:', err);
      });
  }, []);

  return (
    <ScrollView>
      <Text style={styles.title}>Tipos de Serviço</Text>
      {serviceTypes.map((service) => (
        <View key={service.id_tipo} style={styles.card}>
          <Text style={styles.cardTitle}>{service.nome}</Text>
          <Text style={styles.cardDescription}>{service.descricao}</Text>
          <Button
            title="Ver Estabelecimentos"
            onPress={() => setSelectedServiceType(service.id_tipo)}
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
});

export default ServiceTypes;