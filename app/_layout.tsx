import { migrateDbIfNeeded } from '@/src/database/migrations';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import React from 'react';
import { AppointmentsProvider } from '../contexts/AppointmentsContext';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="saude_serra.db" onInit={migrateDbIfNeeded}>
      <AppointmentsProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </AppointmentsProvider>
    </SQLiteProvider>
  );
}
