import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      const { data } = await supabase.from('categories').select('*');
      if (data) setCategories(data);
    };
    fetchCats();
  }, []);

  return (
    <section className="category-grid section">
      <div className="container">
        <h2 className="section-title">Comprá por Categoría</h2>
        <div className="category-grid__container">
          {categories.map((category) => (
            <Link to={`/categoria/${category.id}`} key={category.id} className="category-card">
              <div className="category-card__content">
                <h3>{category.name}</h3>
                <span>Ver productos</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;