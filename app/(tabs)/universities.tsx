import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, CreditCard as Edit3, Trash2, ExternalLink } from 'lucide-react-native';
import { mockData } from '../../services/mockData';

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

export default function UniversitiesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [universities, setUniversities] = useState<University[]>(mockData.universities);
  const [programs, setPrograms] = useState<Program[]>(mockData.programs);
  const [showUniversityModal, setShowUniversityModal] = useState(false);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  const [universityForm, setUniversityForm] = useState({
    name: '',
    url: '',
  });

  const [programForm, setProgramForm] = useState({
    name: '',
    budgetSeats: '',
    passingScore: '',
    contractType: 'budget' as 'budget' | 'contract' | 'quota',
    currentRank: '',
    originalsAbove: '',
    examScore: '',
  });

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
      passingScore: '',
      contractType: 'budget',
      currentRank: '',
      originalsAbove: '',
      examScore: '',
    });
    setEditingProgram(null);
  };

  const handleAddUniversity = () => {
    if (!universityForm.name.trim()) {
      Alert.alert('Error', 'Please enter university name');
      return;
    }

    if (editingUniversity) {
      setUniversities(prev => prev.map(u => 
        u.id === editingUniversity.id 
          ? { ...u, ...universityForm }
          : u
      ));
    } else {
      const newUniversity: University = {
        id: Date.now().toString(),
        name: universityForm.name,
        url: universityForm.url,
      };
      setUniversities(prev => [...prev, newUniversity]);
    }

    resetUniversityForm();
    setShowUniversityModal(false);
  };

  const handleAddProgram = () => {
    if (!programForm.name.trim() || !programForm.budgetSeats || !programForm.currentRank) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!selectedUniversity) {
      Alert.alert('Error', 'Please select a university first');
      return;
    }

    const budgetSeats = parseInt(programForm.budgetSeats);
    const currentRank = parseInt(programForm.currentRank);
    const originalsAbove = parseInt(programForm.originalsAbove) || 0;
    const examScore = parseInt(programForm.examScore) || 0;

    const probability = calculateProbability(currentRank, originalsAbove, budgetSeats);

    if (editingProgram) {
      setPrograms(prev => prev.map(p => 
        p.id === editingProgram.id 
          ? {
              ...p,
              name: programForm.name,
              budgetSeats,
              passingScore: programForm.passingScore ? parseInt(programForm.passingScore) : undefined,
              contractType: programForm.contractType,
              currentRank,
              originalsAbove,
              examScore,
              probability,
            }
          : p
      ));
    } else {
      const newProgram: Program = {
        id: Date.now().toString(),
        universityId: selectedUniversity.id,
        name: programForm.name,
        budgetSeats,
        passingScore: programForm.passingScore ? parseInt(programForm.passingScore) : undefined,
        contractType: programForm.contractType,
        currentRank,
        originalsAbove,
        examScore,
        probability,
      };
      setPrograms(prev => [...prev, newProgram]);
    }

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
      passingScore: program.passingScore?.toString() || '',
      contractType: program.contractType,
      currentRank: program.currentRank.toString(),
      originalsAbove: program.originalsAbove.toString(),
      examScore: program.examScore.toString(),
    });
    setSelectedUniversity(universities.find(u => u.id === program.universityId) || null);
    setShowProgramModal(true);
  };

  const handleDeleteUniversity = (universityId: string) => {
    Alert.alert(
      'Delete University',
      'This will also delete all associated programs. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setUniversities(prev => prev.filter(u => u.id !== universityId));
            setPrograms(prev => prev.filter(p => p.universityId !== universityId));
          },
        },
      ]
    );
  };

  const handleDeleteProgram = (programId: string) => {
    Alert.alert(
      'Delete Program',
      'Are you sure you want to delete this program?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setPrograms(prev => prev.filter(p => p.id !== programId));
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Universities</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowUniversityModal(true)}
        >
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {universities.map((university) => {
          const universityPrograms = programs.filter(p => p.universityId === university.id);
          
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
                  <Text style={styles.programsTitle}>Programs ({universityPrograms.length})</Text>
                  <TouchableOpacity 
                    style={styles.addProgramButton}
                    onPress={() => {
                      setSelectedUniversity(university);
                      setShowProgramModal(true);
                    }}
                  >
                    <Plus size={16} color="#3B82F6" />
                    <Text style={styles.addProgramText}>Add Program</Text>
                  </TouchableOpacity>
                </View>

                {universityPrograms.map((program) => (
                  <View key={program.id} style={styles.programItem}>
                    <View style={styles.programContent}>
                      <Text style={styles.programName}>{program.name}</Text>
                      <View style={styles.programMeta}>
                        <Text style={styles.programDetail}>
                          Rank: {program.currentRank} | Seats: {program.budgetSeats}
                        </Text>
                        <View style={styles.probabilityBadge}>
                          <Text style={[
                            styles.probabilityText,
                            {
                              color: program.probability >= 70 ? '#10B981' : 
                                     program.probability >= 40 ? '#F59E0B' : '#EF4444'
                            }
                          ]}>
                            {program.probability}%
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.programActions}>
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
                  </View>
                ))}

                {universityPrograms.length === 0 && (
                  <Text style={styles.noProgramsText}>No programs added yet</Text>
                )}
              </View>
            </View>
          );
        })}

        {universities.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No universities added yet</Text>
            <Text style={styles.emptySubtext}>Add your first university to start tracking programs</Text>
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
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingUniversity ? 'Edit University' : 'Add University'}
            </Text>
            <TouchableOpacity onPress={handleAddUniversity}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>University Name *</Text>
              <TextInput
                style={styles.textInput}
                value={universityForm.name}
                onChangeText={(text) => setUniversityForm(prev => ({ ...prev, name: text }))}
                placeholder="e.g., Moscow Institute of Physics and Technology"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Website URL (optional)</Text>
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
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingProgram ? 'Edit Program' : 'Add Program'}
            </Text>
            <TouchableOpacity onPress={handleAddProgram}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Program Name *</Text>
              <TextInput
                style={styles.textInput}
                value={programForm.name}
                onChangeText={(text) => setProgramForm(prev => ({ ...prev, name: text }))}
                placeholder="e.g., Applied Mathematics"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Budget Seats *</Text>
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
              <Text style={styles.inputLabel}>Current Rank *</Text>
              <TextInput
                style={styles.textInput}
                value={programForm.currentRank}
                onChangeText={(text) => setProgramForm(prev => ({ ...prev, currentRank: text }))}
                placeholder="22"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Originals Above *</Text>
              <TextInput
                style={styles.textInput}
                value={programForm.originalsAbove}
                onChangeText={(text) => setProgramForm(prev => ({ ...prev, originalsAbove: text }))}
                placeholder="18"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Your Exam Score *</Text>
              <TextInput
                style={styles.textInput}
                value={programForm.examScore}
                onChangeText={(text) => setProgramForm(prev => ({ ...prev, examScore: text }))}
                placeholder="285"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Passing Score (optional)</Text>
              <TextInput
                style={styles.textInput}
                value={programForm.passingScore}
                onChangeText={(text) => setProgramForm(prev => ({ ...prev, passingScore: text }))}
                placeholder="250"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Contract Type</Text>
              <View style={styles.contractTypeContainer}>
                {(['budget', 'contract', 'quota'] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.contractTypeButton,
                      programForm.contractType === type && styles.contractTypeButtonActive
                    ]}
                    onPress={() => setProgramForm(prev => ({ ...prev, contractType: type }))}
                  >
                    <Text style={[
                      styles.contractTypeText,
                      programForm.contractType === type && styles.contractTypeTextActive
                    ]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  addButton: {
    backgroundColor: '#3B82F6',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    padding: 20,
  },
  universityCard: {
    backgroundColor: isDark ? '#1F2937' : 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
    fontSize: 18,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#374151' : '#F3F4F6',
  },
  programContent: {
    flex: 1,
  },
  programName: {
    fontSize: 14,
    fontWeight: '500',
    color: isDark ? '#F9FAFB' : '#111827',
    marginBottom: 4,
  },
  programMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  programDetail: {
    fontSize: 12,
    color: isDark ? '#9CA3AF' : '#6B7280',
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
    gap: 4,
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
    padding: 20,
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
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: isDark ? '#F9FAFB' : '#111827',
    backgroundColor: isDark ? '#1F2937' : 'white',
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
});