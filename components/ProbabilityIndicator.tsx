import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { t } from '../services/i18n';

interface ProbabilityIndicatorProps {
  probability: number;
  size?: 'small' | 'medium' | 'large';
}

export function ProbabilityIndicator({ probability, size = 'medium' }: ProbabilityIndicatorProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const getColor = () => {
    if (probability >= 70) return '#10B981';
    if (probability >= 40) return '#F59E0B';
    return '#EF4444';
  };

  const getLabel = () => {
    if (probability >= 70) return t('high');
    if (probability >= 40) return t('medium');
    return t('low');
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: { paddingHorizontal: 8, paddingVertical: 4 },
          text: { fontSize: 12 },
          label: { fontSize: 10 },
        };
      case 'large':
        return {
          container: { paddingHorizontal: 16, paddingVertical: 8 },
          text: { fontSize: 18 },
          label: { fontSize: 14 },
        };
      default:
        return {
          container: { paddingHorizontal: 12, paddingVertical: 6 },
          text: { fontSize: 14 },
          label: { fontSize: 12 },
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const color = getColor();
  const label = getLabel();

  const styles = createStyles(isDark, color, sizeStyles);

  return (
    <View style={styles.container}>
      <Text style={styles.percentage}>{probability}%</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const createStyles = (isDark: boolean, color: string, sizeStyles: any) => StyleSheet.create({
  container: {
    backgroundColor: `${color}20`,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: color,
    ...sizeStyles.container,
  },
  percentage: {
    fontSize: sizeStyles.text.fontSize,
    fontWeight: 'bold',
    color: color,
  },
  label: {
    fontSize: sizeStyles.label.fontSize,
    color: color,
    opacity: 0.8,
  },
});