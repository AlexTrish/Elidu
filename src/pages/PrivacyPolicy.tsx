import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation();
  const sections = t('privacy.sections', { returnObjects: true }) as Array<{
    title: string;
    content: string;
  }>;

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white border-4 border-black p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-500 border-4 border-black flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-black">
                  {t('privacy.title')}
                </h1>
                <p className="text-gray-600 font-medium mt-2">
                  {t('privacy.lastUpdated')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border-4 border-black p-8"
              >
                <h2 className="text-2xl font-black mb-4 text-black">
                  {section.title}
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed font-medium">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;