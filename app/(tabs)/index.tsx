import { Link } from 'expo-router'; // Certifique-se de importar Link
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ActionButton = ({iconName, label, to, navigation}: {iconName: string; label: string; to: string; navigation: any; }) => (
  <Link href={{
      pathname: '/(tabs)/Agenda',
      params: { id: 'Agenda' }
    }} style={styles.actionButton}>  {/* Link atualizado */}
    <Icon name={iconName} size={30} color="#008584" />
    <Text style={styles.actionButtonText}>{label}</Text>
  </Link>
);

const Home = ({ navigation }: { navigation: any }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#008584" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Saúde Mais Serra</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.actionGrid}>
            <ActionButton iconName="pill" label="Medicação" navigation={navigation} to="/medicacao" />
            <ActionButton iconName="clipboard-text-outline" navigation={navigation} label="Exames" to="/exames" />
            <ActionButton iconName="human-wheelchair" navigation={navigation} label="Sintomas" to="/sintomas" />
          </View>

          {/* Link para a tela de Agenda */}
          <View style={styles.actionGrid}>
            <ActionButton iconName="calendar" label="Agenda" navigation={navigation} to="app/(tabs)/Agenda.tsx" />
          </View>
        </View>
      </ScrollView>
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
});

export default Home;