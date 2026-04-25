import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/home/ProductCard';
import { supabase } from '../config/supabase';

const CategoryPage = () => {
  const { slug } = useParams(); // Usamos 'slug' pero internamente es el ID
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (slug === 'todos' || slug === 'destacados' || slug === 'ofertas') {
        setCategoryName(slug === 'todos' ? 'Todos los Productos' : slug === 'destacados' ? 'Destacados' : 'Ofertas');
        let query = supabase.from('products').select('*, product_variants(*)');
        if (slug === 'destacados') query = query.eq('is_featured', true);
        if (slug === 'ofertas') query = query.eq('in_offer', true);

        const { data } = await query;
        if (data) setProducts(data);
      } else {
        const { data: catData } = await supabase.from('categories').select('name').eq('id', slug).single();
        if (catData) setCategoryName(catData.name);

        const { data: prodData } = await supabase.from('products').select('*, product_variants(*)').eq('category_id', slug);
        if (prodData) setProducts(prodData);
      }

      setLoading(false);
    };
    fetchData();
  }, [slug]);

  return (
    <Layout>
      <div className="container section">
        <h1 className="section-title text-center">{categoryName}</h1>
        {loading ? (
          <p className="text-center">Cargando productos...</p>
        ) : products.length > 0 ? (
          <div className="product-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center">No hay productos en esta categoría por ahora.</p>
        )}
      </div>
    </Layout>
  );
};

export default CategoryPage;