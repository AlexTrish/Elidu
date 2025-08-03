import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, useColorScheme, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, TrendingDown, Calendar, Target } from 'lucide-react-native';
import { ProbabilityIndicator } from '../../components/ProbabilityIndicator';
import { Database } from '../../services/database';
import { t } from '../../services/i18n';

type TimeRange = '7d' | '30d' | '90d';

function getDateNDaysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

export default function StatisticsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedRange, setSelectedRange] = useState<TimeRange>('30d');
  const [programs, setPrograms] = useState<any[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [history, setHistory] = useState<Record<string, any[]>>({});

  useEffect(() => {
    (async () => {
      await Database.init();
      const dbUniversities = await Database.getUniversities();
      const dbPrograms = await Database.getPrograms();
      setUniversities(dbUniversities);
      setPrograms(dbPrograms);

      // Загружаем историю для всех программ
      const allHistory: Record<string, any[]> = {};
      for (const p of dbPrograms) {
        const h = await Database.getProgramHistory?.(p.id);
        allHistory[p.id] = h || [];
      }
      setHistory(allHistory);
    })();
  }, []);

  // Фильтрация истории по выбранному диапазону
  const getHistoryInRange = (programId: string, range: TimeRange) => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const fromDate = getDateNDaysAgo(days);
    return (history[programId] || []).filter(
      (entry) => new Date(entry.date) >= fromDate
    );
  };

  // Для статистики используем последнее значение из истории за диапазон
  const programsWithChances = programs.map((p) => {
    const hist = getHistoryInRange(p.id, selectedRange);
    const last = hist[hist.length - 1];
    const prev = hist.length > 1 ? hist[hist.length - 2] : null;
    return {
      ...p,
      userPosition: last
        ? {
            generalPosition: last.generalPosition,
            priorityPosition: last.priorityPosition,
            admissionChance: last.admissionChance,
          }
        : undefined,
      probabilityChange: prev && last ? last.admissionChance - prev.admissionChance : 0,
      rankChange: prev && last ? last.generalPosition - prev.generalPosition : 0,
    };
  }).filter(p => p.userPosition);

  const averageProbability =
    programsWithChances.reduce((sum, p) => sum + (p.userPosition?.admissionChance || 0), 0) /
      (programsWithChances.length || 1);

  const highProbabilityCount = programsWithChances.filter(
    (p) => (p.userPosition?.admissionChance || 0) >= 70
  ).length;
  const mediumProbabilityCount = programsWithChances.filter((p) => {
    const chance = p.userPosition?.admissionChance || 0;
    return chance >= 40 && chance < 70;
  }).length;
  const lowProbabilityCount = programsWithChances.filter(
    (p) => (p.userPosition?.admissionChance || 0) < 40
  ).length;

  const styles = createStyles(isDark);

  const getUniversityName = (universityId: string) => {
    return universities.find((u) => u.id === universityId)?.name || 'Unknown';
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return '#10B981';
    if (probability >= 40) return '#F59E0B';
    return '#EF4444';
  };

  const getProbabilityLabel = (probability: number) => {
    if (probability >= 70) return t('high');
    if (probability >= 40) return t('medium');
    return t('low');
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp size={16} color="#10B981" />;
    if (change < 0) return <TrendingDown size={16} color="#EF4444" />;
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('statistics')}</Text>
        <View style={styles.timeRangeSelector}>
          {(['7d', '30d', '90d'] as TimeRange[]).map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.timeRangeButton,
                selectedRange === range && styles.timeRangeButtonActive,
              ]}
              onPress={() => setSelectedRange(range)}
            >
              <Text
                style={[
                  styles.timeRangeText,
                  selectedRange === range && styles.timeRangeTextActive,
                ]}
              >
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Overview Cards */}
        <View style={styles.overviewGrid}>
          <View style={styles.overviewCard}>
            <View style={styles.overviewHeader}>
              <Target size={20} color="#3B82F6" />
              <Text style={styles.overviewLabel}>{t('averageChance')}</Text>
            </View>
            <Text style={styles.overviewValue}>{Math.round(averageProbability)}%</Text>
          </View>

          <View style={styles.overviewCard}>
            <View style={styles.overviewHeader}>
              <TrendingUp size={20} color="#10B981" />
              <Text style={styles.overviewLabel}>{t('highProbability')}</Text>
            </View>
            <Text style={styles.overviewValue}>{highProbabilityCount}</Text>
          </View>
        </View>

        {/* Probability Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('probabilityDistribution')}</Text>
          <View style={styles.distributionContainer}>
            <View style={styles.distributionItem}>
              <View
                style={[styles.distributionIndicator, { backgroundColor: '#10B981' }]}
              />
              <Text style={styles.distributionLabel}>{t('high')} (70%+)</Text>
              <Text style={styles.distributionValue}>{highProbabilityCount}</Text>
            </View>
            <View style={styles.distributionItem}>
              <View
                style={[styles.distributionIndicator, { backgroundColor: '#F59E0B' }]}
              />
              <Text style={styles.distributionLabel}>{t('medium')} (40-69%)</Text>
              <Text style={styles.distributionValue}>{mediumProbabilityCount}</Text>
            </View>
            <View style={styles.distributionItem}>
              <View
                style={[styles.distributionIndicator, { backgroundColor: '#EF4444' }]}
              />
              <Text style={styles.distributionLabel}>{t('low')} (0-39%)</Text>
              <Text style={styles.distributionValue}>{lowProbabilityCount}</Text>
            </View>
          </View>
        </View>

        {/* Program Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('programDetails')}</Text>
          {programsWithChances.map((program) => (
            <View key={program.id} style={styles.programCard}>
              <View style={styles.programHeader}>
                <View style={styles.programInfo}>
                  <Text style={styles.programName}>{program.name}</Text>
                  <Text style={styles.universityName}>
                    {getUniversityName(program.universityId)}
                  </Text>
                </View>
                <ProbabilityIndicator probability={program.userPosition?.admissionChance || 0} />
              </View>

              <View style={styles.programStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>{t('rank')}</Text>
                  <View style={styles.statValueContainer}>
                    <Text style={styles.statValue}>{program.userPosition?.generalPosition || 'Н/Д'}</Text>
                    {getChangeIcon(program.rankChange)}
                    {program.rankChange !== 0 && (
                      <Text
                        style={[
                          styles.changeText,
                          { color: program.rankChange > 0 ? '#10B981' : '#EF4444' },
                        ]}
                      >
                        {program.rankChange > 0 ? '+' : ''}
                        {program.rankChange}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>{t('priority')}</Text>
                  <Text style={styles.statValue}>{program.userPosition?.priorityPosition || 'Н/Д'}</Text>
                </View>

                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>{t('availableSeats')}</Text>
                  <Text style={styles.statValue}>{program.budgetSeats}</Text>
                </View>
              </View>

              <View style={styles.probabilityDetails}>
                <Text style={styles.probabilityDetailText}>
                  {t('probability')}: <Text style={{ color: getProbabilityColor(program.userPosition?.admissionChance || 0) }}>
                    {program.userPosition?.admissionChance || 0}% ({getProbabilityLabel(program.userPosition?.admissionChance || 0)})
                  </Text>
                </Text>
                {program.probabilityChange !== 0 && (
                  <Text
                    style={[
                      styles.probabilityChange,
                      { color: program.probabilityChange > 0 ? '#10B981' : '#EF4444' },
                    ]}
                  >
                    {program.probabilityChange > 0 ? '+' : ''}
                    {program.probabilityChange}% {t('vsLastUpdate')}
                  </Text>
                )}
              </View>
            </View>
          ))}

          {programsWithChances.length === 0 && (
            <View style={styles.emptyState}>
              <Calendar size={48} color={isDark ? '#6B7280' : '#9CA3AF'} />
              <Text style={styles.emptyText}>{t('noStatisticsAvailable')}</Text>
              <Text style={styles.emptySubtext}>{t('addProgramsToSeeStats')}</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#374151' : '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDark ? '#F9FAFB' : '#111827',
  },
  timeRangeSelector: {
    flexDirection: 'row',
    backgroundColor: isDark ? '#374151' : '#F3F4F6',
    borderRadius: 8,
    padding: 2,
  },
  timeRangeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  timeRangeButtonActive: {
    backgroundColor: '#3B82F6',
  },
  timeRangeText: {
    fontSize: 12,
    fontWeight: '500',
    color: isDark ? '#D1D5DB' : '#6B7280',
  },
  timeRangeTextActive: {
    color: 'white',
  },
  scrollContainer: {
    padding: 20,
  },
  overviewGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: isDark ? '#1F2937' : 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  overviewLabel: {
    fontSize: 12,
    color: isDark ? '#9CA3AF' : '#6B7280',
    fontWeight: '500',
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDark ? '#F9FAFB' : '#111827',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#F9FAFB' : '#111827',
    marginBottom: 16,
  },
  distributionContainer: {
    backgroundColor: isDark ? '#1F2937' : 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  distributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  distributionIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  distributionLabel: {
    flex: 1,
    fontSize: 14,
    color: isDark ? '#D1D5DB' : '#4B5563',
  },
  distributionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#F9FAFB' : '#111827',
  },
  programCard: {
    backgroundColor: isDark ? '#1F2937' : 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  programInfo: {
    flex: 1,
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
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  statLabel: {
    fontSize: 14,
    color: isDark ? '#9CA3AF' : '#6B7280',
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '500',
    color: isDark ? '#F9FAFB' : '#111827',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  probabilityDetails: {
    borderTopWidth: 1,
    borderTopColor: isDark ? '#374151' : '#E5E7EB',
    paddingTop: 12,
  },
  probabilityDetailText: {
    fontSize: 14,
    color: isDark ? '#D1D5DB' : '#4B5563',
    marginBottom: 4,
  },
  probabilityChange: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
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