import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import HeroCarousel from '../components/home/HeroCarousel';
import ProductRow from '../components/home/ProductRow';
import { supabase } from '../config/supabase';

const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*, product_variants(*)');
      if (data) setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <Layout>
      <HeroCarousel />
      <ProductRow title="Nuestros Productos" products={products} seeAllLink="/categoria/todos" />
    </Layout>
  );
};

export default HomePage;