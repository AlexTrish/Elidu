import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { AuthScreen } from '@/components/AuthScreen';
import { View, ActivityIndicator, useColorScheme } from 'react-native';
import React from 'react';
import { CrashLogger } from '../services/crashLogger';
import { ErrorBoundary } from '../components/ErrorBoundary';

export default function RootLayout() {
  useFrameworkReady();
  const { user, isLoading: authLoading, requireAuth } = useAuth();
  const { isLoading: langLoading } = useLanguage();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    CrashLogger.init();
    
    const originalHandler = ErrorUtils.getGlobalHandler();
    ErrorUtils.setGlobalHandler((error, isFatal) => {
      CrashLogger.logError(error, isFatal ? 'FATAL' : 'NON_FATAL');
      originalHandler(error, isFatal);
    });
  }, []);

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

  if (!user && requireAuth) {
    return <AuthScreen />;
  }

  return (
    <ErrorBoundary>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ErrorBoundary>
  );
}
