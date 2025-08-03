import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, useColorScheme, Dimensions, Platform } from 'react-native';
import { Toast } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, CreditCard as Edit3, Trash2, ExternalLink } from 'lucide-react-native';
import { AdmissionCalculator, AdmissionListEntry, PositionResult } from '../../services/admissionCalculator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { t } from '../../services/i18n';
import { AuthService } from '../../services/auth';
import { Database } from '../../services/database';
import { CrashLogger } from '../../services/crashLogger';

interface University {
  id: string;
  name: string;
  url: string;
}

interface Program {
  id: string;
  universityId: string;
  name: string;
  budgetSeats: number;
  passingScore?: number;
  contractType: 'budget' | 'contract' | 'quota';
  currentRank: number;
  originalsAbove: number;
  examScore: number;
  probability: number;
}

interface ProgramHistoryEntry {
  date: string;
  generalPosition: number;
  priorityPosition: number;
  admissionChance: number;
}

interface ProgramWithHistory extends Program {
  admissionList?: AdmissionListEntry[];
  userPosition?: PositionResult | null;
  history?: ProgramHistoryEntry[];
}

const HISTORY_KEY = '@admission_tracker_program_history';

async function saveProgramHistory(programId: string, entry: ProgramHistoryEntry) {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  const all: Record<string, ProgramHistoryEntry[]> = raw ? JSON.parse(raw) : {};
  if (!all[programId]) all[programId] = [];
  all[programId].push(entry);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(all));
}

async function getProgramHistory(programId: string): Promise<ProgramHistoryEntry[]> {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  const all: Record<string, ProgramHistoryEntry[]> = raw ? JSON.parse(raw) : {};
  return all[programId] || [];
}

