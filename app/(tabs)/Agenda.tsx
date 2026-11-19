import { useAppointments } from '@/contexts/AppointmentsContext';
import { separarDataBanco } from '@/src/database/datas';
import type { Agendamento, StatusAgendamento } from '@/src/database/repositories/agendamentoRepository';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Modal,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const ROTULO_STATUS: Record<StatusAgendamento, string> = {
  agendado: 'Agendado',
  realizado: 'Realizado',
  cancelado: 'Cancelado',
  faltou: 'Não compareceu',
};

const COR_STATUS: Record<StatusAgendamento, string> = {
  agendado: '#008584',
  realizado: '#2E7D32',
  cancelado: '#E74C3C',
  faltou: '#F39C12',
};

export default function AgendaScreen() {
  const { appointments, loading, cancelAppointment } = useAppointments();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Agendamento | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Futuros: ainda agendados. Histórico: realizados, cancelados e faltas (mais recentes primeiro).
  const futuros = appointments.filter(a => a.status === 'agendado');
  const historico = appointments.filter(a => a.status !== 'agendado').reverse();
  const sections = [
    { title: 'Próximos agendamentos', data: futuros },
    { title: 'Realizados e cancelados', data: historico },
  ];

  const handleOpenModal = (appointment: Agendamento) => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedAppointment(null);
    setCancelReason('');
  };

  const handleConfirmCancel = async () => {
    if (!cancelReason.trim()) {
      Alert.alert('Atenção', 'Por favor, informe o motivo do cancelamento.');
      return;
    }
    if (selectedAppointment) {
      await cancelAppointment(selectedAppointment.id, cancelReason.trim());
    }
    handleCloseModal();
    Alert.alert('Sucesso', 'Agendamento cancelado com sucesso!');
  };

  const renderAppointmentCard = ({ item }: { item: Agendamento }) => {
    const { data, hora } = separarDataBanco(item.inicio);
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.especialidade}</Text>
          {item.status === 'agendado' ? (
            <TouchableOpacity onPress={() => handleOpenModal(item)} accessibilityLabel="Cancelar agendamento">
              <Icon name="close-circle-outline" size={26} color="#E74C3C" />
            </TouchableOpacity>
          ) : (
            <Text style={[styles.status, { color: COR_STATUS[item.status] }]}>{ROTULO_STATUS[item.status]}</Text>
          )}
        </View>

        {item.estabelecimento && (
          <View style={styles.infoRow}>
            <Icon name="hospital-building" size={16} color="#555" />
            <Text style={styles.cardText}>{item.estabelecimento}</Text>
          </View>
        )}
        <View style={styles.infoRow}>
          <Icon name="doctor" size={16} color="#555" />
          <Text style={styles.cardText}>{item.medico}</Text>
        </View>
        {item.endereco && (
          <View style={styles.infoRow}>
            <Icon name="map-marker-outline" size={16} color="#555" />
            <Text style={styles.cardText}>{item.endereco}</Text>
          </View>
        )}
        {item.telefone && (
         <View style={styles.infoRow}>
          <Icon name="phone-outline" size={16} color="#555" />
          <Text style={styles.cardText}>{item.telefone}</Text>
        </View>
        )}

        <View style={styles.timeContainer}>
          <Icon name="calendar-clock" size={20} color="#008584" />
          <Text style={styles.cardTime}>{data} às {hora}</Text>
        </View>
      </View>
    );
  };

 return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <Icon name="arrow-left" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Agendamentos</Text>
        <View style={styles.headerIcon} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderAppointmentCard}
          renderSectionHeader={({ section }) => (
            <View>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.data.length === 0 && <Text style={styles.emptyText}>Nenhum agendamento.</Text>}
            </View>
          )}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tem certeza que deseja cancelar?</Text>
            <Text style={styles.modalSubtitle}>O horário volta a ficar disponível para outros pacientes.</Text>
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
  emptyText: { textAlign: 'center', marginTop: 10, fontSize: 15, color: '#888' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginHorizontal: 20, marginTop: 20 },
  status: { fontSize: 13, fontWeight: 'bold' },
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