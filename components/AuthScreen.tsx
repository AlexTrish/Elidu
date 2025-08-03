import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogIn, UserCheck } from 'lucide-react-native';
import { useGoogleAuth, AuthService } from '../services/auth';
import { t } from '../services/i18n';
import { useState } from 'react';

export function AuthScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { signInWithGoogle } = useGoogleAuth();
  const [participantId, setParticipantId] = useState('');
  
  const styles = createStyles(isDark);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in failed:', error);
      Alert.alert('Ошибка', 'Не удалось войти через Google');
    }
  };

  const handleGuestMode = async () => {
    try {
      await AuthService.continueAsGuest(participantId || undefined);
    } catch (error) {
      console.error('Guest mode failed:', error);
      Alert.alert('Ошибка', 'Не удалось войти в гостевом режиме');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <LogIn size={64} color="#3B82F6" />
          </View>
          <Text style={styles.title}>{t('admissionTracker')}</Text>
          <Text style={styles.subtitle}>{t('signInToSync')}</Text>
        </View>

        <View style={styles.authSection}>
          <View style={styles.guestSection}>
            <Text style={styles.guestTitle}>Войти без регистрации</Text>
            <Text style={styles.guestDescription}>
              Вы можете использовать приложение без авторизации. Опционально укажите ваш ID участника для автоматического отслеживания позиции.
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>ID участника (необязательно)</Text>
              <TextInput
                style={styles.textInput}
                value={participantId}
                onChangeText={setParticipantId}
                placeholder="Введите ваш ID участника"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              />
            </View>

            <TouchableOpacity style={styles.guestButton} onPress={handleGuestMode}>
              <UserCheck size={20} color="white" />
              <Text style={styles.guestButtonText}>Продолжить как гость</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>или</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleButton} onPress={handleSignIn}>
            <View style={styles.googleIcon}>
              <Text style={styles.googleIconText}>G</Text>
            </View>
            <Text style={styles.googleButtonText}>{t('signInWithGoogle')}</Text>
          </TouchableOpacity>
          
          <Text style={styles.disclaimer}>
            Авторизация через Google позволяет синхронизировать данные между устройствами
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#111827' : '#F9FAFB',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: isDark ? '#1F2937' : 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: isDark ? '#F9FAFB' : '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: isDark ? '#9CA3AF' : '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  authSection: {
    gap: 16,
  },
  guestSection: {
    gap: 16,
  },
  guestTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#F9FAFB' : '#111827',
    textAlign: 'center',
  },
  guestDescription: {
    fontSize: 14,
    color: isDark ? '#9CA3AF' : '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: isDark ? '#F9FAFB' : '#111827',
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
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  guestButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: isDark ? '#374151' : '#E5E7EB',
  },
  dividerText: {
    fontSize: 14,
    color: isDark ? '#6B7280' : '#9CA3AF',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDark ? '#1F2937' : 'white',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: isDark ? '#374151' : '#E5E7EB',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIconText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#F9FAFB' : '#111827',
  },
  disclaimer: {
    fontSize: 14,
    color: isDark ? '#6B7280' : '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});