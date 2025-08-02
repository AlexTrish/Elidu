import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Star, Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const { t } = useTranslation();
  const reviews = t('testimonials.reviews', { returnObjects: true }) as Array<{
    name: string;
    university: string;
    text: string;
    rating: number;
  }>;

  const colors = ['bg-blue-300', 'bg-green-300', 'bg-yellow-300'];

  return (
    <section className="py-20 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-black">
            {t('testimonials.title')}
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 font-medium max-w-3xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ 
                scale: 1.05,
                rotate: [0, -2, 2, 0],
                transition: { duration: 0.3 }
              }}
              className={`${colors[index]} border-4 border-black p-8 relative`}
            >
              <Quote className="w-8 h-8 text-black mb-4" />
              
              <p className="text-lg font-medium text-black mb-6 leading-relaxed">
                "{review.text}"
              </p>

              <div className="flex items-center mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-600 fill-current" />
                ))}
              </div>

              <div>
                <div className="font-black text-lg text-black">{review.name}</div>
                <div className="font-medium text-gray-700">{review.university}</div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-4 h-4 bg-black border-2 border-black" />
              <div className="absolute bottom-4 left-4 w-4 h-4 bg-black border-2 border-black transform rotate-45" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;