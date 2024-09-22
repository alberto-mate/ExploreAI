import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '@react-navigation/native';


export default function RootLayout() {
  return (
    <ThemeProvider value={{ dark: true, colors: { background: '#1F2937' } }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}