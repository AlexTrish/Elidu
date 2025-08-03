import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch, Alert, useColorScheme, Modal, TextInput, Animated, Platform, Appearance, Dimensions } from 'react-native';
import { Toast } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Moon, Sun, Download, Bell, Info, Trash2, ChevronRight, Shield, Globe, LogOut, User, CreditCard as Edit3, FileText } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import { t } from '../../services/i18n';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';
import { AuthService } from '../../services/auth';
import { CrashLogger } from '../../services/crashLogger';

export default function SettingsScreen() {
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  const { currentLanguage, changeLanguage } = useLanguage();
  const { user, signOut } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const [darkMode, setDarkMode] = useState(systemColorScheme === 'dark');
  const [themeMode, setThemeMode] = useState<'system' | 'light' | 'dark'>('system');
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [dailyUpdates, setDailyUpdates] = useState(false);
  const [showParticipantIdModal, setShowParticipantIdModal] = useState(false);
  const [participantIdInput, setParticipantIdInput] = useState(user?.participantId || '');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showCrashLogModal, setShowCrashLogModal] = useState(false);
  const [crashLog, setCrashLog] = useState('');
  const styles = createStyles(isDark);

  useEffect(() => {
    if (themeMode === 'system') {
      setDarkMode(systemColorScheme === 'dark');
    } else {
      setDarkMode(themeMode === 'dark');
    }
  }, [themeMode, systemColorScheme]);

  const handleUpdateParticipantId = async () => {
    try {
      await AuthService.updateParticipantId(participantIdInput);
      showToast('ID участника обновлен');
      setShowParticipantIdModal(false);
    } catch (error) {
      showToast('Не удалось обновить ID участника', 'error');
    }
  };

  const handleExportData = () => {
    Alert.alert(
      t('exportData'),
      t('exportDataDesc'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('exportData'), onPress: () => {
          showToast('Данные успешно экспортированы!');
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
          onPress: async () => {
            await AuthService.signOut();
            Alert.alert(t('success'), 'All data has been cleared');
          }
        }
      ]
    );
  };

  const handleAbout = () => {
    setShowAboutModal(true);
  };

  const handleViewCrashLog = async () => {
    const log = await CrashLogger.getCrashLog();
    setCrashLog(log);
    setShowCrashLogModal(true);
  };

  const handleClearCrashLog = async () => {
    await CrashLogger.clearCrashLog();
    setCrashLog('');
    showToast('Лог ошибок очищен');
  };

  const handleFileImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'],
        copyToCacheDirectory: true,
      });
      if (result.type !== 'cancel') {
        showToast('Файл выбран для импорта');
      }
    } catch (error) {
      showToast('Не удалось выбрать файл', 'error');
    }
  };

  const handleLanguageChange = () => {
    setShowLanguageModal(true);
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

  // Appearance switch (mock, not system-wide)
  const handleDarkModeSwitch = (value: boolean) => {
    setDarkMode(value);
    // Optionally, persist to AsyncStorage or context
  };

  // Notifications switch (mock)
  const handleNotificationsSwitch = (value: boolean) => {
    setNotifications(value);
    // Optionally, persist to AsyncStorage or context
  };

  const handleDailyUpdatesSwitch = (value: boolean) => {
    setDailyUpdates(value);
    // Optionally, persist to AsyncStorage or context
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
      {user?.participantId && (
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
          <TouchableOpacity style={styles.settingItem} onPress={() => setShowThemeModal(true)}>
            <View style={styles.settingInfo}>
              <Sun size={20} color={darkMode ? '#F9FAFB' : '#111827'} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>{t('darkMode')}</Text>
                <Text style={styles.settingDescription}>
                  {t('darkModeDesc')}
                </Text>
              </View>
            </View>
            <View style={{
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 6,
              backgroundColor: darkMode ? '#374151' : '#F3F4F6',
            }}>
              <Text style={{
                color: darkMode ? '#F9FAFB' : '#111827',
                fontWeight: '600'
              }}>
                {themeMode === 'system' ? 'System' : themeMode === 'light' ? 'Light' : 'Dark'}
              </Text>
            </View>
          </TouchableOpacity>
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
              onValueChange={handleNotificationsSwitch}
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
              onValueChange={handleDailyUpdatesSwitch}
              trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
              thumbColor={dailyUpdates ? '#ffffff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('dataManagement')}</Text>
          <TouchableOpacity style={styles.actionItem} onPress={handleViewCrashLog}>
            <View style={styles.settingInfo}>
              <FileText size={20} color="#8B5CF6" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Лог ошибок</Text>
                <Text style={styles.settingDescription}>
                  Просмотр и очистка логов ошибок приложения
                </Text>
              </View>
            </View>
            <ChevronRight size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
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
        presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
        transparent={false}
        onRequestClose={() => setShowParticipantIdModal(false)}
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

      {/* Language Modal */}
      <Modal
        visible={showLanguageModal}
        animationType="none"
        transparent={true}
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <AnimatedLanguageModal
            isDark={isDark}
            currentLanguage={currentLanguage}
            changeLanguage={changeLanguage}
            setShowLanguageModal={setShowLanguageModal}
            t={t}
          />
        </View>
      </Modal>

      {/* About Modal */}
      <Modal
        visible={showAboutModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowAboutModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: isDark ? '#1F2937' : 'white',
            borderRadius: 16,
            padding: 24,
            minWidth: 280,
            alignItems: 'center'
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: isDark ? '#F9FAFB' : '#111827',
              marginBottom: 12
            }}>
              {t('aboutApp')}
            </Text>
            <Text style={{
              fontSize: 14,
              color: isDark ? '#9CA3AF' : '#6B7280',
              marginBottom: 16,
              textAlign: 'center'
            }}>
              {t('aboutAppDesc')}
            </Text>
            <Text style={{
              fontSize: 14,
              color: isDark ? '#F9FAFB' : '#111827',
              marginBottom: 8,
              textAlign: 'center'
            }}>
              University Admission Tracker v1.0.0
            </Text>
            <TouchableOpacity
              style={{ marginTop: 12 }}
              onPress={() => setShowAboutModal(false)}
            >
              <Text style={{
                color: '#EF4444',
                fontWeight: '500',
                fontSize: 16
              }}>
                {t('cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Theme Modal (dropdown style) */}
      <Modal
        visible={showThemeModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowThemeModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: darkMode ? '#1F2937' : 'white',
            borderRadius: 16,
            padding: 24,
            minWidth: 220,
            alignItems: 'center'
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: darkMode ? '#F9FAFB' : '#111827',
              marginBottom: 16
            }}>
              {t('appearance')}
            </Text>
            <TouchableOpacity
              style={{
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 8,
                backgroundColor: themeMode === 'system' ? '#3B82F6' : (darkMode ? '#374151' : '#F3F4F6'),
                marginBottom: 8,
                width: 160,
                alignItems: 'center'
              }}
              onPress={() => {
                setThemeMode('system');
                setShowThemeModal(false);
              }}
            >
              <Text style={{
                color: themeMode === 'system' ? 'white' : (darkMode ? '#F9FAFB' : '#111827'),
                fontWeight: '600'
              }}>
                System
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 8,
                backgroundColor: themeMode === 'light' ? '#3B82F6' : (darkMode ? '#374151' : '#F3F4F6'),
                marginBottom: 8,
                width: 160,
                alignItems: 'center'
              }}
              onPress={() => {
                setThemeMode('light');
                setShowThemeModal(false);
              }}
            >
              <Text style={{
                color: themeMode === 'light' ? 'white' : (darkMode ? '#F9FAFB' : '#111827'),
                fontWeight: '600'
              }}>
                Light
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 8,
                backgroundColor: themeMode === 'dark' ? '#3B82F6' : (darkMode ? '#374151' : '#F3F4F6'),
                width: 160,
                alignItems: 'center'
              }}
              onPress={() => {
                setThemeMode('dark');
                setShowThemeModal(false);
              }}
            >
              <Text style={{
                color: themeMode === 'dark' ? 'white' : (darkMode ? '#F9FAFB' : '#111827'),
                fontWeight: '600'
              }}>
                Dark
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: 16 }}
              onPress={() => setShowThemeModal(false)}
            >
              <Text style={{
                color: '#EF4444',
                fontWeight: '500',
                fontSize: 16
              }}>
                {t('cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Crash Log Modal */}
      <Modal
        visible={showCrashLogModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCrashLogModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCrashLogModal(false)}>
              <Text style={styles.cancelButton}>Закрыть</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Лог ошибок</Text>
            <TouchableOpacity onPress={handleClearCrashLog}>
              <Text style={[styles.saveButton, { color: '#EF4444' }]}>Очистить</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <Text style={[styles.crashLogText, { color: isDark ? '#F9FAFB' : '#111827' }]}>
              {crashLog}
            </Text>
          </ScrollView>
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

const { width: screenWidth } = Dimensions.get('window');
const scale = screenWidth / 375;
const isSmallScreen = screenWidth < 375;

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
    padding: Math.max(12, 20 * scale),
  },
  section: {
    backgroundColor: isDark ? '#1F2937' : 'white',
    borderRadius: Math.max(8, 12 * scale),
    padding: Math.max(12, 20 * scale),
    marginBottom: Math.max(12, 16 * scale),
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
    paddingVertical: Math.max(2, 4 * scale),
    minHeight: Math.max(44, 48 * scale),
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Math.max(6, 8 * scale),
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#374151' : '#F3F4F6',
    minHeight: Math.max(44, 48 * scale),
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
    fontSize: Math.max(14, 16 * scale),
    fontWeight: '500',
    color: isDark ? '#F9FAFB' : '#111827',
    marginBottom: 2,
    flexWrap: 'wrap',
  },
  settingDescription: {
    fontSize: Math.max(11, 12 * scale),
    color: isDark ? '#9CA3AF' : '#6B7280',
    flexWrap: 'wrap',
    lineHeight: Math.max(16, 18 * scale),
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
    borderRadius: Math.max(6, 8 * scale),
    paddingHorizontal: Math.max(10, 12 * scale),
    paddingVertical: Math.max(10, 12 * scale),
    fontSize: Math.max(14, 16 * scale),
    color: isDark ? '#F9FAFB' : '#111827',
    backgroundColor: isDark ? '#1F2937' : 'white',
    marginTop: 8,
    minHeight: Math.max(40, 48 * scale),
  },
  crashLogText: {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 16,
    padding: 16,
  },
});

