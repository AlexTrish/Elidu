import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/layout/Header';
import Home from './pages/Home';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import { AnimatePresence, motion } from 'framer-motion';
import './i18n';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const { i18n } = useTranslation();
  const [langTransitionKey, setLangTransitionKey] = useState(0);
  const [isLangChanging, setIsLangChanging] = useState(false);
  const pendingLang = useRef<string | null>(null);

  // Update document title and lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    const titles = {
      en: 'Elidu - Your Path to University Success',
      ru: 'Elidu - Ваш путь к успеху в университете'
    };
    document.title = titles[i18n.language as keyof typeof titles] || titles.en;
  }, [i18n.language]);

  // SEO Meta tags update
  useEffect(() => {
    const descriptions = {
      en: 'Elidu helps prospective students track admissions, monitor competitive rankings, and calculate budget admission probabilities with precision.',
      ru: 'Elidu помогает абитуриентам отслеживать поступление, мониторить рейтинги в конкурсных списках и точно рассчитывать вероятность поступления на бюджет.'
    };

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', descriptions[i18n.language as keyof typeof descriptions] || descriptions.en);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = descriptions[i18n.language as keyof typeof descriptions] || descriptions.en;
      document.head.appendChild(meta);
    }
  }, [i18n.language]);

  // Плавная анимация смены языка: overlay появляется ДО смены языка, затем смена языка, затем исчезает overlay
  useEffect(() => {
    const origChangeLanguage = i18n.changeLanguage.bind(i18n);

    i18n.changeLanguage = async (lng: string, ...args: any[]) => {
      if (i18n.language === lng) return;
      setIsLangChanging(true);
      pendingLang.current = lng;
      // Ждем анимацию overlay (например, 700ms)
      await new Promise(res => setTimeout(res, 700));
      await origChangeLanguage(lng, ...args);
      setLangTransitionKey(k => k + 1);
      // overlay исчезает плавно (например, 700ms)
      setTimeout(() => {
        setIsLangChanging(false);
        pendingLang.current = null;
      }, 700);
    };

    return () => {
      // @ts-ignore
      i18n.changeLanguage = origChangeLanguage;
    };
  }, [i18n]);

  // Анимации для переходов между страницами
  const pageVariants: Record<string, any> = {
    home: {
      initial: { opacity: 0, y: 120, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] } },
      exit: { opacity: 0, y: -120, scale: 0.95, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } },
    },
    privacy: {
      initial: { opacity: 0, x: 120, scale: 0.95 },
      animate: { opacity: 1, x: 0, scale: 1, transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] } },
      exit: { opacity: 0, x: -120, scale: 0.95, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } },
    },
    terms: {
      initial: { opacity: 0, x: -120, scale: 0.95 },
      animate: { opacity: 1, x: 0, scale: 1, transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] } },
      exit: { opacity: 0, x: 120, scale: 0.95, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } },
    },
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <TermsOfService />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-black relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={'header-' + langTransitionKey}
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] } }}
          exit={{ opacity: 0, y: -100, transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] } }}
          className="z-50 relative"
        >
          <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </motion.div>
      </AnimatePresence>
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage + '-' + langTransitionKey}
            variants={{
              initial: { opacity: 0, y: 120, scale: 0.95 },
              animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] } },
              exit: { opacity: 0, y: -120, scale: 0.95, transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] } },
            }}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen"
            style={{ width: '100vw' }}
          >
            {currentPage === 'privacy' && <PrivacyPolicy />}
            {currentPage === 'terms' && <TermsOfService />}
            {currentPage === 'home' && <Home />}
          </motion.div>
        </AnimatePresence>
        {/* Overlay-аниматор для смены языка */}
        <AnimatePresence>
          {isLangChanging && (
            <motion.div
              key="lang-overlay"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.85, scale: 1, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } }}
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } }}
              className="fixed inset-0 z-[9999] bg-black pointer-events-none"
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;