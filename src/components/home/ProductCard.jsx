import React from 'react';
import { ShoppingCart, Eye, ImageOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const ProductCard = ({ product }) => {
  const { addToCart, setIsCartOpen } = useCart();

  const defaultVariant = product.product_variants && product.product_variants.length > 0
    ? product.product_variants[0]
    : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!defaultVariant) return;

    addToCart({
      id: defaultVariant.id,
      productId: product.id,
      name: `${product.name} (${defaultVariant.size})`,
      price: defaultVariant.price,
      salePrice: defaultVariant.sale_price || defaultVariant.price,
      image: product.image_url,
    });
    setIsCartOpen(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price || 0);
  };

  return (
    <Link 
      to={`/producto/${product.id}`} 
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col h-full"
    >
      {/* Image Wrapper */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50 animate-pulse">
        {product.image_url && !product.image_url.includes('placeholder') ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onLoad={(e) => e.currentTarget.parentElement.classList.remove('animate-pulse')}
            onError={(e) => { 
              e.target.onerror = null; 
              e.target.src = '/placeholder.png';
              e.currentTarget.parentElement.classList.remove('animate-pulse');
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400 gap-2">
            <ImageOff size={40} strokeWidth={1.5} className="opacity-80" />
            <span className="text-[10px] font-black uppercase tracking-widest">Sin foto</span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.in_offer && <Badge variant="offer">Oferta</Badge>}
          {product.is_featured && <Badge variant="featured">Destacado</Badge>}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
           <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl">
              <Eye size={20} className="text-secondary" />
           </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
          {product.categories?.name || 'Abertura'}
        </span>
        <h3 className="text-lg font-bold text-secondary mb-4 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        <div className="mt-auto pt-4 flex flex-col gap-4">
          <div className="flex items-baseline gap-2">
            {defaultVariant ? (
              defaultVariant.sale_price ? (
                <>
                  <span className="text-2xl font-black text-secondary">
                    {formatPrice(defaultVariant.sale_price)}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(defaultVariant.price)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-black text-secondary">
                  {formatPrice(defaultVariant.price)}
                </span>
              )
            ) : (
              <span className="text-lg font-bold text-gray-400 italic">Consultar precio</span>
            )}
          </div>

          <Button 
            variant={defaultVariant?.sale_price ? 'primary' : 'secondary'} 
            className="w-full gap-2 text-sm" 
            onClick={handleAddToCart}
            disabled={!defaultVariant}
          >
            <ShoppingCart size={18} />
            Sumar al pedido
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;