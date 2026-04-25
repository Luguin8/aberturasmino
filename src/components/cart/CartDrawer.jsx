import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { siteConfig } from '../../data/siteConfig';

const CartDrawer = () => {
  // Nota: Mantenemos las variables de contexto que usó tu socio
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount
  } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price || 0); // Protección por si el precio es 0
  };

  const handleWhatsAppCheckout = () => {
    const message = `¡Hola, gente de Aberturas Miño! 👋\nQuisiera consultar la disponibilidad y confirmar el presupuesto de este pedido:\n\n` +
      cart.map(item => {
        const itemPrice = item.salePrice || item.price || 0;
        return `- ${item.name} (Cantidad: ${item.quantity}) - ${formatPrice(itemPrice * item.quantity)}`;
      }).join('\n') +
      `\n\n*Total estimado: ${formatPrice(cartTotal)}*` +
      `\n\nEspero su respuesta, ¡gracias!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${siteConfig.whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <>
      <div
        className={`cart-overlay ${isCartOpen ? 'cart-overlay--open' : ''}`}
        onClick={() => setIsCartOpen(false)}
      ></div>

      <div className={`cart-drawer ${isCartOpen ? 'cart-drawer--open' : ''}`}>
        <div className="cart-drawer__header">
          <div className="cart-drawer__title">
            <ShoppingBag size={24} />
            Mi Pedido
            <span className="cart-drawer__count">{cartCount}</span>
          </div>
          <button className="cart-drawer__close" onClick={() => setIsCartOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-drawer__items">
          {(!cart || cart.length === 0) ? (
            <div className="cart-drawer__empty">
              <ShoppingBag size={64} />
              <p>Aún no sumaste aberturas a tu pedido</p>
              <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => setIsCartOpen(false)}>
                Ver catálogo
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item__image">
                  {/* FIX BACKEND: Cambiado de item.images[0] a item.image con protección */}
                  <img src={item.image || '/placeholder.png'} alt={item.name} />
                </div>
                <div className="cart-item__info">
                  <h4 className="cart-item__name">{item.name}</h4>
                  {/* FIX BACKEND: Protección contra precios nulos */}
                  <div className="cart-item__price">{formatPrice(item.salePrice || item.price)}</div>
                  <div className="cart-item__controls">
                    <button
                      className="cart-item__qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="cart-item__qty">{item.quantity}</span>
                    <button
                      className="cart-item__qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      className="cart-item__remove text-red"
                      onClick={() => removeFromCart(item.id)}
                      style={{ marginLeft: 'auto' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart && cart.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__total">
              <span className="cart-drawer__total-label">Total:</span>
              <span className="cart-drawer__total-value">{formatPrice(cartTotal)}</span>
            </div>
            <div className="cart-drawer__transfer" style={{ fontSize: '13px', color: '#10b981', marginBottom: '15px' }}>
              <span>Pagando por transferencia (20% OFF): </span>
              <strong>{formatPrice(cartTotal * 0.8)}</strong>
            </div>
            <button
              className="btn w-100"
              style={{ backgroundColor: '#25D366', color: 'white', display: 'flex', justifyContent: 'center', gap: '8px' }}
              onClick={handleWhatsAppCheckout}
            >
              <MessageCircle size={20} />
              Enviar Pedido por WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;