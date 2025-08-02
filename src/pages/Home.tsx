import React, { useRef, useEffect, useState } from 'react';
import { motion, useTransform, useScroll, AnimatePresence } from 'framer-motion';
import Hero from '../components/sections/Hero';
import Features from '../components/sections/Features';
import Testimonials from '../components/sections/Testimonials';
import CTA from '../components/sections/CTA';
import FooterSection from '../components/layout/Footer';

// Анимации для каждой секции (разные направления и эффекты)
const sectionVariants = [
  // Hero: появляется снизу
  {
    initial: { opacity: 0, y: 120, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] } },
    exit: { opacity: 0, y: -120, scale: 0.95, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } },
  },
  // Features: появляется справа
  {
    initial: { opacity: 0, x: 120, scale: 0.95 },
    animate: { opacity: 1, x: 0, scale: 1, transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] } },
    exit: { opacity: 0, x: -120, scale: 0.95, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } },
  },
  // Testimonials: появляется слева
  {
    initial: { opacity: 0, x: -120, scale: 0.95 },
    animate: { opacity: 1, x: 0, scale: 1, transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] } },
    exit: { opacity: 0, x: 120, scale: 0.95, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } },
  },
  // CTA: вырастает из центра
  {
    initial: { opacity: 0, scale: 0.7 },
    animate: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] } },
    exit: { opacity: 0, scale: 0.7, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } },
  },
  // Footer: появляется снизу
  {
    initial: { opacity: 0, y: 120, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] } },
    exit: { opacity: 0, y: -120, scale: 0.95, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } },
  },
];

const sections = [
  { key: 'hero', component: <Hero />, bg: 'bg-gradient-to-br from-yellow-300 via-pink-300 to-blue-300' },
  { key: 'features', component: <Features />, bg: 'bg-gradient-to-br from-blue-900 via-black to-purple-900' },
  { key: 'testimonials', component: <Testimonials />, bg: 'bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200' },
  { key: 'cta', component: <CTA />, bg: 'bg-gradient-to-r from-green-300 via-yellow-300 to-pink-300' },
  { key: 'footer', component: <FooterSection />, bg: 'bg-black' },
];

const Home: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [direction, setDirection] = useState(1);

  // Слушаем wheel для смены секций (эффект слайдшоу)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (activeSection < sections.length - 1 && e.deltaY > 0) {
        setDirection(1);
        setActiveSection(i => Math.min(i + 1, sections.length - 1));
        e.preventDefault();
      } else if (activeSection > 0 && e.deltaY < 0) {
        setDirection(-1);
        setActiveSection(i => Math.max(i - 1, 0));
        e.preventDefault();
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [activeSection]);

  return (
    <div className="min-h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait" custom={direction}>
        {sections.map((section, idx) =>
          idx === activeSection ? (
            <motion.div
              key={section.key}
              variants={sectionVariants[idx]}
              initial="initial"
              animate="animate"
              exit="exit"
              className={`fixed inset-0 z-10 flex items-center justify-center ${section.bg}`}
              style={{ minHeight: '100vh', width: '100vw' }}
            >
              {section.component}
            </motion.div>
          ) : null
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;