export default function UniversitiesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { toast, showToast, hideToast } = useToast();

  const [universities, setUniversities] = useState<University[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [showUniversityModal, setShowUniversityModal] = useState(false);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [importingProgram, setImportingProgram] = useState<ProgramWithHistory | null>(null);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importSource, setImportSource] = useState<'csv' | 'html' | null>(null);
  const [importData, setImportData] = useState('');
  const [programsWithHistory, setProgramsWithHistory] = useState<ProgramWithHistory[]>([]);
  const [googleSheetUrl, setGoogleSheetUrl] = useState<string>('');

  const [universityForm, setUniversityForm] = useState({
    name: '',
    url: '',
  });

  const [programForm, setProgramForm] = useState({
    name: '',
    budgetSeats: '',
  });
  
  const [showImportModal, setShowImportModal] = useState(false);
  const [importUrl, setImportUrl] = useState('');

  const styles = createStyles(isDark);

  const calculateProbability = (rank: number, originals: number, seats: number): number => {
    const effectivePosition = Math.max(rank - originals, 1);
    const probability = Math.max(0, Math.min(100, ((seats - effectivePosition + 1) / seats) * 100));
    return Math.round(probability);
  };

  const resetUniversityForm = () => {
    setUniversityForm({ name: '', url: '' });
    setEditingUniversity(null);
  };

  const resetProgramForm = () => {
    setProgramForm({
      name: '',
      budgetSeats: '',
    });
    setEditingProgram(null);
    setImportUrl('');
  };

  // Инициализация БД и загрузка данных при первом запуске и при изменениях
  useEffect(() => {
    (async () => {
      await Database.init();
      const dbUniversities = await Database.getUniversities();
      const dbPrograms = await Database.getPrograms();
      setUniversities(dbUniversities);
      setPrograms(dbPrograms);
    })();
  }, []);

  const handleAddUniversity = async () => {
    if (!universityForm.name.trim()) {
      Alert.alert(t('error'), t('universityName') + ' ' + t('required'));
      return;
    }

    if (editingUniversity) {
      await Database.updateUniversity({
        ...editingUniversity,
        name: universityForm.name,
        url: universityForm.url,
      });
    } else {
      await Database.addUniversity({
        id: Date.now().toString(),
        name: universityForm.name,
        url: universityForm.url,
      });
    }
    const dbUniversities = await Database.getUniversities();
    setUniversities(dbUniversities);

    resetUniversityForm();
    setShowUniversityModal(false);
  };

  const handleAddProgram = async () => {
    if (!programForm.name.trim() || !programForm.budgetSeats) {
      Alert.alert(t('error'), 'Заполните название и количество мест');
      return;
    }
    if (!selectedUniversity) {
      Alert.alert(t('error'), t('pleaseSelectUniversity') || 'Please select a university first');
      return;
    }

    const budgetSeats = parseInt(programForm.budgetSeats);

    const programData = {
      id: editingProgram?.id || Date.now().toString(),
      universityId: selectedUniversity.id,
      name: programForm.name,
      budgetSeats,
      passingScore: undefined,
      contractType: 'budget' as const,
      currentRank: 0,
      originalsAbove: 0,
      examScore: 0,
      probability: 0,
      googleSheetUrl: importUrl || undefined,
    };

    if (editingProgram) {
      await Database.updateProgram(programData);
    } else {
      await Database.addProgram(programData);
    }
    
    const dbPrograms = await Database.getPrograms();
    setPrograms(dbPrograms);

    resetProgramForm();
    setShowProgramModal(false);
  };

  const handleEditUniversity = (university: University) => {
    setEditingUniversity(university);
    setUniversityForm({
      name: university.name,
      url: university.url,
    });
    setShowUniversityModal(true);
  };

  const handleEditProgram = (program: Program) => {
    setEditingProgram(program);
    setProgramForm({
      name: program.name,
      budgetSeats: program.budgetSeats.toString(),
    });
    setImportUrl((program as any).googleSheetUrl || '');
    setSelectedUniversity(universities.find(u => u.id === program.universityId) || null);
    setShowProgramModal(true);
  };

  const handleDeleteUniversity = async (universityId: string) => {
    Alert.alert(
      t('deleteUniversity'),
      t('deleteUniversityConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            await Database.deleteUniversity(universityId);
            setUniversities(await Database.getUniversities());
            setPrograms(await Database.getPrograms());
          },
        },
      ]
    );
  };

  const handleDeleteProgram = async (programId: string) => {
    Alert.alert(
      t('deleteProgram'),
      t('deleteProgramConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            await Database.deleteProgram(programId);
            setPrograms(await Database.getPrograms());
          },
        },
      ]
    );
  };

  // Получаем participantId из AsyncStorage (или из AuthService)
  const [participantId, setParticipantId] = useState<string | null>(null);

  useEffect(() => {
    // Получаем participantId из текущего пользователя (AuthService)
    const user = AuthService.getCurrentUser();
    if (user?.participantId) {
      setParticipantId(user.participantId);
    } else {
      // fallback: получить из AsyncStorage напрямую
      AsyncStorage.getItem('@admission_tracker_participant_id').then(id => {
        setParticipantId(id);
      });
    }
  }, []);

  // Для каждого program вычисляем userPosition, если есть participantId
  const programsWithUserPosition = programs.map(program => {
    if (participantId) {
      if ((program as any).admissionList) {
        const userPosition = AdmissionCalculator.calculatePosition(
          (program as any).admissionList,
          participantId,
          program.budgetSeats
        );
        return { ...program, userPosition };
      }
    }
    return program;
  });

  // Импорт данных для направления
  const handleImportData = async () => {
    if (!importingProgram) return;
    let admissionList: AdmissionListEntry[] = [];
    try {
      if (importSource === 'csv') {
        admissionList = AdmissionCalculator.parseAdmissionTable(importData);
      } else if (importSource === 'html') {
        Alert.alert('Ошибка', 'Импорт из HTML не реализован');
        return;
      }
      
      await updateProgramWithCalculations(importingProgram, admissionList);
      
      setImportModalVisible(false);
      setImportData('');
      setImportSource(null);
      setImportingProgram(null);
      showToast('Данные импортированы с подсчетом позиций!');
    } catch (e) {
      CrashLogger.logError(e as Error, 'Import Data');
      Alert.alert('Ошибка', 'Не удалось импортировать данные');
    }
  };

  // Загрузка истории для всех программ (при монтировании)
  useEffect(() => {
    (async () => {
      const updated = await Promise.all(
        programs.map(async (p) => {
          const history = await getProgramHistory(p.id);
          return { ...p, history };
        })
      );
      setProgramsWithHistory(updated);
    })();
  }, [programs]);

  // Импорт из Google Sheets (CSV)
  const handleImportFromGoogleSheet = async (program: ProgramWithHistory) => {
    if (!program || !program.googleSheetUrl) {
      Alert.alert('Ошибка', 'Ссылка на Google таблицу не указана');
      return;
    }
    try {
      // Сохраняем старые данные в историю
      if (program.admissionList && program.userPosition) {
        const historyEntry: ProgramHistoryEntry = {
          date: new Date().toISOString(),
          generalPosition: program.userPosition.generalPosition,
          priorityPosition: program.userPosition.priorityPosition,
          admissionChance: program.userPosition.admissionChance,
        };
        await saveProgramHistory(program.id, historyEntry);
      }

      // Получаем CSV из Google Sheets
      let url = program.googleSheetUrl;
      if (url.includes('/edit')) {
        url = url.replace(/\/edit.*$/, '/export?format=tsv');
      } else if (!url.includes('export?format=tsv')) {
        url += '/export?format=tsv';
      }
      const response = await fetch(url);
      const csvData = await response.text();

      // Парсим и обновляем admissionList
      const admissionList = AdmissionCalculator.parseAdmissionTable(csvData);
      // Используем participantId
      const userPosition = participantId
        ? AdmissionCalculator.calculatePosition(admissionList, participantId, program.budgetSeats)
        : null;

      setPrograms(prev =>
        prev.map(p =>
          p.id === program.id
            ? { ...p, admissionList, userPosition }
            : p
        )
      );
      showToast('Данные обновлены из Google таблицы!');
    } catch (e) {
      CrashLogger.logError(e as Error, 'Google Sheets Import');
      showToast('Не удалось загрузить данные', 'error');
    }
  };

  // Обновление данных с подсчетом позиций
  const updateProgramWithCalculations = async (program: ProgramWithHistory, admissionList: AdmissionListEntry[]) => {
    const userPosition = participantId
      ? AdmissionCalculator.calculatePosition(admissionList, participantId, program.budgetSeats)
      : null;

    // Сохраняем историю
    if (userPosition) {
      const historyEntry: ProgramHistoryEntry = {
        date: new Date().toISOString(),
        generalPosition: userPosition.generalPosition,
        priorityPosition: userPosition.priorityPosition,
        admissionChance: userPosition.admissionChance,
      };
      await saveProgramHistory(program.id, historyEntry);
    }

    // Обновляем программу в базе
    const updatedProgram = {
      ...program,
      currentRank: userPosition?.generalPosition || 0,
      originalsAbove: 0,
      examScore: 0,
      probability: userPosition?.admissionChance || 0,
    };
    
    await Database.updateProgram(updatedProgram);
    
    setPrograms(prev =>
      prev.map(p =>
        p.id === program.id
          ? { ...p, admissionList, userPosition }
          : p
      )
    );
  };

  // Обновленная функция импорта из Google Sheets
  const handleImportFromGoogleSheetWithCalculations = async (program: ProgramWithHistory) => {
    if (!program || !program.googleSheetUrl) {
      Alert.alert('Ошибка', 'Ссылка на Google таблицу не указана');
      return;
    }
    try {
      let url = program.googleSheetUrl;
      if (url.includes('/edit')) {
        url = url.replace(/\/edit.*$/, '/export?format=tsv');
      } else if (!url.includes('export?format=tsv')) {
        url += '/export?format=tsv';
      }
      const response = await fetch(url);
      const csvData = await response.text();

      const admissionList = AdmissionCalculator.parseAdmissionTable(csvData);
      await updateProgramWithCalculations(program, admissionList);
      
      showToast('Данные обновлены с подсчетом позиций!');
    } catch (e) {
      CrashLogger.logError(e as Error, 'Google Sheets Import with Calculations');
      showToast('Не удалось загрузить данные', 'error');
    }
  };

  const color = (value: number) => {
    return value >= 70 ? '#10B981' : value >= 40 ? '#F59E0B' : '#EF4444';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('universities')}</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowUniversityModal(true)}
        >
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {universities.map((university) => {
          const universityPrograms = programsWithHistory.filter(p => p.universityId === university.id);

          return (
            <View key={university.id} style={styles.universityCard}>
              <View style={styles.universityHeader}>
                <View style={styles.universityInfo}>
                  <Text style={styles.universityName}>{university.name}</Text>
                  {university.url && (
                    <Text style={styles.universityUrl}>{university.url}</Text>
                  )}
                </View>
                <View style={styles.universityActions}>
                  <TouchableOpacity
                    onPress={() => {
                      if (universityPrograms.length === 0) {
                        Alert.alert(t('error'), t('addProgram'));
                        return;
                      }
                      Alert.alert(
                        t('chooseProgram') || 'Выберите направление',
                        '',
                        universityPrograms.map(pr => ({
                          text: pr.name,
                          onPress: () => {
                            if (pr.googleSheetUrl) {
                              handleImportFromGoogleSheetWithCalculations(pr);
                            } else {
                              setImportingProgram(pr);
                              setImportModalVisible(true);
                            }
                          }
                        })).concat({ text: t('cancel'), style: 'cancel' })
                      );
                    }}
                    style={styles.actionButton}
                  >
                    <Text style={{ color: '#3B82F6', fontWeight: 'bold' }}>{t('updateData') || 'Обновить данные'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={async () => {
                      try {
                        const data = {
                          universities: await Database.getUniversities(),
                          programs: await Database.getPrograms(),
                          exportDate: new Date().toISOString()
                        };
                        const jsonData = JSON.stringify(data, null, 2);
                        
                        if (Platform.OS === 'web') {
                          const blob = new Blob([jsonData], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `elidu-export-${new Date().toISOString().split('T')[0]}.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                        } else {
                          await FileSystem.writeAsStringAsync(
                            `${FileSystem.documentDirectory}elidu-export.json`,
                            jsonData
                          );
                          showToast('Данные успешно экспортированы!');
                        }
                      } catch (error) {
                        showToast('Не удалось экспортировать данные', 'error');
                      }
                    }}
                    style={styles.actionButton}
                  >
                    <Text style={{ color: '#10B981', fontWeight: 'bold' }}>Экспорт</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => handleEditUniversity(university)}
                    style={styles.actionButton}
                  >
                    <Edit3 size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => handleDeleteUniversity(university.id)}
                    style={styles.actionButton}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.programsSection}>
                <View style={styles.programsHeader}>
                  <Text style={styles.programsTitle}>{t('programs')} ({universityPrograms.length})</Text>
                  <TouchableOpacity 
                    style={styles.addProgramButton}
                    onPress={() => {
                      setSelectedUniversity(university);
                      setShowProgramModal(true);
                    }}
                  >
                    <Plus size={16} color="#3B82F6" />
                    <Text style={styles.addProgramText}>{t('addProgram')}</Text>
                  </TouchableOpacity>
                </View>

                {universityPrograms.map((program) => (
                  <View key={program.id} style={styles.programItem}>
                    <View style={styles.programContent}>
                      <Text style={styles.programName}>{program.name}</Text>
                      <View style={styles.programMeta}>
                        <Text style={styles.programDetail}>
                          {t('probability')}: {program.userPosition?.admissionChance ?? program.probability}%
                          {'  '}{t('rank')}: {program.userPosition?.generalPosition ?? program.currentRank}
                          {'  '}{t('priority') || 'Приоритет'}: {program.userPosition?.priorityPosition ?? '-'}
                        </Text>
                        {program.history && program.history.length > 1 && (
                          <Text style={{
                            color:
                              program.history[program.history.length - 1].admissionChance >
                              program.history[program.history.length - 2].admissionChance
                                ? '#10B981'
                                : '#EF4444',
                            fontWeight: 'bold',
                          }}>
                            {program.history[program.history.length - 1].admissionChance >
                            program.history[program.history.length - 2].admissionChance
                              ? t('progress') || 'Прогресс'
                              : t('regress') || 'Регресс'}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.programActions}>
                      <TouchableOpacity
                        onPress={() => {
                          setImportingProgram(program);
                          setImportModalVisible(true);
                        }}
                        style={styles.actionButton}
                      >
                        <Text style={{ color: '#3B82F6', fontWeight: 'bold' }}>{t('import')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => handleEditProgram(program)}
                        style={styles.actionButton}
                      >
                        <Edit3 size={14} color={isDark ? '#9CA3AF' : '#6B7280'} />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => handleDeleteProgram(program.id)}
                        style={styles.actionButton}
                      >
                        <Trash2 size={14} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                    {program.googleSheetUrl && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: '#3B82F6',
                          borderRadius: 6,
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          marginTop: 4,
                          alignSelf: 'flex-start'
                        }}
                        onPress={() => handleImportFromGoogleSheetWithCalculations(program)}
                      >
                        <Text style={{ color: 'white', fontWeight: '600' }}>{t('loadData') || 'Подгрузить данные'}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}

                {universityPrograms.length === 0 && (
                  <Text style={styles.noProgramsText}>{t('noProgramsYet')}</Text>
                )}
              </View>
            </View>
          );
        })}

        {universities.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{t('noUniversitiesAdded')}</Text>
            <Text style={styles.emptySubtext}>{t('addFirstUniversity')}</Text>
          </View>
        )}
      </ScrollView>

      {/* University Modal */}
      <Modal
        visible={showUniversityModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => {
                setShowUniversityModal(false);
                resetUniversityForm();
              }}
            >
              <Text style={styles.cancelButton}>{t('cancel')}</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingUniversity ? t('editUniversity') : t('addUniversity')}
            </Text>
            <TouchableOpacity onPress={handleAddUniversity}>
              <Text style={styles.saveButton}>{t('save')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('universityName')} *</Text>
              <TextInput
                style={styles.textInput}
                value={universityForm.name}
                onChangeText={(text) => setUniversityForm(prev => ({ ...prev, name: text }))}
                placeholder={t('universityName')}
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('websiteUrl')} ({t('optional')})</Text>
              <TextInput
                style={styles.textInput}
                value={universityForm.url}
                onChangeText={(text) => setUniversityForm(prev => ({ ...prev, url: text }))}
                placeholder="https://mipt.ru"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                autoCapitalize="none"
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Program Modal */}
      <Modal
        visible={showProgramModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => {
                setShowProgramModal(false);
                resetProgramForm();
                setSelectedUniversity(null);
              }}
            >
              <Text style={styles.cancelButton}>{t('cancel')}</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingProgram ? t('editProgram') : t('addProgram')}
            </Text>
            <TouchableOpacity onPress={handleAddProgram}>
              <Text style={styles.saveButton}>{t('save')}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Название направления *</Text>
              <TextInput
                style={styles.textInput}
                value={programForm.name}
                onChangeText={(text) => setProgramForm(prev => ({ ...prev, name: text }))}
                placeholder="Информатика и вычислительная техника"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Количество бюджетных мест *</Text>
              <TextInput
                style={styles.textInput}
                value={programForm.budgetSeats}
                onChangeText={(text) => setProgramForm(prev => ({ ...prev, budgetSeats: text }))}
                placeholder="25"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Импорт данных (необязательно)</Text>
              <TouchableOpacity 
                style={styles.importButton}
                onPress={() => setShowImportModal(true)}
              >
                <Text style={styles.importButtonText}>Настроить импорт</Text>
              </TouchableOpacity>
              {importUrl && (
                <Text style={styles.importUrlText} numberOfLines={2}>
                  Ссылка: {importUrl}
                </Text>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Модальное окно импорта */}
      <Modal
        visible={importModalVisible}
        animationType="slide"
        onRequestClose={() => setImportModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('importDataForProgram') || 'Импорт данных для направления'}</Text>
            <TouchableOpacity onPress={() => setImportModalVisible(false)}>
              <Text style={styles.cancelButton}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <TextInput
              style={[styles.textInput, { marginBottom: 12 }]}
              value={googleSheetUrl}
              onChangeText={setGoogleSheetUrl}
              placeholder={t('googleSheetUrlPlaceholder') || 'Ссылка на Google таблицу (необязательно)'}
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              autoCapitalize="none"
            />
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: importSource === 'csv' ? '#3B82F6' : '#E5E7EB',
                  padding: 8,
                  borderRadius: 6,
                }}
                onPress={() => setImportSource('csv')}
              >
                <Text style={{ color: importSource === 'csv' ? 'white' : '#111827' }}>CSV</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: importSource === 'html' ? '#3B82F6' : '#E5E7EB',
                  padding: 8,
                  borderRadius: 6,
                }}
                onPress={() => setImportSource('html')}
              >
                <Text style={{ color: importSource === 'html' ? 'white' : '#111827' }}>HTML</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.textInput, { minHeight: 120, marginBottom: 16 }]}
              value={importData}
              onChangeText={setImportData}
              placeholder={
                importSource === 'csv'
                  ? t('pasteCsvTable') || 'Вставьте CSV-таблицу (с заголовками)'
                  : t('pasteHtmlTable') || 'Вставьте HTML таблицу'
              }
              multiline
            />
            <TouchableOpacity
              style={{
                backgroundColor: '#10B981',
                padding: 14,
                borderRadius: 8,
                alignItems: 'center',
              }}
              onPress={handleImportData}
              disabled={!importSource || !importData.trim()}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>{t('import')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: '#10B981',
                padding: 14,
                borderRadius: 8,
                alignItems: 'center',
                marginTop: 8,
              }}
              onPress={async () => {
                if (googleSheetUrl.trim()) {
                  setPrograms(prev =>
                    prev.map(p =>
                      p.id === importingProgram?.id
                        ? { ...p, googleSheetUrl: googleSheetUrl.trim() }
                        : p
                    )
                  );
                  setImportingProgram(importingProgram && { ...importingProgram, googleSheetUrl: googleSheetUrl.trim() });
                  Alert.alert(t('success'), t('googleSheetUrlSaved') || 'Ссылка сохранена');
                }
              }}
              disabled={!googleSheetUrl.trim()}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>{t('saveLink') || 'Сохранить ссылку'}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Import Modal */}
      <Modal
        visible={showImportModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowImportModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowImportModal(false)}>
              <Text style={styles.cancelButton}>Отмена</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Импорт данных</Text>
            <TouchableOpacity onPress={() => {
              setShowImportModal(false);
            }}>
              <Text style={styles.saveButton}>Готово</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ссылка на Google Таблицу</Text>
              <TextInput
                style={[styles.textInput, { minHeight: Math.max(60, 80 * scale) }]}
                value={importUrl}
                onChangeText={setImportUrl}
                placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                multiline
                autoCapitalize="none"
              />
              <Text style={styles.helpText}>
                Вставьте ссылку на публичную Google Таблицу с данными о поступлении
              </Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Или загрузите файл</Text>
              <TouchableOpacity 
                style={styles.fileButton}
                onPress={async () => {
                  try {
                    const result = await DocumentPicker.getDocumentAsync({
                      type: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'],
                      copyToCacheDirectory: true,
                    });
                    if (result.type !== 'cancel') {
                      Alert.alert('Успех', 'Файл выбран для импорта');
                    }
                  } catch (error) {
                    Alert.alert('Ошибка', 'Не удалось выбрать файл');
                  }
                }}
              >
                <Text style={styles.fileButtonText}>Выбрать Excel/LibreOffice файл</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
      
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
    </SafeAreaView>
  );
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const scale = screenWidth / 375;

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#111827' : '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Math.max(16, 20 * scale),
    paddingVertical: Math.max(12, 16 * scale),
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#374151' : '#E5E7EB',
  },
  title: {
    fontSize: Math.max(20, 24 * scale),
    fontWeight: 'bold',
    color: isDark ? '#F9FAFB' : '#111827',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    padding: Math.max(12, 20 * scale),
  },
  universityCard: {
    backgroundColor: isDark ? '#1F2937' : 'white',
    borderRadius: Math.max(8, 12 * scale),
    padding: Math.max(12, 16 * scale),
    marginBottom: Math.max(12, 16 * scale),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  universityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  universityInfo: {
    flex: 1,
  },
  universityName: {
    fontSize: Math.max(16, 18 * scale),
    fontWeight: '600',
    color: isDark ? '#F9FAFB' : '#111827',
    marginBottom: 4,
  },
  universityUrl: {
    fontSize: 14,
    color: '#3B82F6',
  },
  universityActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  programsSection: {
    borderTopWidth: 1,
    borderTopColor: isDark ? '#374151' : '#E5E7EB',
    paddingTop: 16,
  },
  programsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  programsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#F9FAFB' : '#111827',
  },
  addProgramButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  addProgramText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  programItem: {
    flexDirection: isSmallScreen ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: isSmallScreen ? 'flex-start' : 'center',
    paddingVertical: Math.max(6, 8 * scale),
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#374151' : '#F3F4F6',
    gap: isSmallScreen ? 8 : 0,
  },
  programContent: {
    flex: 1,
  },
  programName: {
    fontSize: Math.max(13, 14 * scale),
    fontWeight: '500',
    color: isDark ? '#F9FAFB' : '#111827',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  programMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  programDetail: {
    fontSize: Math.max(11, 12 * scale),
    color: isDark ? '#9CA3AF' : '#6B7280',
    flexWrap: 'wrap',
  },
  probabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: isDark ? '#374151' : '#F3F4F6',
  },
  probabilityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  programActions: {
    flexDirection: 'row',
    gap: Math.max(2, 4 * scale),
    alignSelf: isSmallScreen ? 'flex-end' : 'auto',
  },
  noProgramsText: {
    fontSize: 14,
    color: isDark ? '#6B7280' : '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#9CA3AF' : '#6B7280',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: isDark ? '#6B7280' : '#9CA3AF',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: isDark ? '#111827' : '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#374151' : '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#F9FAFB' : '#111827',
  },
  cancelButton: {
    fontSize: 16,
    color: isDark ? '#9CA3AF' : '#6B7280',
  },
  saveButton: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: Math.max(16, 20 * scale),
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: isDark ? '#F9FAFB' : '#111827',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: isDark ? '#374151' : '#D1D5DB',
    borderRadius: Math.max(6, 8 * scale),
    paddingHorizontal: Math.max(10, 12 * scale),
    paddingVertical: Math.max(10, 12 * scale),
    fontSize: Math.max(14, 16 * scale),
    color: isDark ? '#F9FAFB' : '#111827',
    backgroundColor: isDark ? '#1F2937' : 'white',
    minHeight: Math.max(40, 48 * scale),
  },
  contractTypeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  contractTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: isDark ? '#374151' : '#D1D5DB',
    alignItems: 'center',
  },
  contractTypeButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  contractTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: isDark ? '#D1D5DB' : '#6B7280',
  },
  contractTypeTextActive: {
    color: 'white',
  },
  importButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: Math.max(10, 12 * scale),
    paddingHorizontal: Math.max(16, 20 * scale),
    borderRadius: Math.max(6, 8 * scale),
    alignItems: 'center',
    marginTop: 8,
  },
  importButtonText: {
    color: 'white',
    fontSize: Math.max(14, 16 * scale),
    fontWeight: '600',
  },
  importUrlText: {
    fontSize: Math.max(11, 12 * scale),
    color: '#3B82F6',
    marginTop: 8,
    fontStyle: 'italic',
  },
  fileButton: {
    backgroundColor: isDark ? '#374151' : '#F3F4F6',
    paddingVertical: Math.max(12, 16 * scale),
    paddingHorizontal: Math.max(16, 20 * scale),
    borderRadius: Math.max(6, 8 * scale),
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#10B981',
    borderStyle: 'dashed',
  },
  fileButtonText: {
    color: '#10B981',
    fontSize: Math.max(14, 16 * scale),
    fontWeight: '600',
  },
  helpText: {
    fontSize: Math.max(11, 12 * scale),
    color: isDark ? '#9CA3AF' : '#6B7280',
    marginTop: 8,
    lineHeight: Math.max(16, 18 * scale),
  },
});