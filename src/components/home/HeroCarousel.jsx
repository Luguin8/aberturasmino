import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { heroSlides } from '../../data/mockHeroSlides';
import { Link } from 'react-router-dom';

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  return (
    <section className="hero">
      {heroSlides.map((slide, index) => (
        <div 
          key={slide.id} 
          className={`hero__slide ${index === currentSlide ? 'hero__slide--active' : ''}`}
        >
          <img src={slide.backgroundImage} alt={slide.title} className="hero__slide-bg" />
          <div className="hero__slide-overlay"></div>
          <div className="hero__slide-content">
            <span className="hero__tag">{slide.tag}</span>
            <h2 className="hero__title">{slide.title}</h2>
            <p className="hero__subtitle">{slide.subtitle}</p>
            <Link to={slide.ctaLink} className="hero__cta">
              {slide.ctaText}
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      ))}

      <button className="hero__arrow hero__arrow--prev" onClick={prevSlide}>
        <ChevronLeft size={20} />
      </button>
      <button className="hero__arrow hero__arrow--next" onClick={nextSlide}>
        <ChevronRight size={20} />
      </button>

      <div className="hero__dots">
        {heroSlides.map((_, index) => (
          <button 
            key={index} 
            className={`hero__dot ${index === currentSlide ? 'hero__dot--active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
