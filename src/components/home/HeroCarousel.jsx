import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const heroSlides = [
  {
    id: 1,
    title: "Aberturas de Alta Gama",
    subtitle: "Fabricación a medida en aluminio y PVC. Calidad premium para hogares exigentes.",
    image: "/images/hero/hero_1.png",
    ctaText: "Ver catálogo completo",
    ctaLink: "/categoria/todos"
  },
  {
    id: 2,
    title: "Vistas que Enamoran",
    subtitle: "Sistemas de carpintería con ruptura de puente térmico para el máximo confort.",
    image: "/images/hero/hero_2.png",
    ctaText: "Nuestros modelos",
    ctaLink: "/categoria/ventanas"
  },
  {
    id: 3,
    title: "Seguridad y Estilo",
    subtitle: "Portones y cerramientos reforzados con diseños modernos y funcionales.",
    image: "/images/hero/hero_3.png",
    ctaText: "Consultar presupuesto",
    ctaLink: "/checkout"
  }
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide(currentSlide === heroSlides.length - 1 ? 0 : currentSlide + 1);
  const prevSlide = () => setCurrentSlide(currentSlide === 0 ? heroSlides.length - 1 : currentSlide - 1);

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {heroSlides.map((slide, index) => (
        <div 
          key={slide.id} 
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 z-10" />
          
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl">
                <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight uppercase tracking-tight">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed font-medium">
                  {slide.subtitle}
                </p>
                <Link 
                  to={slide.ctaLink} 
                  className="inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl"
                >
                  {slide.ctaText}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <button 
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all backdrop-blur-sm" 
        onClick={prevSlide}
      >
        <ChevronLeft size={28} />
      </button>
      <button 
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all backdrop-blur-sm" 
        onClick={nextSlide}
      >
        <ChevronRight size={28} />
      </button>
    </div>
  );
};

export default HeroCarousel;