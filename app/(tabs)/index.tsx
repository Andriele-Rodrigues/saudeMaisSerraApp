import { Href, Link } from 'expo-router'; // 👈 IMPORTANTE: Importe o Link
import React from 'react';
import { Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// O ActionButton continua igual
const ActionButton = ({ iconName, label, href }: { iconName: string; label: string; href: Href }) => (
  // Usamos o Link para envolver o botão e torná-lo navegável
  <Link href={href} asChild>
    <TouchableOpacity style={styles.actionButton}>
      <Icon name={iconName} size={30} color="#fff" />
      <Text style={styles.actionButtonText}>{label}</Text>
    </TouchableOpacity>
  </Link>
);

// A tela principal agora é só a tela de Início
export default function IndexScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#008584" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Image 
            source={require('./assets/images/logo.png')}  // Substitua pelo caminho correto da sua logo
            style={styles.logoImage}
          />
        </View>

        <View style={styles.body}>
          <View style={styles.searchContainer}>
            <Icon name="magnify" size={20} color="#888" style={styles.searchIcon} />
            <TextInput placeholder="Pesquisa" style={styles.searchInput} />
            <Icon name="close" size={20} color="#888" />
          </View>

          {/* O botão "Guia Médico" agora navega para a rota /guia-medico */}
          <Link href="/guia-medico" asChild>
            <TouchableOpacity style={styles.guideButton}>
              <Text style={styles.guideButtonText}>Guia Médico</Text>
            </TouchableOpacity>
          </Link>

          <View style={styles.actionGrid}>
            <ActionButton iconName="pill" label="Medicação" href="/(tabs)/medicacao" />
            <ActionButton iconName="clipboard-text-outline" label="Exames" href="/(tabs)/exames" />
            <ActionButton iconName="human-wheelchair" label="Sintomas" href="/(tabs)/sintomas" />
          </View>

         
             <View style={styles.bannerContainer}>
            <Image 
              source={require('./assets/images/banner.png')}  // Substitua pelo caminho correto da sua imagem
              style={styles.bannerImage}
            />
          </View>
          

          <View style={styles.actionGrid}>
            <ActionButton iconName="star-outline" label="Favoritos" href="/(tabs)/favoritos" />
            <ActionButton iconName="bell-outline" label="Notificação" href="/(tabs)/notificacoes" />
            <ActionButton iconName="message-outline" label="Mensagens" href="/(tabs)/mensagens" />
          </View>
        </View>
      </ScrollView>
      {/* A Barra de Navegação foi REMOVIDA daqui, pois o _layout.tsx cuida disso */}
    </SafeAreaView>
  );
};

// Os estilos continuam os mesmos
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E0F2F1',
  },
  scrollView: {
    flex: 1,
  },
  logoImage: {
    width: 250,  
    height: 250,
    resizeMode: 'contain', // Ajusta a logo para se manter proporcional
  },
  header: {
    backgroundColor: '#008584',
    alignItems: 'center',
    height: 150,
    justifyContent: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  body: {
    marginTop: -20,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 10,
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
    backgroundColor: '#008584',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    width: '31%',
    elevation: 2,
  },
  actionButtonText: {
    marginTop: 8,
    color: 'white',
    fontSize: 14,
  },
  bannerContainer: {
    height: 200,  // Ajuste o tamanho conforme necessário
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Ajusta a imagem para cobrir a área
  },
});