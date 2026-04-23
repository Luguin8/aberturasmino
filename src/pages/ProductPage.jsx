import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Truck, MessageCircle, ShoppingCart, ChevronRight, Plus, Minus } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { products } from '../data/mockProducts';
import { categories } from '../data/mockCategories';
import { useCart } from '../context/CartContext';
import ProductRow from '../components/home/ProductRow';

const ProductPage = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    const foundProduct = products.find((p) => p.slug === slug);
    if (foundProduct) {
      setProduct(foundProduct);
      setMainImage(foundProduct.images[0]);
      window.scrollTo(0, 0);
    }
  }, [slug]);

  if (!product) {
    return (
      <Layout>
        <div className="container" style={{padding: '100px 0', textAlign: 'center'}}>
          <h2>Producto no encontrado</h2>
          <Link to="/" className="product-info__btn product-info__btn--secondary" style={{maxWidth: '200px', margin: '20px auto'}}>
            Volver al inicio
          </Link>
        </div>
      </Layout>
    );
  }

  const category = categories.find(c => c.id === product.categoryId);
  const relatedProducts = products.filter(p => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 8);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Layout>
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Inicio</Link>
          <span className="breadcrumb__separator"><ChevronRight size={14} /></span>
          <Link to={`/categoria/${category?.slug}`}>{category?.name}</Link>
          <span className="breadcrumb__separator"><ChevronRight size={14} /></span>
          <span className="breadcrumb__current">{product.name}</span>
        </div>

        <div className="product-detail">
          {/* Gallery */}
          <div className="product-gallery">
            <div className="product-gallery__thumbs">
              {product.images.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`product-gallery__thumb ${mainImage === img ? 'product-gallery__thumb--active' : ''}`}
                  onClick={() => setMainImage(img)}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} />
                </div>
              ))}
            </div>
            <div className="product-gallery__main">
              <img src={mainImage} alt={product.name} />
              {product.discountPercent > 0 && (
                <div className="product-gallery__discount">-{product.discountPercent}% OFF</div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="product-info">
            <h1 className="product-info__name">{product.name}</h1>
            
            {product.freeShipping && (
              <div className="product-info__shipping">
                <Truck size={14} />
                Envío gratis a todo el país
              </div>
            )}

            <div className="product-info__price">
              {product.originalPrice > product.salePrice && (
                <div className="product-info__price-original">{formatPrice(product.originalPrice)}</div>
              )}
              <div className="product-info__price-current">{formatPrice(product.salePrice)}</div>
            </div>

            <p className="product-info__installments">Hasta 12 cuotas sin interés</p>

            <div className="product-info__payments">
              <div className="product-info__payment-row">
                <span className="product-info__payment-label">Transferencia bancaria</span>
                <span className="product-info__payment-value" style={{color: 'var(--color-accent)'}}>-20% OFF</span>
              </div>
              <div className="product-info__payment-row">
                <span className="product-info__payment-label">Total por transferencia:</span>
                <span className="product-info__payment-value">{formatPrice(product.salePrice * 0.8)}</span>
              </div>
            </div>

            <div className="product-info__quantity">
              <span className="product-info__quantity-label">Cantidad:</span>
              <div className="product-info__quantity-controls">
                <button className="product-info__quantity-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus size={18} />
                </button>
                <input type="text" className="product-info__quantity-value" value={quantity} readOnly />
                <button className="product-info__quantity-btn" onClick={() => setQuantity(quantity + 1)}>
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <div className="product-info__actions">
              <button className="product-info__btn product-info__btn--primary" onClick={() => addToCart(product, quantity)}>
                <ShoppingCart size={20} />
                Agregar al carrito
              </button>
              <a 
                href={`https://wa.me/5493777817571?text=${encodeURIComponent(`Hola! Me interesa el producto: ${product.name}`)}`}
                className="product-info__btn product-info__btn--whatsapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={20} />
                Consultar por WhatsApp
              </a>
            </div>

            {/* Specs */}
            <div className="product-specs">
              <h3 className="product-specs__title">Especificaciones</h3>
              <table className="product-specs__table">
                <tbody>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <tr key={key}>
                      <td style={{textTransform: 'capitalize'}}>{key}</td>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <ProductRow title="Productos Relacionados" products={relatedProducts} />
        )}
      </div>
    </Layout>
  );
};

export default ProductPage;
