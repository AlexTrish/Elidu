import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { AuthScreen } from '@/components/AuthScreen';
import { View, ActivityIndicator, useColorScheme } from 'react-native';

export default function RootLayout() {
  useFrameworkReady();
  const { user, isLoading: authLoading } = useAuth();
  const { isLoading: langLoading } = useLanguage();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (authLoading || langLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: isDark ? '#111827' : '#F9FAFB'
      }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
