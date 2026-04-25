import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  // Buscamos la primera variante para mostrar el precio base
  const defaultVariant = product.product_variants && product.product_variants.length > 0
    ? product.product_variants[0]
    : null;

  const handleAddToCart = (e) => {
    e.preventDefault(); // Evita que al hacer clic en el botón se navegue a la página del producto
    if (!defaultVariant) return;

    addToCart({
      id: defaultVariant.id,
      productId: product.id,
      name: `${product.name} (${defaultVariant.size})`,
      price: defaultVariant.price,
      salePrice: defaultVariant.sale_price || defaultVariant.price,
      image: product.image_url,
    });
  };

  return (
    <Link to={`/producto/${product.id}`} className="product-card">
      <div className="product-card__image">
        <img src={product.image_url || '/placeholder.png'} alt={product.name} />
        {product.in_offer && <span className="product-card__badge badge-offer">Oferta</span>}
        {product.is_featured && !product.in_offer && <span className="product-card__badge badge-featured">Destacado</span>}
      </div>
      <div className="product-card__content">
        <span className="product-card__category">{product.categories?.name}</span>
        <h3 className="product-card__title">{product.name}</h3>

        <div className="product-card__price-row">
          {defaultVariant ? (
            defaultVariant.sale_price ? (
              <>
                <span className="price-old">${defaultVariant.price.toLocaleString()}</span>
                <span className="price-current">${defaultVariant.sale_price.toLocaleString()}</span>
              </>
            ) : (
              <span className="price-current">${defaultVariant.price.toLocaleString()}</span>
            )
          ) : (
            <span className="price-current">Consultar precio</span>
          )}
        </div>

        <button className="btn btn-primary w-100 mt-3" onClick={handleAddToCart}>
          <ShoppingCart size={18} /> Agregar
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;