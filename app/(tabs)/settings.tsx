import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Moon, Sun, Download, Bell, Info, Trash2, ChevronRight, Shield, Globe, LogOut, User, CreditCard as Edit3 } from 'lucide-react-native';
import { t } from '../../services/i18n';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';
import { AuthService } from '../../services/auth';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { currentLanguage, changeLanguage } = useLanguage();
  const { user, signOut } = useAuth();
  
  const [darkMode, setDarkMode] = useState(isDark);
  const [notifications, setNotifications] = useState(true);
  const [dailyUpdates, setDailyUpdates] = useState(false);
  const [showParticipantIdModal, setShowParticipantIdModal] = useState(false);
  const [participantIdInput, setParticipantIdInput] = useState(user?.participantId || '');
  
  const styles = createStyles(isDark);

  const handleUpdateParticipantId = async () => {
    try {
      await AuthService.updateParticipantId(participantIdInput);
      Alert.alert(t('success'), 'ID участника обновлен');
      setShowParticipantIdModal(false);
    } catch (error) {
      Alert.alert(t('error'), 'Не удалось обновить ID участника');
    }
  };

  const handleExportData = () => {
    Alert.alert(
      t('exportData'),
      t('exportDataDesc'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('exportData'), onPress: () => {
          Alert.alert(t('success'), 'Data exported successfully!');
        }}
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      t('clearAllData'),
      t('clearAllDataConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('clearAllData'), 
          style: 'destructive',
          onPress: () => {
            Alert.alert(t('success'), 'All data has been cleared');
          }
        }
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      t('about'),
      'University Admission Tracker v1.0.0\n\nHelps you track your chances of admission to universities by monitoring your rank position and calculating probability based on available seats and applicants with original documents.'
    );
  };

  const handleLanguageChange = () => {
    Alert.alert(
      t('language'),
      t('languageDesc'),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: 'English', 
          onPress: () => changeLanguage('en'),
          style: currentLanguage === 'en' ? 'default' : 'default'
        },
        { 
          text: 'Русский', 
          onPress: () => changeLanguage('ru'),
          style: currentLanguage === 'ru' ? 'default' : 'default'
        }
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      t('signOut'),
      'Are you sure you want to sign out?',
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('signOut'), 
          style: 'destructive',
          onPress: signOut
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{t('settings')}</Text>
          {user && (
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          )}
        </View>
      </View>
              {user.participantId && (
                <Text style={styles.participantId}>
                  ID участника: {user.participantId}
                </Text>
              )}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Профиль</Text>
          
          <TouchableOpacity 
            style={styles.actionItem} 
            onPress={() => {
              setParticipantIdInput(user?.participantId || '');
              setShowParticipantIdModal(true);
            }}
          >
            <View style={styles.settingInfo}>
              <User size={20} color={isDark ? '#F9FAFB' : '#111827'} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>ID участника</Text>
                <Text style={styles.settingDescription}>
                  {user?.participantId || 'Не указан'}
                </Text>
              </View>
            </View>
            <Edit3 size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
        </View>

        {/* Language Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('language')}</Text>
          
          <TouchableOpacity style={styles.actionItem} onPress={handleLanguageChange}>
            <View style={styles.settingInfo}>
              <Globe size={20} color={isDark ? '#F9FAFB' : '#111827'} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>{t('language')}</Text>
                <Text style={styles.settingDescription}>
                  {currentLanguage === 'ru' ? 'Русский' : 'English'}
                </Text>
              </View>
            </View>
            <ChevronRight size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('appearance')}</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              {isDark ? (
                <Moon size={20} color={isDark ? '#F9FAFB' : '#111827'} />
              ) : (
                <Sun size={20} color={isDark ? '#F9FAFB' : '#111827'} />
              )}
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>{t('darkMode')}</Text>
                <Text style={styles.settingDescription}>
                  {t('darkModeDesc')}
                </Text>
              </View>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
              thumbColor={darkMode ? '#ffffff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('notifications')}</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Bell size={20} color={isDark ? '#F9FAFB' : '#111827'} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>{t('pushNotifications')}</Text>
                <Text style={styles.settingDescription}>
                  {t('pushNotificationsDesc')}
                </Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
              thumbColor={notifications ? '#ffffff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Shield size={20} color={isDark ? '#F9FAFB' : '#111827'} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>{t('dailyUpdates')}</Text>
                <Text style={styles.settingDescription}>
                  {t('dailyUpdatesDesc')}
                </Text>
              </View>
            </View>
            <Switch
              value={dailyUpdates}
              onValueChange={setDailyUpdates}
              trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
              thumbColor={dailyUpdates ? '#ffffff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('dataManagement')}</Text>
          
          <TouchableOpacity style={styles.actionItem} onPress={handleExportData}>
            <View style={styles.settingInfo}>
              <Download size={20} color="#10B981" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>{t('exportDataSettings')}</Text>
                <Text style={styles.settingDescription}>
                  {t('exportDataSettingsDesc')}
                </Text>
              </View>
            </View>
            <ChevronRight size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={handleClearData}>
            <View style={styles.settingInfo}>
              <Trash2 size={20} color="#EF4444" />
              <View style={styles.settingText}>
                <Text style={[styles.settingLabel, { color: '#EF4444' }]}>{t('clearAllData')}</Text>
                <Text style={styles.settingDescription}>
                  {t('clearAllDataDesc')}
                </Text>
              </View>
            </View>
            <ChevronRight size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('about')}</Text>
          
          <TouchableOpacity style={styles.actionItem} onPress={handleAbout}>
            <View style={styles.settingInfo}>
              <Info size={20} color={isDark ? '#F9FAFB' : '#111827'} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>{t('aboutApp')}</Text>
                <Text style={styles.settingDescription}>
                  {t('aboutAppDesc')}
                </Text>
              </View>
            </View>
            <ChevronRight size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        {user && !user.isGuest && (
          <View style={styles.section}>
            <TouchableOpacity style={styles.actionItem} onPress={handleSignOut}>
              <View style={styles.settingInfo}>
                <LogOut size={20} color="#EF4444" />
                <View style={styles.settingText}>
                  <Text style={[styles.settingLabel, { color: '#EF4444' }]}>{t('signOut')}</Text>
                  <Text style={styles.settingDescription}>
                    Выйти из аккаунта Google
                  </Text>
                </View>
              </View>
              <ChevronRight size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Participant ID Modal */}
      <Modal
        visible={showParticipantIdModal}
        animationType="slide"
        presentationStyle="pageSheet"
        transparent={false}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => {
                setShowParticipantIdModal(false);
                setParticipantIdInput(user?.participantId || '');
              }}
            >
              <Text style={styles.cancelButton}>Отмена</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>ID участника</Text>
            <TouchableOpacity onPress={handleUpdateParticipantId}>
              <Text style={styles.saveButton}>Сохранить</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>ID участника</Text>
              <Text style={styles.inputDescription}>
                Укажите ваш уникальный ID участника для автоматического отслеживания позиции в списках поступления
              </Text>
              <TextInput
                style={styles.textInput}
                value={participantIdInput}
                onChangeText={setParticipantIdInput}
                placeholder="Введите ID участника"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                autoCapitalize="none"
              />
            </View>
          </View>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#374151' : '#E5E7EB',
  },
  headerContent: {
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDark ? '#F9FAFB' : '#111827',
  },
  userInfo: {
    gap: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#D1D5DB' : '#4B5563',
  },
  userEmail: {
    fontSize: 14,
    color: isDark ? '#9CA3AF' : '#6B7280',
  },
  participantId: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  scrollContainer: {
    padding: 20,
  },
  section: {
    backgroundColor: isDark ? '#1F2937' : 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#F9FAFB' : '#111827',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#374151' : '#F3F4F6',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: isDark ? '#F9FAFB' : '#111827',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: isDark ? '#9CA3AF' : '#6B7280',
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
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#F9FAFB' : '#111827',
  },
  inputDescription: {
    fontSize: 14,
    color: isDark ? '#9CA3AF' : '#6B7280',
    lineHeight: 20,
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
    marginTop: 8,
  },
});