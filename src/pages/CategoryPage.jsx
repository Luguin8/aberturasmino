import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/home/ProductCard';
import { supabase } from '../config/supabase';
import Container from '../components/ui/Container';
import { ChevronRight, Filter, LayoutGrid } from 'lucide-react';

const CategoryPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (slug === 'todos' || slug === 'destacados' || slug === 'ofertas') {
        const titleMap = {
          'todos': 'Todas las Aberturas',
          'destacados': 'Selección Destacada',
          'ofertas': 'Ofertas Exclusivas'
        };
        setCategoryName(titleMap[slug] || 'Catálogo');
        
        let query = supabase.from('products').select('*, product_variants(*)');
        if (slug === 'destacados') query = query.eq('is_featured', true);
        if (slug === 'ofertas') query = query.eq('in_offer', true);

        const { data } = await query;
        if (data) setProducts(data);
      } else {
        const { data: catData } = await supabase.from('categories').select('name').eq('id', slug).maybeSingle();
        if (catData) setCategoryName(catData.name);
        else setCategoryName('Categoría');

        const { data: prodData } = await supabase.from('products').select('*, product_variants(*)').eq('category_id', slug);
        if (prodData) setProducts(prodData);
      }

      setLoading(false);
    };
    fetchData();
  }, [slug]);

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-10 md:py-20">
        <Container>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-8 font-bold uppercase tracking-widest overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
            <ChevronRight size={14} />
            <span className="text-secondary">{categoryName}</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 border-b border-gray-200 pb-10">
            <div className="space-y-4">
               <h1 className="text-5xl md:text-6xl font-black text-secondary uppercase tracking-tighter leading-none">
                 {categoryName.split(' ')[0]} <span className="text-primary">{categoryName.split(' ').slice(1).join(' ')}</span>
               </h1>
               <p className="text-gray-400 font-medium max-w-xl text-lg">
                 Explorá nuestra colección de aberturas de alta gama, diseñadas para brindar seguridad, estilo y confort a tu hogar.
               </p>
            </div>
            <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
               <div className="px-4 py-2 bg-gray-50 rounded-xl text-gray-400">
                  <LayoutGrid size={18} />
               </div>
               <div className="px-4 py-2 text-gray-300">
                  <Filter size={18} />
               </div>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Actualizando catálogo...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
               <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-6">
                  <Filter size={40} />
               </div>
               <h3 className="text-2xl font-black text-secondary uppercase tracking-tight mb-2">Sin Resultados</h3>
               <p className="text-gray-400 font-medium max-w-xs mx-auto">No hay productos disponibles en esta categoría por el momento. ¡Pronto subiremos novedades!</p>
            </div>
          )}
        </Container>
      </div>
    </Layout>
  );
};

export default CategoryPage;