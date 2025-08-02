import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  isDark: boolean;
}

export function StatCard({ icon, title, value, isDark }: StatCardProps) {
  const styles = createStyles(isDark);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {icon}
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#1F2937' : 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 12,
    color: isDark ? '#9CA3AF' : '#6B7280',
    fontWeight: '500',
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#F9FAFB' : '#111827',
  },
});