import { Stack } from 'expo-router';

export default function GuiaMedicoLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Guia Médico' }} />
      <Stack.Screen name="resultados" options={{ title: 'Resultados' }} />
      <Stack.Screen name="detalhes" options={{ title: 'Detalhes do Prestador' }} />
    </Stack>
  );
}