import Booking from '@/componentes/Booking'; // Importando componente Booking
import Establishments from '@/componentes/Establishments'; // Importando componente Establishments
import ServiceTypes from '@/componentes/ServiceTypes'; // Importando componente ServiceTypes
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Componente para os botões de ação (Medicação, Exames, etc.)
const ActionButton = ({iconName, label, onPress}: {iconName: string; label: string; onPress: () => void}) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <Icon name={iconName} size={30} color="#008584" />
    <Text style={styles.actionButtonText}>{label}</Text>
  </TouchableOpacity>
);

// Componente para a barra de navegação inferior
const BottomNavBar = () => (
  <View style={styles.navBar}>
    <TouchableOpacity style={styles.navItem}>
      <Icon name="home" size={28} color="#008584" />
      <Text style={styles.navTextActive}>Início</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.navItem}>
      <Icon name="" size={28} color="#888" />
      <Text style={styles.navText}>Carteira</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.navItem}>
      <Icon name="calendar" size={28} color="#888" />
      <Text style={styles.navText}>Agenda</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.navItem}>
      <Icon name="account-circle-outline" size={28} color="#888" />
      <Text style={styles.navText}>Perfil</Text>
    </TouchableOpacity>
  </View>
);

const HomeScreen = () => {
  const [selectedServiceType, setSelectedServiceType] = useState<number | null>(null);
  const [selectedEstablishment, setSelectedEstablishment] = useState<number | null>(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#008584" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Saúde Mais Serra</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.searchContainer}>
            <Icon name="magnify" size={20} color="#888" style={styles.searchIcon} />
            <TextInput placeholder="Pesquisa" style={styles.searchInput} />
            <Icon name="close" size={20} color="#888" />
          </View>

          <TouchableOpacity style={styles.guideButton}>
            <Text style={styles.guideButtonText}>Guia Médico</Text>
          </TouchableOpacity>

          <View style={styles.actionGrid}>
            <ActionButton iconName="pill" label="Medicação" onPress={() => { /* Navegar para Medicação */ }} />
            <ActionButton iconName="clipboard-text-outline" label="Exames" onPress={() => { /* Navegar para Exames */ }} />
            <ActionButton iconName="human-wheelchair" label="Sintomas" onPress={() => { /* Navegar para Sintomas */ }} />
          </View>

          <View style={styles.bannerContainer}>
            {/* Carregar banner aqui */}
          </View>

          <View style={styles.actionGrid}>
            <ActionButton iconName="star-outline" label="Favoritos" onPress={() => { /* Navegar para Favoritos */ }} />
            <ActionButton iconName="bell-outline" label="Notificação" onPress={() => { /* Navegar para Notificações */ }} />
            <ActionButton iconName="message-outline" label="Mensagens" onPress={() => { /* Navegar para Mensagens */ }} />
          </View>

          {/* Tela de Navegação - Dependendo da ação, renderizar ServiceTypes, Establishments ou Booking */}
          <View style={styles.screenContainer}>
            {!selectedServiceType ? (
              <ServiceTypes setSelectedServiceType={setSelectedServiceType} />
            ) : !selectedEstablishment ? (
              <Establishments serviceTypeId={selectedServiceType} setSelectedEstablishment={setSelectedEstablishment} />
            ) : (
              <Booking establishmentId={selectedEstablishment} />
            )}
          </View>
        </View>
      </ScrollView>
      <BottomNavBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E0F2F1',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#008584',
    paddingTop: 20,
    paddingBottom: 60,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  body: {
    marginTop: -40,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  guideButton: {
    backgroundColor: '#00A9A5',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  guideButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    width: '31%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  actionButtonText: {
    marginTop: 8,
    color: '#333',
    fontSize: 14,
  },
  bannerContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  screenContainer: {
    marginBottom: 60, // To prevent overlapping with the bottom navbar
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 10,
    paddingBottom: 15,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#888',
  },
  navTextActive: {
    fontSize: 12,
    color: '#008584',
    fontWeight: 'bold',
  },
});

export default HomeScreen;