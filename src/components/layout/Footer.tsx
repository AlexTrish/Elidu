import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Mail, Github } from 'lucide-react';
import Icon from '../../assets/icon.svg';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-black text-white border-t-4 border-black py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-4 border-black rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-400 p-6 flex flex-col justify-center border-b-4 md:border-b-0 md:border-r-4 border-black">
              <h3 className="text-3xl font-black mb-3 text-black drop-shadow-lg">{t('footer.letsConnect')}</h3>
              <p className="text-base font-medium text-black mb-4">{t('footer.haveProject')}</p>
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-6 h-6 text-black" />
                <span className="text-black font-bold">hello@elidu.app</span>
              </div>
              <a
                href="https://github.com/AlexTrish"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 mt-2 font-bold text-black hover:text-blue-700 transition"
                aria-label="GitHub"
              >
                <Github className="w-6 h-6" />
                GitHub
              </a>
            </div>
            <div className="bg-white p-6 flex flex-col justify-center">
              <h3 className="text-xl font-black mb-4 text-black">{t('footer.contactUs')}</h3>
              <form className="space-y-3">
                <div>
                  <label htmlFor="name" className="block text-black text-xs font-bold mb-1">
                    {t('footer.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="border-4 border-black bg-transparent w-full py-1 px-2 text-black font-bold focus:outline-none focus:border-blue-500 transition rounded-none"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-black text-xs font-bold mb-1">
                    {t('footer.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="border-4 border-black bg-transparent w-full py-1 px-2 text-black font-bold focus:outline-none focus:border-blue-500 transition rounded-none"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-black text-xs font-bold mb-1">
                    {t('footer.message')}
                  </label>
                  <textarea
                    id="message"
                    className="border-4 border-black bg-transparent w-full py-1 px-2 text-black font-bold focus:outline-none focus:border-blue-500 transition rounded-none min-h-[60px] max-h-[120px]"
                  ></textarea>
                </div>
                <button
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-black py-2 px-6 border-4 border-black hover:from-purple-600 hover:to-blue-500 transition rounded-none"
                  type="submit"
                >
                  {t('footer.send')}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 border-3 border-black flex items-center justify-center">
                <img src={Icon} className="w-8 h-8" alt="Logo" />
              </div>
              <span className="text-2xl font-black tracking-tight">ELIDU</span>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              {t('footer.description')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xl font-bold mb-4 text-green-400">Links</h3>
            <div className="space-y-3">
              <a
                href="#"
                className="block text-gray-300 hover:text-white font-medium transition-colors"
              >
                {t('footer.privacy')}
              </a>
              <a
                href="#"
                className="block text-gray-300 hover:text-white font-medium transition-colors"
              >
                {t('footer.terms')}
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-4 text-yellow-400">Contact</h3>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-300" />
              <span className="text-gray-300">hello@elidu.app</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 pt-8 first-line:text-center"
        >
          <p className="text-gray-400 font-medium">
            {t('footer.copyright')}
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;