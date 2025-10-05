
import { Stack } from 'expo-router';
import React from 'react';
import { AppointmentsProvider } from '../contexts/AppointmentsContext';

export default function RootLayout() {
  return (
    // O AppointmentsProvider agora "abraça" toda a navegação
    <AppointmentsProvider>
      <Stack>
        {/* As abas principais do app */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* O fluxo de navegação do Guia Médico */}
        <Stack.Screen name="guia-medico" options={{ headerShown: false }} />
      </Stack>
    </AppointmentsProvider>
  );
}