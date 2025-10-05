
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppointments } from '../../contexts/AppointmentsContext';

// Define a estrutura de um agendamento para o TypeScript
type Appointment = {
  id: string;
  clinicName?: string;
  doctor: string;
  specialty: string;
  address?: string;
  phone?: string;
  date: string;
  time: string;
};

export default function AgendaScreen() {
  // Pega a lista de agendamentos e a função de remover do nosso estado global
  const { appointments, removeAppointment } = useAppointments();
  const router = useRouter();

  // Estados para controlar o modal de cancelamento
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Funções para abrir e fechar o modal
  const handleOpenModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedAppointment(null);
    setCancelReason('');
  };

  // --- LÓGICA CORRIGIDA AQUI ---
  const handleConfirmCancel = () => {
    // Valida se o motivo foi preenchido
    if (!cancelReason.trim()) {
      Alert.alert('Erro', 'Por favor, informe o motivo do cancelamento.');
      return;
    }

    // Remove o agendamento do estado global
    if (selectedAppointment) {
      removeAppointment(selectedAppointment.id);
    }

    // Fecha o modal ANTES de mostrar o alerta de sucesso
    handleCloseModal();
    Alert.alert('Sucesso', 'Agendamento cancelado com sucesso!');
  };

  // Componente para renderizar cada card de agendamento
  const renderAppointmentCard = ({ item }: { item: Appointment }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.specialty}</Text>
        <TouchableOpacity onPress={() => handleOpenModal(item)}>
          <Icon name="close-circle-outline" size={26} color="#E74C3C" />
        </TouchableOpacity>
      </View>
      {item.clinicName && (
        <View style={styles.infoRow}>
          <Icon name="hospital-building" size={16} color="#555" />
          <Text style={styles.cardText}>{item.clinicName}</Text>
        </View>
      )}
      <View style={styles.infoRow}>
        <Icon name="doctor" size={16} color="#555" />
        <Text style={styles.cardText}>{item.doctor}</Text>
      </View>
      {item.address && (
        <View style={styles.infoRow}>
          <Icon name="map-marker-outline" size={16} color="#555" />
          <Text style={styles.cardText}>{item.address}</Text>
        </View>
      )}
      {item.phone && (
       <View style={styles.infoRow}>
        <Icon name="phone-outline" size={16} color="#555" />
        <Text style={styles.cardText}>{item.phone}</Text>
      </View>
      )}
      <View style={styles.timeContainer}>
        <Icon name="calendar-clock" size={20} color="#008584" />
        <Text style={styles.cardTime}>{item.date} às {item.time}</Text>
      </View>
    </View>
  );

 return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho da tela */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <Icon name="arrow-left" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Agendamentos</Text>
        <TouchableOpacity onPress={() => Alert.alert('Busca', 'Funcionalidade de busca a ser implementada.')} style={styles.headerIcon}>
          <Icon name="magnify" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Lista de agendamentos */}
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={renderAppointmentCard}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum agendamento encontrado.</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Modal de Cancelamento */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tem certeza que deseja cancelar?</Text>
            <Text style={styles.modalSubtitle}>Esta ação não pode ser desfeita.</Text>
            <TextInput
              style={styles.input}
              placeholder="* Motivo do cancelamento"
              placeholderTextColor="#999"
              value={cancelReason}
              onChangeText={setCancelReason}
              multiline
            />
            <View style={styles.modalButtons}>
              <Button title="Voltar" onPress={handleCloseModal} color="#888" />
              <Button
                title="Confirmar Cancelamento"
                onPress={handleConfirmCancel}
                color="#E74C3C"
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerIcon: {
    padding: 5,
  },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#888' },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#005A59' },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  cardText: { fontSize: 14, color: '#555', marginLeft: 8, flexShrink: 1 },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cardTime: { fontSize: 16, color: '#008584', fontWeight: 'bold', marginLeft: 8 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  modalSubtitle: { fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center' },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});