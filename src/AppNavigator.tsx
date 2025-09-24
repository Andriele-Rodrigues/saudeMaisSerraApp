import AgendaScreen from '@/app/(tabs)/Agenda'; // Defina a tela da agenda
import App from '@/app/(tabs)/index'; // Defina sua tela inicial
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={App} />
        <Stack.Screen name="Agenda" component={AgendaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;