import React from 'react';
import Layout from '../components/layout/Layout';
import HeroCarousel from '../components/home/HeroCarousel';
import CategoryGrid from '../components/home/CategoryGrid';
import ProductRow from '../components/home/ProductRow';
import { products } from '../data/mockProducts';

const HomePage = () => {
  // Mock logic to filter featured and offer products for the home rows
  const featuredProducts = products.filter(p => p.featured);
  const offerProducts = products.filter(p => p.inOffer);
  const windows = products.filter(p => p.categoryId === 'cat-1');

  return (
    <Layout>
      <HeroCarousel />
      <CategoryGrid />
      
      <ProductRow 
        title="Productos Destacados" 
        products={featuredProducts} 
        seeAllLink="/categoria/destacados"
      />

      <ProductRow 
        title="Ofertas Imperdibles" 
        products={offerProducts} 
        seeAllLink="/ofertas"
      />

      <ProductRow 
        title="Ventanas de Aluminio" 
        products={windows} 
        seeAllLink="/categoria/ventanas"
      />

      {/* Secciones adicionales según sea necesario */}
    </Layout>
  );
};

export default HomePage;
