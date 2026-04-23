import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

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
    <section className="product-section">
      <div className="container">
        <div className="product-section__header">
          <div>
            <h2 className="product-section__title">{title}</h2>
            <div className="product-section__underline"></div>
          </div>
          <div className="product-section__actions">
            {seeAllLink && (
              <Link to={seeAllLink} className="product-section__see-all">
                Ver todos <ArrowRight size={16} />
              </Link>
            )}
            <div className="product-section__nav">
              <button className="product-section__nav-btn" onClick={() => scroll('left')}>
                <ChevronLeft size={16} />
              </button>
              <button className="product-section__nav-btn" onClick={() => scroll('right')}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="product-row" ref={rowRef}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductRow;
