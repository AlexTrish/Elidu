export interface Translations {
  // Navigation
  home: string;
  universities: string;
  stats: string;
  import: string;
  settings: string;
  
  // Home Screen
  admissionTracker: string;
  trackYourChances: string;
  programs: string;
  avgChance: string;
  highChance: string;
  recentPrograms: string;
  add: string;
  rank: string;
  seats: string;
  score: string;
  noProgramsAdded: string;
  addFirstProgram: string;
  
  // Universities Screen
  editUniversity: string;
  addUniversity: string;
  deleteUniversity: string;
  deleteUniversityConfirm: string;
  universityName: string;
  websiteUrl: string;
  optional: string;
  programName: string;
  budgetSeats: string;
  currentRank: string;
  originalsAbove: string;
  yourExamScore: string;
  passingScore: string;
  contractType: string;
  budget: string;
  contract: string;
  quota: string;
  addProgram: string;
  editProgram: string;
  deleteProgram: string;
  deleteProgramConfirm: string;
  noProgramsYet: string;
  noUniversitiesAdded: string;
  addFirstUniversity: string;
  
  // Statistics Screen
  statistics: string;
  averageChance: string;
  highProbability: string;
  probabilityDistribution: string;
  high: string;
  medium: string;
  low: string;
  programDetails: string;
  availableSeats: string;
  probability: string;
  vsLastUpdate: string;
  noStatisticsAvailable: string;
  addProgramsToSeeStats: string;
  
  // Import Screen
  importExport: string;
  importFromWeb: string;
  importFromFile: string;
  exportData: string;
  importFromWebDesc: string;
  importFromFileDesc: string;
  exportDataDesc: string;
  importing: string;
  chooseFile: string;
  csvXlsxSupported: string;
  exportToCsv: string;
  expectedCsvFormat: string;
  importInstructions: string;
  importCompleted: string;
  importFailed: string;
  
  // Settings Screen
  appearance: string;
  darkMode: string;
  darkModeDesc: string;
  notifications: string;
  pushNotifications: string;
  pushNotificationsDesc: string;
  dailyUpdates: string;
  dailyUpdatesDesc: string;
  dataManagement: string;
  exportDataSettings: string;
  exportDataSettingsDesc: string;
  clearAllData: string;
  clearAllDataDesc: string;
  clearAllDataConfirm: string;
  about: string;
  aboutApp: string;
  aboutAppDesc: string;
  language: string;
  languageDesc: string;
  
  // Auth
  signIn: string;
  signOut: string;
  signInWithGoogle: string;
  welcome: string;
  pleaseSignIn: string;
  signInToSync: string;
  
  // Common
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  error: string;
  success: string;
  loading: string;
  yes: string;
  no: string;
  ok: string;
}

