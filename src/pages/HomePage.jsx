import React, { useState, useEffect } from 'react';
import HeroCarousel from '../components/home/HeroCarousel';
import CategoryGrid from '../components/home/CategoryGrid';
import ProductRow from '../components/home/ProductRow';
import Container from '../components/ui/Container';
import { supabase } from '../config/supabase';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*, product_variants(*)');

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error cargando datos de la Home:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const safeProducts = Array.isArray(products) ? products : [];
  const featuredProducts = safeProducts.filter(p => p && p.is_featured);
  const offerProducts = safeProducts.filter(p => p && p.in_offer);

  if (loading) {
    return (
      <Container className="py-40 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-400 font-bold animate-pulse uppercase tracking-widest text-xs">
          Cargando catálogo premium...
        </p>
      </Container>
    );
  }

  return (
    <>
      <HeroCarousel />
      <CategoryGrid />

      {featuredProducts.length > 0 && (
        <ProductRow
          title="Productos Destacados"
          products={featuredProducts}
          seeAllLink="/categoria/destacados"
        />
      )}

      {offerProducts.length > 0 && (
        <ProductRow
          title="Ofertas Imperdibles"
          products={offerProducts}
          seeAllLink="/ofertas"
        />
      )}

      {products.length === 0 && (
        <Container className="py-20 text-center space-y-6">
          <div className="max-w-md mx-auto p-12 rounded-3xl bg-gray-50 border border-dashed border-gray-200">
            <h3 className="text-2xl font-black text-secondary mb-2 uppercase tracking-tight">Próximamente</h3>
            <p className="text-gray-400 font-medium">Estamos actualizando nuestro catálogo digital con nuevas aberturas de alta gama.</p>
          </div>
        </Container>
      )}
    </>
  );
};

export default HomePage;