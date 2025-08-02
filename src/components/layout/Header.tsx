import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Smartphone } from 'lucide-react';
import LanguageSwitcher from '../ui/LanguageSwitcher';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
  const { t } = useTranslation();

  const navItems = [
    { key: 'home', label: t('nav.home') },
    { key: 'privacy', label: t('nav.privacy') },
    { key: 'terms', label: t('nav.terms') },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full bg-white border-b-4 border-black z-50 shadow-lg"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setCurrentPage('home')}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 border-3 border-black flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight">ELIDU</span>
        </motion.div>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <motion.button
              key={item.key}
              onClick={() => setCurrentPage(item.key)}
              className={`font-bold text-lg transition-colors duration-200 ${
                currentPage === item.key
                  ? 'text-blue-500 underline decoration-4 underline-offset-4'
                  : 'text-black hover:text-blue-500'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              {item.label}
            </motion.button>
          ))}
        </nav>

        <LanguageSwitcher />
      </div>
    </motion.header>
  );
};

export default Header;