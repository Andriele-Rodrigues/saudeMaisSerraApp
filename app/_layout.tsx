import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* A tela principal com as abas (tabs) não terá cabeçalho. */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* A tela do guia-medico será um modal e também não terá o cabeçalho padrão. */}
      <Stack.Screen
        name="guia-medico"
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />

      {/* --- LINHA ADICIONADA --- */}
      {/* Aqui declaramos a tela 'medicacao' e removemos o cabeçalho padrão dela. */}
      <Stack.Screen name="medicacao" options={{ headerShown: false }} />

    </Stack>
  );
}