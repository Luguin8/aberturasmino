import React from 'react';
import { Link } from 'react-router-dom';
import { Truck } from 'lucide-react';

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link to={`/producto/${product.slug}`} className="product-card">
      <div className="product-card__image-wrapper">
        <img src={product.images[0]} alt={product.name} />
        <div className="product-card__badges">
          {product.discountPercent > 0 && (
            <span className="product-card__badge product-card__badge--discount">
              {product.discountPercent}% OFF
            </span>
          )}
          {product.freeShipping && (
            <span className="product-card__badge product-card__badge--shipping">
              <Truck size={12} />
              Envío gratis
            </span>
          )}
        </div>
      </div>
      <div className="product-card__info">
        <h3 className="product-card__name">{product.name}</h3>
        {product.originalPrice > product.salePrice && (
          <span className="product-card__price-original">
            {formatPrice(product.originalPrice)}
          </span>
        )}
        <span className="product-card__price-current">
          {formatPrice(product.salePrice)}
        </span>
        <p className="product-card__installments">Hasta 12 cuotas sin interés</p>
      </div>
    </Link>
  );
};

export default ProductCard;