export const translations: Record<'en' | 'ru', Translations> = {
  en: {
    // Navigation
    home: 'Home',
    universities: 'Universities',
    stats: 'Stats',
    import: 'Import',
    settings: 'Settings',
    
    // Home Screen
    admissionTracker: 'Admission Tracker',
    trackYourChances: 'Track your university admission chances',
    programs: 'Programs',
    avgChance: 'Avg. Chance',
    highChance: 'High Chance',
    recentPrograms: 'Recent Programs',
    add: 'Add',
    rank: 'Rank',
    seats: 'Seats',
    score: 'Score',
    noProgramsAdded: 'No programs added yet',
    addFirstProgram: 'Add your first university program to start tracking',
    
    // Universities Screen
    editUniversity: 'Edit University',
    addUniversity: 'Add University',
    deleteUniversity: 'Delete University',
    deleteUniversityConfirm: 'This will also delete all associated programs. Are you sure?',
    universityName: 'University Name',
    websiteUrl: 'Website URL',
    optional: 'optional',
    programName: 'Program Name',
    budgetSeats: 'Budget Seats',
    currentRank: 'Current Rank',
    originalsAbove: 'Originals Above',
    yourExamScore: 'Your Exam Score',
    passingScore: 'Passing Score',
    contractType: 'Contract Type',
    budget: 'Budget',
    contract: 'Contract',
    quota: 'Quota',
    addProgram: 'Add Program',
    editProgram: 'Edit Program',
    deleteProgram: 'Delete Program',
    deleteProgramConfirm: 'Are you sure you want to delete this program?',
    noProgramsYet: 'No programs added yet',
    noUniversitiesAdded: 'No universities added yet',
    addFirstUniversity: 'Add your first university to start tracking programs',
    
    // Statistics Screen
    statistics: 'Statistics',
    averageChance: 'Average Chance',
    highProbability: 'High Probability',
    probabilityDistribution: 'Probability Distribution',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    programDetails: 'Program Details',
    availableSeats: 'Available Seats',
    probability: 'Probability',
    vsLastUpdate: 'vs last update',
    noStatisticsAvailable: 'No statistics available',
    addProgramsToSeeStats: 'Add programs to see detailed statistics',
    
    // Import Screen
    importExport: 'Import & Export',
    importFromWeb: 'Import from Web',
    importFromFile: 'Import from File',
    exportData: 'Export Data',
    importFromWebDesc: 'Import data from Google Sheets or CSV URLs',
    importFromFileDesc: 'Upload CSV or Excel files from your device',
    exportDataDesc: 'Export your data to CSV format',
    importing: 'Importing...',
    chooseFile: 'Choose File',
    csvXlsxSupported: 'CSV, XLSX files supported',
    exportToCsv: 'Export to CSV',
    expectedCsvFormat: 'Expected CSV Format:',
    importInstructions: 'Import Instructions',
    importCompleted: 'Import completed successfully',
    importFailed: 'Import failed',
    
    // Settings Screen
    appearance: 'Appearance',
    darkMode: 'Dark Mode',
    darkModeDesc: 'Use dark theme for better viewing in low light',
    notifications: 'Notifications',
    pushNotifications: 'Push Notifications',
    pushNotificationsDesc: 'Get notified about important updates',
    dailyUpdates: 'Daily Updates',
    dailyUpdatesDesc: 'Receive daily admission list updates',
    dataManagement: 'Data Management',
    exportDataSettings: 'Export Data',
    exportDataSettingsDesc: 'Download your data as CSV file',
    clearAllData: 'Clear All Data',
    clearAllDataDesc: 'Permanently delete all stored data',
    clearAllDataConfirm: 'This will permanently delete all your universities, programs, and statistics. This action cannot be undone.',
    about: 'About',
    aboutApp: 'About App',
    aboutAppDesc: 'Version info and app details',
    language: 'Language',
    languageDesc: 'Choose your preferred language',
    
    // Auth
    signIn: 'Sign In',
    signOut: 'Sign Out',
    signInWithGoogle: 'Sign in with Google',
    welcome: 'Welcome',
    pleaseSignIn: 'Please sign in to continue',
    signInToSync: 'Sign in to sync your data across devices',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    error: 'Error',
    success: 'Success',
    loading: 'Loading',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
  },
  ru: {
    // Navigation
    home: 'Главная',
    universities: 'Университеты',
    stats: 'Статистика',
    import: 'Импорт',
    settings: 'Настройки',
    
    // Home Screen
    admissionTracker: 'Трекер Поступления',
    trackYourChances: 'Отслеживайте свои шансы поступления в университеты',
    programs: 'Программы',
    avgChance: 'Средний Шанс',
    highChance: 'Высокий Шанс',
    recentPrograms: 'Последние Программы',
    add: 'Добавить',
    rank: 'Место',
    seats: 'Места',
    score: 'Баллы',
    noProgramsAdded: 'Программы еще не добавлены',
    addFirstProgram: 'Добавьте первую программу университета для начала отслеживания',
    
    // Universities Screen
    editUniversity: 'Редактировать Университет',
    addUniversity: 'Добавить Университет',
    deleteUniversity: 'Удалить Университет',
    deleteUniversityConfirm: 'Это также удалит все связанные программы. Вы уверены?',
    universityName: 'Название Университета',
    websiteUrl: 'URL Сайта',
    optional: 'необязательно',
    programName: 'Название Программы',
    budgetSeats: 'Бюджетные Места',
    currentRank: 'Текущее Место',
    originalsAbove: 'Оригиналов Выше',
    yourExamScore: 'Ваши Баллы ЕГЭ',
    passingScore: 'Проходной Балл',
    contractType: 'Тип Договора',
    budget: 'Бюджет',
    contract: 'Договор',
    quota: 'Квота',
    addProgram: 'Добавить Программу',
    editProgram: 'Редактировать Программу',
    deleteProgram: 'Удалить Программу',
    deleteProgramConfirm: 'Вы уверены, что хотите удалить эту программу?',
    noProgramsYet: 'Программы еще не добавлены',
    noUniversitiesAdded: 'Университеты еще не добавлены',
    addFirstUniversity: 'Добавьте первый университет для начала отслеживания программ',
    
    // Statistics Screen
    statistics: 'Статистика',
    averageChance: 'Средний Шанс',
    highProbability: 'Высокая Вероятность',
    probabilityDistribution: 'Распределение Вероятности',
    high: 'Высокая',
    medium: 'Средняя',
    low: 'Низкая',
    programDetails: 'Детали Программ',
    availableSeats: 'Доступные Места',
    probability: 'Вероятность',
    vsLastUpdate: 'по сравнению с последним обновлением',
    noStatisticsAvailable: 'Статистика недоступна',
    addProgramsToSeeStats: 'Добавьте программы для просмотра подробной статистики',
    
    // Import Screen
    importExport: 'Импорт и Экспорт',
    importFromWeb: 'Импорт из Интернета',
    importFromFile: 'Импорт из Файла',
    exportData: 'Экспорт Данных',
    importFromWebDesc: 'Импорт данных из Google Таблиц или CSV URL',
    importFromFileDesc: 'Загрузка CSV или Excel файлов с вашего устройства',
    exportDataDesc: 'Экспорт ваших данных в формат CSV',
    importing: 'Импортируем...',
    chooseFile: 'Выбрать Файл',
    csvXlsxSupported: 'Поддерживаются файлы CSV, XLSX',
    exportToCsv: 'Экспорт в CSV',
    expectedCsvFormat: 'Ожидаемый формат CSV:',
    importInstructions: 'Инструкции по Импорту',
    importCompleted: 'Импорт успешно завершен',
    importFailed: 'Импорт не удался',
    
    // Settings Screen
    appearance: 'Внешний Вид',
    darkMode: 'Темная Тема',
    darkModeDesc: 'Использовать темную тему для лучшего просмотра при слабом освещении',
    notifications: 'Уведомления',
    pushNotifications: 'Push Уведомления',
    pushNotificationsDesc: 'Получать уведомления о важных обновлениях',
    dailyUpdates: 'Ежедневные Обновления',
    dailyUpdatesDesc: 'Получать ежедневные обновления списков поступления',
    dataManagement: 'Управление Данными',
    exportDataSettings: 'Экспорт Данных',
    exportDataSettingsDesc: 'Скачать ваши данные в виде CSV файла',
    clearAllData: 'Очистить Все Данные',
    clearAllDataDesc: 'Навсегда удалить все сохраненные данные',
    clearAllDataConfirm: 'Это навсегда удалит все ваши университеты, программы и статистику. Это действие нельзя отменить.',
    about: 'О Приложении',
    aboutApp: 'О Приложении',
    aboutAppDesc: 'Информация о версии и детали приложения',
    language: 'Язык',
    languageDesc: 'Выберите предпочитаемый язык',
    
    // Auth
    signIn: 'Войти',
    signOut: 'Выйти',
    signInWithGoogle: 'Войти через Google',
    welcome: 'Добро пожаловать',
    pleaseSignIn: 'Пожалуйста, войдите для продолжения',
    signInToSync: 'Войдите для синхронизации данных между устройствами',
    
    // Common
    save: 'Сохранить',
    cancel: 'Отмена',
    delete: 'Удалить',
    edit: 'Редактировать',
    error: 'Ошибка',
    success: 'Успешно',
    loading: 'Загрузка',
    yes: 'Да',
    no: 'Нет',
    ok: 'ОК',
  },
};

export type Language = keyof typeof translations;

let currentLanguage: Language = 'en';

export const setLanguage = (language: Language) => {
  currentLanguage = language;
};

export const getCurrentLanguage = (): Language => {
  return currentLanguage;
};

export const t = (key: keyof Translations): string => {
  return translations[currentLanguage][key] || translations.en[key] || key;
};