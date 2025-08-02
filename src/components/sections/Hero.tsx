import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Smartphone, Users, TrendingUp, Building } from 'lucide-react';
import Button from '../ui/Button';

const Hero: React.FC = () => {
  const { t } = useTranslation();

  const stats = [
    {
      icon: Users,
      value: t('hero.stats.users'),
      label: t('hero.stats.usersLabel'),
      color: 'text-blue-500',
    },
    {
      icon: TrendingUp,
      value: t('hero.stats.success'),
      label: t('hero.stats.successLabel'),
      color: 'text-green-500',
    },
    {
      icon: Building,
      value: t('hero.stats.universities'),
      label: t('hero.stats.universitiesLabel'),
      color: 'text-purple-500',
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-300 to-blue-300 flex items-center justify-center relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-black border-2 border-black"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-black mb-6 text-black leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {t('hero.title')}
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl mb-8 text-gray-800 leading-relaxed font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button variant="primary" size="lg" href="https://apps.apple.com">
                📱 {t('hero.appStore')}
              </Button>
              <Button variant="secondary" size="lg" href="https://play.google.com">
                🤖 {t('hero.googlePlay')}
              </Button>
            </motion.div>

            <motion.div
              className="grid grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-3xl font-black ${stat.color} mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-sm font-bold text-gray-700">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full max-w-md mx-auto">
              {/* Phone mockup */}
              <motion.div
                className="bg-black border-8 border-black rounded-3xl p-6 relative"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="bg-white rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <Smartphone className="w-8 h-8 text-blue-500" />
                    <span className="text-xl font-black">ELIDU</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-100 p-4 border-3 border-black">
                      <div className="text-sm font-bold mb-1">МГУ - Математика</div>
                      <div className="text-lg font-black text-green-600">Место: 15/30</div>
                    </div>
                    
                    <div className="bg-yellow-100 p-4 border-3 border-black">
                      <div className="text-sm font-bold mb-1">СПбГУ - Физика</div>
                      <div className="text-lg font-black text-orange-600">Место: 28/40</div>
                    </div>
                    
                    <div className="bg-green-100 p-4 border-3 border-black">
                      <div className="text-sm font-bold mb-1">Вероятность поступления</div>
                      <div className="text-2xl font-black text-green-600">87%</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 border-4 border-black flex items-center justify-center"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity }}
              >
                📊
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-pink-400 border-4 border-black flex items-center justify-center"
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                🎓
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;