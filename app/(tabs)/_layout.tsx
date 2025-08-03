import { Tabs } from 'expo-router';
import { Chrome as Home, University, ChartBar as BarChart3, Download, Settings } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { t, getCurrentLanguage } from '../../services/i18n';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [lang, setLang] = useState(getCurrentLanguage());

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? '#60A5FA' : '#3B82F6', // blue-400/blue-600
        tabBarInactiveTintColor: isDark ? '#9CA3AF' : '#6B7280', // gray-400/gray-600
        tabBarStyle: {
          backgroundColor: isDark ? '#1F2937' : '#FFFFFF', // dark:bg-gray-800, light:bg-white
          borderTopWidth: 1,
          borderTopColor: isDark ? '#374151' : '#E5E7EB', // dark:border-gray-700, light:border-gray-200
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('home'),
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="universities"
        options={{
          title: t('universities'),
          tabBarIcon: ({ size, color }) => (
            <University size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: t('stats'),
          tabBarIcon: ({ size, color }) => (
            <BarChart3 size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="import"
        options={{
          title: t('import'),
          tabBarIcon: ({ size, color }) => (
            <Download size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings'),
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}