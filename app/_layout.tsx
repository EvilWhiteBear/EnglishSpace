import { AlertProvider } from '@/template';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { UserProvider } from '@/contexts/UserContext';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <UserProvider>
          <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="lesson" options={{ animation: 'slide_from_bottom' }} />
          </Stack>
        </UserProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}
