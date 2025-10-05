import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { Tabs } from 'expo-router';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function TabLayout() {
  return (
     <FavoritesProvider> 
    <Tabs
      screenOptions={{
        headerShown: false, // Esconde o cabeçalho padrão
        tabBarActiveTintColor: '#008584', // Cor do ícone ativo
        tabBarInactiveTintColor: '#888', // Cor do ícone inativo
      }}
    >
      <Tabs.Screen
        name="index" // Aponta para o arquivo index.tsx
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="VaccineCard" // Aponta para o arquivo VaccineCard.tsx
        options={{
          title: 'Carteira',
          tabBarIcon: ({ color, size }) => (
            <Icon name="wallet-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Agenda" // Aponta para o arquivo Agenda.tsx
        options={{
          title: 'Agenda',
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile" // Aponta para o arquivo Profile.tsx
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-circle-outline" color={color} size={size} />
          ),
        }}
      />
       <Tabs.Screen
        name="medicacao" 
        options={{
          href: null, 
        }}
      />
       <Tabs.Screen
        name="favoritos" 
        options={{
          href: null, 
        }}
      />
       <Tabs.Screen
        name="guia-medico" 
        options={{
          href: null, 
        }}
      />
       <Tabs.Screen
        name="exames" 
        options={{
          href: null, 
        }}
      />
       <Tabs.Screen
        name="mensagens" 
        options={{
          href: null, 
        }}
      />
       <Tabs.Screen
        name="notificacoes" 
        options={{
          href: null, 
        }}
      />
       <Tabs.Screen
        name="sintomas" 
        options={{
          href: null, 
        }}
      />
    </Tabs>
    </FavoritesProvider>
    
  );
}