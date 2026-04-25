import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import Container from '../ui/Container';

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      const { data } = await supabase.from('categories').select('*');
      if (data) setCategories(data);
    };
    fetchCats();
  }, []);

  // Mapeo de imágenes generadas a categorías (basado en nombre o id)
  const getCategoryImage = (name) => {
    const n = name.toLowerCase();
    if (n.includes('ventana')) return '/images/categories/ventanas.png';
    if (n.includes('puerta')) return '/images/categories/puertas.png';
    return '/images/hero/hero_3.png'; // Fallback a una imagen de calidad
  };

  return (
    <section className="py-24 bg-white">
      <Container>
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-black text-secondary uppercase tracking-tight">
            Comprá por Categoría
          </h2>
          <div className="w-24 h-1.5 bg-primary mx-auto rounded-full"></div>
          <p className="text-gray-400 font-medium max-w-lg mx-auto">
            Explorá nuestra variedad de productos fabricados con los más altos estándares de calidad.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link 
              to={`/categoria/${category.id}`} 
              key={category.id} 
              className="group relative h-80 rounded-[2rem] overflow-hidden shadow-xl hover:shadow-primary/20 transition-all duration-500"
            >
              {/* Image with zoom effect */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={getCategoryImage(category.name)} 
                  alt={category.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
              </div>
              
              <div className="absolute inset-0 p-10 flex flex-col justify-end z-10">
                <h3 className="text-2xl font-black text-white mb-2 transform group-hover:-translate-y-2 transition-transform duration-500 uppercase tracking-tight">
                  {category.name}
                </h3>
                <div className="flex items-center gap-2 text-primary font-bold text-sm opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  Explorar Colección
                  <div className="w-8 h-[2px] bg-primary"></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default CategoryGrid;