import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/home/ProductCard';
import { products } from '../data/mockProducts';
import { categories } from '../data/mockCategories';

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState('relevant');

  useEffect(() => {
    // Find category
    let foundCat = categories.find(c => c.slug === slug);
    
    // Check if it's a subcategory slug
    if (!foundCat) {
      categories.forEach(c => {
        const sub = c.subcategories?.find(s => s.slug === slug);
        if (sub) foundCat = sub;
      });
    }

    setCategory(foundCat);

    // Filter products
    let items = products.filter(p => 
      p.categoryId === foundCat?.id || 
      p.subcategoryId === foundCat?.id ||
      p.categoryId === slug // fallback for legacy or direct slugs
    );

    // Handle special cases (Destacados, etc if they were slugs)
    if (slug === 'destacados') items = products.filter(p => p.featured);
    if (slug === 'ofertas') items = products.filter(p => p.inOffer);

    setFilteredProducts(items);
    window.scrollTo(0, 0);
  }, [slug]);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.salePrice - b.salePrice;
    if (sortBy === 'price-high') return b.salePrice - a.salePrice;
    if (sortBy === 'newest') return b.id.localeCompare(a.id);
    return 0; // Relevant (default)
  });

  return (
    <Layout>
      <div className="page-header">
        <div className="container">
          <h1 className="page-header__title">{category?.name || (slug === 'ofertas' ? 'Ofertas Especiales' : slug)}</h1>
          <p className="page-header__subtitle">Explorá nuestra selección de {category?.name?.toLowerCase() || 'productos'}</p>
        </div>
      </div>

      <div className="container category-page">
        <div className="category-page__filters">
          <span className="category-page__count">
            Mostrando {filteredProducts.length} productos
          </span>
          <div className="category-page__sort">
            <label htmlFor="sort">Ordenar por:</label>
            <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="relevant">Más relevantes</option>
              <option value="price-low">Menor precio</option>
              <option value="price-high">Mayor precio</option>
              <option value="newest">Novedades</option>
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div style={{padding: '50px 0', textAlign: 'center'}}>
            <h3>No se encontraron productos en esta categoría.</h3>
            <Link to="/" className="product-info__btn product-info__btn--secondary" style={{maxWidth: '200px', margin: '20px auto'}}>
              Volver al inicio
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {sortedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryPage;
