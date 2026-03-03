import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import image1 from '../assets/images/image1.jpeg';
import image2 from '../assets/images/image2.jpeg';
import image3 from '../assets/images/image3.jpeg';

const slides = [
  {
    id: 1,
    title: "Un programme de recherche en vue? Rejoignez-nous dès septembre!",
    description: "Vous envisagez une maîtrise avec mémoire ou un doctorat? L'admission est encore possible pour la session d'automne 2026, sous certaines conditions.",
    buttonText: "Trouvez votre programme de recherche",
    image: image1
  },
  {
    id: 2,
    title: "Innovez avec 2C-Services",
    description: "Découvrez nos solutions d'accompagnement pour vos projets technologiques et académiques.",
    buttonText: "Découvrir nos services",
    image: image2
  },
  {
    id: 3,
    title: "L'excellence académique à votre portée",
    description: "Rejoignez une communauté dynamique et bénéficiez d'un encadrement de premier ordre.",
    buttonText: "En savoir plus",
    image: image3
  },
  {
    id: 4,
    title: "Transformation Digitale & R&D",
    description: "Nous accompagnons les entreprises dans l'intégration des nouvelles technologies et l'optimisation de leurs processus.",
    buttonText: "Nos solutions entreprises",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1920"
  },
  {
    id: 5,
    title: "Partenariats Internationaux",
    description: "Un réseau mondial d'universités et de centres de recherche pour favoriser la mobilité et l'échange scientifique.",
    buttonText: "Voir nos partenaires",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1920"
  }
];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[600px] overflow-hidden bg-neutral-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms]"
            style={{ 
              backgroundImage: `url(${slides[currentIndex].image})`,
              transform: 'scale(1.05)'
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Content Card */}
          <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center">
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md p-8 md:p-12 max-w-xl rounded-sm shadow-2xl"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-6 leading-tight">
                {slides[currentIndex].title}
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-8 leading-relaxed">
                {slides[currentIndex].description}
              </p>
              <button className="px-8 py-4 border border-neutral-900 dark:border-white text-neutral-900 dark:text-white font-bold hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 transition-all duration-300">
                {slides[currentIndex].buttonText}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white hover:scale-110 transition-transform z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft size={48} strokeWidth={1} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white hover:scale-110 transition-transform z-10"
        aria-label="Next slide"
      >
        <ChevronRight size={48} strokeWidth={1} />
      </button>

      {/* Indicators */}
      <div className="absolute top-8 right-8 flex gap-2 z-10">
        {slides.map((_, index) => (
          <div 
            key={index}
            className={`h-1 w-8 transition-all duration-300 ${index === currentIndex ? 'bg-blue-600' : 'bg-neutral-500'}`}
          ></div>
        ))}
      </div>

      {/* Blue Wave/Polygon Effect at Bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-10">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] fill-blue-500">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
