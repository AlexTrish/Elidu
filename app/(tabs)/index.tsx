import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, TrendingUp, Users, BookOpen } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ProbabilityIndicator } from '../../components/ProbabilityIndicator';
import { StatCard } from '../../components/StatCard';
import { mockData } from '../../services/mockData';
import { t } from '../../services/i18n';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  
  const [programs, setPrograms] = useState(mockData.programs);
  const [universities, setUniversities] = useState(mockData.universities);

  const totalPrograms = programs.length;
  const averageProbability = programs.reduce((sum, p) => sum + p.probability, 0) / totalPrograms || 0;
  const highProbabilityCount = programs.filter(p => p.probability >= 70).length;

  const styles = createStyles(isDark);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('admissionTracker')}</Text>
          <Text style={styles.subtitle}>{t('trackYourChances')}</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon={<BookOpen size={24} color="#3B82F6" />}
            title={t('programs')}
            value={totalPrograms.toString()}
            isDark={isDark}
          />
          <StatCard
            icon={<TrendingUp size={24} color="#10B981" />}
            title={t('avgChance')}
            value={`${Math.round(averageProbability)}%`}
            isDark={isDark}
          />
          <StatCard
            icon={<Users size={24} color="#F59E0B" />}
            title={t('highChance')}
            value={highProbabilityCount.toString()}
            isDark={isDark}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('recentPrograms')}</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push('/universities')}
            >
              <Plus size={20} color="white" />
              <Text style={styles.addButtonText}>{t('add')}</Text>
            </TouchableOpacity>
          </View>

          {programs.slice(0, 3).map((program) => (
            <View key={program.id} style={styles.programCard}>
              <View style={styles.programHeader}>
                <Text style={styles.programName}>{program.name}</Text>
                <Text style={styles.universityName}>
                  {universities.find(u => u.id === program.universityId)?.name}
                </Text>
              </View>
              <View style={styles.programStats}>
                <Text style={styles.statText}>
                  {t('rank')}: {program.userPosition?.generalPosition || 'Н/Д'}
                </Text>
                <Text style={styles.statText}>{t('seats')}: {program.budgetSeats}</Text>
                <Text style={styles.statText}>
                  Шанс: {program.userPosition?.admissionChance || 0}%
                </Text>
              </View>
              <View style={styles.probabilityContainer}>
                <ProbabilityIndicator probability={program.userPosition?.admissionChance || 0} />
              </View>
            </View>
          ))}

          {programs.length === 0 && (
            <View style={styles.emptyState}>
              <BookOpen size={48} color={isDark ? '#6B7280' : '#9CA3AF'} />
              <Text style={styles.emptyText}>{t('noProgramsAdded')}</Text>
              <Text style={styles.emptySubtext}>{t('addFirstProgram')}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#111827' : '#F9FAFB',
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: isDark ? '#F9FAFB' : '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: isDark ? '#9CA3AF' : '#6B7280',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: isDark ? '#F9FAFB' : '#111827',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  programCard: {
    backgroundColor: isDark ? '#1F2937' : 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  programHeader: {
    marginBottom: 12,
  },
  programName: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#F9FAFB' : '#111827',
    marginBottom: 4,
  },
  universityName: {
    fontSize: 14,
    color: isDark ? '#9CA3AF' : '#6B7280',
  },
  programStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statText: {
    fontSize: 12,
    color: isDark ? '#D1D5DB' : '#4B5563',
    fontWeight: '500',
  },
  probabilityContainer: {
    alignItems: 'flex-end',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#9CA3AF' : '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: isDark ? '#6B7280' : '#9CA3AF',
    textAlign: 'center',
  },
});