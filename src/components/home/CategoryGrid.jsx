import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../../data/mockCategories';

const CategoryGrid = () => {
  return (
    <section className="categories-section">
      <div className="container">
        <div className="categories-grid">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={`/categoria/${category.slug}`} 
              className="category-circle"
            >
              <div className="category-circle__image">
                <img src={category.image} alt={category.name} />
              </div>
              <span className="category-circle__name">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
