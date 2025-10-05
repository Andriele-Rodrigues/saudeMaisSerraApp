import { Stack } from 'expo-router';
import React from 'react';

export default function GuiaMedicoLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Guia Médico' }} />
      <Stack.Screen name="especialidades" options={{ title: 'Especialidades' }} />
      <Stack.Screen name="prestadores" options={{ title: 'Tipos de Prestador' }} />
      <Stack.Screen name="resultados" options={{ title: 'Resultados' }} />
      <Stack.Screen name="detalhes" options={{ title: 'Detalhes do Prestador' }} />
    </Stack>
  );
}