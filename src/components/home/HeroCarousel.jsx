import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const heroSlides = [
  {
    id: 1,
    title: "Aberturas Miño",
    subtitle: "Desde Esquina, Corrientes, directo para tu obra o tu campo. Fabricación a medida con la mejor calidad.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    ctaText: "Ver catálogo de aberturas",
    ctaLink: "/categoria/todos"
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
    <div className="hero">
      {heroSlides.map((slide, index) => (
        <div key={slide.id} className={`hero__slide ${index === currentSlide ? 'active' : ''}`} style={{ backgroundImage: `url(${slide.image})` }}>
          <div className="hero__content container">
            <h2 className="hero__title">{slide.title}</h2>
            <p className="hero__subtitle">{slide.subtitle}</p>
            <Link to={slide.ctaLink} className="btn btn-primary">{slide.ctaText}</Link>
          </div>
        </div>
      ))}
      <button className="hero__btn hero__btn--prev" onClick={prevSlide}><ChevronLeft size={24} /></button>
      <button className="hero__btn hero__btn--next" onClick={nextSlide}><ChevronRight size={24} /></button>
    </div>
  );
};

export default HeroCarousel;