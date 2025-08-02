import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Activity, 
  Calculator, 
  BarChart3, 
  Bell, 
  GitCompare, 
  Users 
} from 'lucide-react';

const Features: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      key: 'tracking',
      icon: Activity,
      color: 'bg-blue-400',
      borderColor: 'border-blue-600',
    },
    {
      key: 'probability',
      icon: Calculator,
      color: 'bg-green-400',
      borderColor: 'border-green-600',
    },
    {
      key: 'insights',
      icon: BarChart3,
      color: 'bg-purple-400',
      borderColor: 'border-purple-600',
    },
    {
      key: 'notifications',
      icon: Bell,
      color: 'bg-yellow-400',
      borderColor: 'border-yellow-600',
    },
    {
      key: 'compare',
      icon: GitCompare,
      color: 'bg-pink-400',
      borderColor: 'border-pink-600',
    },
    {
      key: 'support',
      icon: Users,
      color: 'bg-orange-400',
      borderColor: 'border-orange-600',
    },
  ];

  return (
    <section className="py-20 bg-white max-h-screen w-full">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8 mb-6"
        >
          <h2 className="text-4xl md:text-4xl font-black mb-3 text-black">
            {t('features.title')}
          </h2>
          <p className="text-xl md:text-xl text-gray-600 font-medium max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            
            return (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  rotate: [0, -1, 1, 0],
                  transition: { duration: 0.3 }
                }}
                className={`${feature.color} border-4 ${feature.borderColor} h-[20rem] p-8 cursor-pointer group relative overflow-hidden`}
              >
                <motion.div
                  className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                />
                
                <div className="relative z-10">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-16 h-16 bg-black border-4 border-black flex items-center justify-center mb-6"
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </motion.div>

                  <h3 className="text-xl font-black mb-4 text-black">
                    {t(`features.${feature.key}.title`)}
                  </h3>

                  <p className="text-base font-medium text-gray-800 leading-relaxed">
                    {t(`features.${feature.key}.description`)}
                  </p>

                  {/* Decorative corner */}
                  <div className="absolute top-4 right-4 w-6 h-6 bg-black border-2 border-black transform rotate-45" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;