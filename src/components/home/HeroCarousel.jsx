import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const heroSlides = [
  {
    id: 1,
    title: "Aberturas de Alta Gama",
    subtitle: "Fabricación a medida en aluminio y PVC. Calidad premium para hogares exigentes.",
    image: "/images/hero/frente-local.jpg",
    ctaText: "Ver catálogo completo",
    ctaLink: "/categoria/todos"
  },
  {
    id: 2,
    title: "Vistas que Enamoran",
    subtitle: "Sistemas de carpintería con ruptura de puente térmico para el máximo confort.",
    image: "/images/hero/galpon.jpg",
    ctaText: "Nuestros modelos",
    ctaLink: "/categoria/ventanas"
  },
  {
    id: 3,
    title: "Seguridad y Estilo",
    subtitle: "Portones y cerramientos reforzados con diseños modernos y funcionales.",
    image: "/images/hero/interior-local.jpg",
    ctaText: "Consultar presupuesto",
    ctaLink: "/checkout"
  }
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleImageError = (id) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  const nextSlide = () => setCurrentSlide(currentSlide === heroSlides.length - 1 ? 0 : currentSlide + 1);
  const prevSlide = () => setCurrentSlide(currentSlide === 0 ? heroSlides.length - 1 : currentSlide - 1);

  return (
    <div className="relative w-full h-[550px] md:h-[650px] overflow-hidden bg-secondary">
      {heroSlides.map((slide, index) => (
        <div 
          key={slide.id} 
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-20' : 'opacity-0 z-10'}`}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 z-10" />
          
          {/* Background Logic */}
          {!slide.image || imageErrors[slide.id] ? (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-secondary flex items-center justify-center overflow-hidden">
                <div className="absolute opacity-10 transform -rotate-12">
                    <ImageOff size={400} strokeWidth={0.5} className="text-white" />
                </div>
                <div className="relative z-0 flex flex-col items-center gap-4 opacity-20">
                    <ImageOff size={120} strokeWidth={1} className="text-white" />
                </div>
            </div>
          ) : (
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="w-full h-full object-cover scale-105 animate-slow-zoom" 
              onError={() => handleImageError(slide.id)}
            />
          )}
          
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="container mx-auto px-12 md:px-24">
              <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
                <h2 className="text-4xl md:text-7xl font-black text-white mb-6 leading-[1.1] uppercase tracking-tighter drop-shadow-2xl">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-2xl text-white/90 mb-10 leading-relaxed font-medium max-w-2xl drop-shadow-lg">
                  {slide.subtitle}
                </p>
                <div className="flex justify-center w-full">
                  <Link 
                    to={slide.ctaLink} 
                    className="group inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-white px-10 py-5 rounded-2xl font-black text-lg md:text-xl transition-all transform hover:scale-105 shadow-2xl hover:shadow-primary/40"
                  >
                    {slide.ctaText}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation buttons */}
      <button 
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 p-3 md:p-5 rounded-full bg-white/10 hover:bg-white/30 text-white transition-all backdrop-blur-md border border-white/20 shadow-xl group active:scale-95" 
        onClick={prevSlide}
        aria-label="Anterior"
      >
        <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
      </button>
      <button 
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 p-3 md:p-5 rounded-full bg-white/10 hover:bg-white/30 text-white transition-all backdrop-blur-md border border-white/20 shadow-xl group active:scale-95" 
        onClick={nextSlide}
        aria-label="Siguiente"
      >
        <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-3">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-1.5 transition-all duration-500 rounded-full ${i === currentSlide ? 'w-10 bg-primary' : 'w-4 bg-white/30 hover:bg-white/50'}`}
            aria-label={`Ir a slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;