import { Stack } from 'expo-router';
import React from 'react';

export default function GuiaMedicoLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Guia Médico' }} />
      <Stack.Screen name="selecionar-especialidade" options={{ title: 'Especialidade' }} />
      <Stack.Screen name="selecionar-prestador" options={{ title: 'Tipo de Prestador' }} />
      <Stack.Screen name="resultados" options={{ title: 'Resultados' }} />
      <Stack.Screen name="detalhes" options={{ title: 'Detalhes do Prestador' }} />
      <Stack.Screen name="equipe" options={{ title: 'Equipe médica' }} />
      <Stack.Screen name="agendar-consulta" options={{ title: 'Agendar' }} />
    </Stack>
  );
}