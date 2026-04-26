import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, MessageCircle, ArrowRight, ImageOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { siteConfig } from '../../data/siteConfig';
import Button from '../ui/Button';

const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount
  } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price || 0);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[1000] bg-secondary/60 backdrop-blur-sm transition-opacity duration-500 ${
          isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Drawer */}
      <div className={`fixed top-0 right-0 z-[1001] h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-500 ease-out ${
        isCartOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <ShoppingBag size={22} />
              </div>
              <div>
                <h2 className="text-xl font-black text-secondary uppercase tracking-tight">Mi Pedido</h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{cartCount} Artículos</p>
              </div>
            </div>
            <button 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-secondary" 
              onClick={() => setIsCartOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {(!cart || cart.length === 0) ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                  <ShoppingBag size={48} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-secondary mb-2">Tu pedido está vacío</h3>
                  <p className="text-gray-400 text-sm max-w-[200px] mx-auto">Aún no sumaste ninguna abertura a tu presupuesto.</p>
                </div>
                <Button variant="primary" onClick={() => setIsCartOpen(false)}>
                  Explorar Productos
                </Button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="group flex gap-4 bg-white rounded-2xl border border-transparent hover:border-gray-100 hover:shadow-lg hover:shadow-gray-100 transition-all p-2 -m-2">
                  <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                    {item.image && !item.image.includes('placeholder') ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <ImageOff size={24} strokeWidth={1.5} className="opacity-70" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 py-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-bold text-secondary line-clamp-2 leading-tight pr-4">{item.name}</h4>
                      <button 
                        className="text-gray-300 hover:text-red-500 transition-colors" 
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {item.selectedOptionsSummary && (
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mb-1">
                        {item.selectedOptionsSummary}
                      </p>
                    )}
                    <p className="text-primary font-black text-sm mb-3">
                      {formatPrice(item.salePrice || item.price)}
                    </p>
                    <div className="flex items-center gap-3 mt-auto">
                      <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                        <button 
                          className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-secondary disabled:opacity-30" 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-xs font-black text-secondary">{item.quantity}</span>
                        <button 
                          className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-secondary" 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart && cart.length > 0 && (
            <div className="p-8 bg-white border-t border-gray-100 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">Total</span>
                  <span className="text-xl font-black text-secondary">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 italic text-center">
                El precio final puede variar dependiendo del método de pago seleccionado en la página de checkout.
              </p>

              <Button 
                variant="secondary" 
                className="w-full h-14 gap-3 text-base" 
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
              >
                Confirmar Presupuesto
                <ArrowRight size={20} />
              </Button>
              
              <p className="text-center text-[10px] text-gray-400 font-medium leading-relaxed">
                El envío se coordinará luego de confirmar el stock. <br />
                Todos los precios están sujetos a cambios.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;