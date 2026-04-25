import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useCart } from '../context/CartContext';
import { supabase } from '../config/supabase';
import { Check, ChevronRight, ShoppingCart, MessageCircle } from 'lucide-react';

const ProductPage = () => {
  const { slug } = useParams(); // 'slug' aquí actúa como el ID del producto
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      // Buscamos el producto y sus variantes relacionadas
      const { data, error } = await supabase
        .from('products')
        .select('*, product_variants(*)')
        .eq('id', slug)
        .single();

      if (error || !data) {
        console.error("Error cargando producto:", error);
        navigate('/');
        return;
      }

      setProduct(data);
      if (data.product_variants?.length > 0) {
        setSelectedVariant(data.product_variants[0]);
      }
      setLoading(false);
    };

    fetchProductData();
  }, [slug, navigate]);

  if (loading) return <Layout><div className="container p-5">Cargando producto...</div></Layout>;

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    // Adaptamos la estructura para el carrito
    const itemToCart = {
      id: selectedVariant.id,
      productId: product.id,
      name: `${product.name} (${selectedVariant.size})`,
      price: selectedVariant.price,
      salePrice: selectedVariant.sale_price || selectedVariant.price,
      image: product.image_url,
    };

    addToCart(itemToCart);
  };

  return (
    <Layout>
      <div className="product-page">
        <div className="container">
          <div className="product-detail">
            <div className="product-detail__image">
              <img src={product.image_url || '/placeholder.png'} alt={product.name} />
            </div>

            <div className="product-detail__info">
              <h1 className="product-title">{product.name}</h1>
              <p className="product-model">{product.model} - Línea {product.line_type}</p>

              <div className="product-price-section">
                {selectedVariant?.sale_price ? (
                  <>
                    <span className="price-old">${selectedVariant.price.toLocaleString()}</span>
                    <span className="price-current">${selectedVariant.sale_price.toLocaleString()}</span>
                  </>
                ) : (
                  <span className="price-current">${selectedVariant?.price.toLocaleString()}</span>
                )}
              </div>

              <div className="product-variants-select">
                <label>Seleccionar Medida:</label>
                <div className="variant-options">
                  {product.product_variants.map((v) => (
                    <button
                      key={v.id}
                      className={`variant-btn ${selectedVariant?.id === v.id ? 'active' : ''}`}
                      onClick={() => setSelectedVariant(v)}
                    >
                      {v.size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="product-actions">
                <button className="btn btn-primary" onClick={handleAddToCart}>
                 <ShoppingCart size={20} /> Sumar al pedido
                </button>
                <a
                  href={`https://wa.me/5493794000000?text=¡Hola! Quería hacerles una consulta sobre la ${product.name} en medida ${selectedVariant?.size}`}
                  className="btn btn-outline-success"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                <MessageCircle size={20} /> Consultar dudas por WhatsApp
                </a>
              </div>

              <div className="product-specs-brief">
                <div className="spec-item"><strong>Material:</strong> {product.material}</div>
                <div className="spec-item"><strong>Color:</strong> {product.color}</div>
                <div className="spec-item"><strong>Vidrio:</strong> {product.glass}</div>
              </div>
            </div>
          </div>

          <div className="product-extra-info">
            <div className="info-section">
              <h3>Descripción y Accesorios</h3>
              <ul>
                {product.accessories?.map((acc, i) => <li key={i}><Check size={16} /> {acc}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;