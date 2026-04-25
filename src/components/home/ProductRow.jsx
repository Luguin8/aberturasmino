import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import Container from '../ui/Container';
import Button from '../ui/Button';

const ProductRow = ({ title, products, seeAllLink }) => {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.8 
        : scrollLeft + clientWidth * 0.8;
      
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-gray-50/50">
      <Container>
        <div className="flex items-end justify-between mb-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-secondary uppercase tracking-tight">{title}</h2>
            <div className="w-16 h-1.5 bg-primary rounded-full"></div>
          </div>
          
          <div className="flex items-center gap-6">
            {seeAllLink && (
              <Link 
                to={seeAllLink} 
                className="hidden sm:flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-colors"
              >
                Ver catálogo completo <ArrowRight size={18} />
              </Link>
            )}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full w-10 h-10" 
                onClick={() => scroll('left')}
              >
                <ChevronLeft size={20} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full w-10 h-10" 
                onClick={() => scroll('right')}
              >
                <ChevronRight size={20} />
              </Button>
            </div>
          </div>
        </div>

        <div 
          className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-none" 
          ref={rowRef}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div key={product.id} className="min-w-[280px] md:min-w-[320px] snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default ProductRow;
