import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Download, Sparkles } from 'lucide-react';
import Button from '../ui/Button';

const CTA: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-gradient-to-r from-green-300 via-yellow-300 to-pink-300 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-8 h-8 bg-black border-4 border-black"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.5, 1],
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <div className="bg-black border-4 border-black p-12 mb-8 relative">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 border-4 border-black flex items-center justify-center"
              >
                <Sparkles className="w-6 h-6 text-black" />
              </motion.div>

              <h2 className="text-4xl md:text-6xl font-black mb-6 text-white">
                {t('cta.title')}
              </h2>

              <p className="text-xl md:text-2xl text-gray-200 font-medium mb-8 max-w-2xl mx-auto">
                {t('cta.subtitle')}
              </p>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="primary" size="lg" className="bg-yellow-400 text-black border-white hover:bg-white">
                  <Download className="w-6 h-6" />
                  {t('cta.button')}
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Additional stats or info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
          >
            {[
              { emoji: '🎯', text: 'Точные прогнозы' },
              { emoji: '⚡', text: 'Мгновенные уведомления' },
              { emoji: '🏆', text: 'Гарантия поступления' },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="bg-white border-4 border-black p-6"
              >
                <div className="text-4xl mb-3">{item.emoji}</div>
                <div className="text-lg font-bold text-black">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA;