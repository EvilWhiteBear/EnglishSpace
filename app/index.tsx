import { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@/hooks/useUser';
import { Colors } from '@/constants/theme';
import SplashScreen from './splash';

export default function EntryScreen() {
  const router = useRouter();
  const { profile, isLoading } = useUser();
  const [splashDone, setSplashDone] = useState(false);

  const handleSplashContinue = () => {
    setSplashDone(true);
    if (profile?.onboardingDone) {
      router.replace('/(tabs)');
    } else {
      router.replace('/onboarding');
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#050A1A', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  if (!splashDone) {
    return <SplashScreen onContinue={handleSplashContinue} />;
  }

  return null;
}