function AnimatedLanguageModal({ isDark, currentLanguage, changeLanguage, setShowLanguageModal, t }: any) {
  const scale = useRef(new Animated.Value(0.7)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{
      backgroundColor: isDark ? '#1F2937' : 'white',
      borderRadius: 16,
      padding: 24,
      minWidth: 250,
      alignItems: 'center',
      opacity,
      transform: [{ scale }],
    }}>
      <Text style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: isDark ? '#F9FAFB' : '#111827',
        marginBottom: 16
      }}>
        {t('language')}
      </Text>
      <TouchableOpacity
        style={{
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 8,
          backgroundColor: currentLanguage === 'en' ? '#3B82F6' : (isDark ? '#374151' : '#F3F4F6'),
          marginBottom: 8,
          width: 180,
          alignItems: 'center'
        }}
        onPress={() => {
          changeLanguage('en');
          setShowLanguageModal(false);
        }}
      >
        <Text style={{
          color: currentLanguage === 'en' ? 'white' : (isDark ? '#F9FAFB' : '#111827'),
          fontWeight: '600'
        }}>
          English
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 8,
          backgroundColor: currentLanguage === 'ru' ? '#3B82F6' : (isDark ? '#374151' : '#F3F4F6'),
          width: 180,
          alignItems: 'center'
        }}
        onPress={() => {
          changeLanguage('ru');
          setShowLanguageModal(false);
        }}
      >
        <Text style={{
          color: currentLanguage === 'ru' ? 'white' : (isDark ? '#F9FAFB' : '#111827'),
          fontWeight: '600'
        }}>
          Русский
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ marginTop: 16 }}
        onPress={() => setShowLanguageModal(false)}
      >
        <Text style={{
          color: '#EF4444',
          fontWeight: '500',
          fontSize: 16
        }}>
          {t('cancel')}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}