import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, setLanguage, getCurrentLanguage } from '../services/i18n';

const LANGUAGE_STORAGE_KEY = '@admission_tracker_language';

export const useLanguage = () => {
  const [currentLang, setCurrentLang] = useState<Language>(getCurrentLanguage());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ru')) {
        setLanguage(savedLanguage as Language);
        setCurrentLang(savedLanguage as Language);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = async (language: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      setLanguage(language);
      setCurrentLang(language);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  return {
    currentLanguage: currentLang,
    changeLanguage,
    isLoading,
  };
};