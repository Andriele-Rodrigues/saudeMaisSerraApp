import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

// Importando as telas
import App from '@/app/(tabs)/index';
import Appointment from '@/src/components/screens/Appointment'; // Tela Agendamentos
import Profile from '@/src/components/screens/Profile'; // Tela Perfil
import VaccineCard from '@/src/components/screens/VaccineCard'; // Tela Carteira de Vacina

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={App} />
        <Stack.Screen name="VaccineCard" component={VaccineCard} />
        <Stack.Screen name="Appointment" component={Appointment} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;