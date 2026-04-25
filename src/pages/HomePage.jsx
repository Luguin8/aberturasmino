import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import HeroCarousel from '../components/home/HeroCarousel';
import CategoryGrid from '../components/home/CategoryGrid';
import ProductRow from '../components/home/ProductRow';
import { supabase } from '../config/supabase';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        // Traemos productos con sus variantes para tener los precios actualizados
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

  // Filtramos los productos según las propiedades de la base de datos
  const featuredProducts = products.filter(p => p.is_featured);
  const offerProducts = products.filter(p => p.in_offer);

  // Ejemplo: Filtrar por una categoría específica (puedes usar el UUID de tu tabla categories)
  // Reemplaza 'ID_DE_TU_CATEGORIA' por el UUID real que veas en Supabase
  const windows = products.filter(p => p.category_id === 'ID_DE_TU_CATEGORIA_DE_VENTANAS');

  if (loading) {
    return (
      <Layout>
        <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
          <p>Cargando catálogo de aberturas...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
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

      {/* Si aún no tienes productos cargados, mostramos una fila con todo el catálogo */}
      {products.length > 0 && featuredProducts.length === 0 && (
        <ProductRow
          title="Nuestros Productos"
          products={products}
          seeAllLink="/categoria/todos"
        />
      )}

      {products.length === 0 && (
        <div className="container text-center p-5">
          <h3>Próximamente nuevos productos</h3>
          <p>Estamos actualizando nuestro catálogo digital.</p>
        </div>
      )}
    </Layout>
  );
};

export default HomePage;