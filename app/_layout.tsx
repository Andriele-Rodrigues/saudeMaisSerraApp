import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* A tela principal será o nosso conjunto de abas. Escondemos o cabeçalho dela. */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* As outras telas (como Guia Médico, Exames, etc.) ganharão um cabeçalho automaticamente */}
      {/* Aqui definimos como a tela de Guia Médico será apresentada (como um modal) */}
      <Stack.Screen
        name="guia-medico"
        options={{
          headerShown: false, // Deixa o layout interno do guia-medico controlar o cabeçalho
          presentation: 'modal', // Efeito de subir da parte de baixo
        }}
      />
      {/* As telas abaixo não precisam ser declaradas, o Stack vai criá-las automaticamente */}
      {/* <Stack.Screen name="exames" options={{ title: 'Exames' }} /> */}
      {/* <Stack.Screen name="sintomas" options={{ title: 'Sintomas' }} /> */}
      {/* ... e assim por diante */}
    </Stack>
  );
}