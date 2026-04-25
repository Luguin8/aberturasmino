import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleWhatsAppCheckout = () => {
    const message = `Hola! Quisiera realizar el siguiente pedido en Aberturas Miño:\n\n` +
      cart.map(item => `- ${item.name} (Cantidad: ${item.quantity}) - ${formatPrice(item.salePrice * item.quantity)}`).join('\n') +
      `\n\n*Total: ${formatPrice(cartTotal)}*` +
      `\n\nMuchas gracias!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${siteConfig.whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className={`cart-drawer ${isOpen ? 'is-open' : ''}`}>
      <div className="cart-drawer__overlay" onClick={onClose}></div>
      <div className="cart-drawer__content">
        <div className="cart-drawer__header">
          <div className="cart-drawer__title">
            <ShoppingBag size={24} />
            Tu Carrito
            <span className="cart-drawer__count">{cartCount}</span>
          </div>
          <button className="cart-drawer__close" onClick={() => setIsCartOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-drawer__items">
          {cartItems.length === 0 ? (
            <div className="cart-drawer__empty">
              <ShoppingBag size={64} />
              <p>Tu carrito está vacío</p>
              <button
                className="product-info__btn product-info__btn--primary"
                style={{ marginTop: '20px' }}
                onClick={() => setIsCartOpen(false)}
              >
                Empezar a comprar
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item__image">
                  {/* Agregamos un placeholder por si falla la imagen */}
                  <img src={item.image || '/placeholder.png'} alt={item.name} />
                </div>
                <div className="cart-item__info">
                  <h4>{item.name}</h4>
                  {/* Protección contra precios nulos */}
                  <p className="cart-item__price">
                    ${(item.salePrice || item.price || 0).toLocaleString()}
                  </p>
                  <div className="cart-item__actions">
                    <div className="quantity-control">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button className="text-red" onClick={() => removeFromCart(item.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>${(cartTotal || 0).toLocaleString()}</span>
            </div>
            <div className="cart-drawer__transfer">
              <span>Pagando por transferencia (20% OFF):</span>
              <span>{formatPrice(cartTotal * 0.8)}</span>
            </div>
            <button
              className="cart-drawer__checkout-btn cart-drawer__checkout-btn--whatsapp"
              onClick={handleWhatsAppCheckout}
            >
              <MessageCircle size={20} />
              Finalizar Pedido por WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;