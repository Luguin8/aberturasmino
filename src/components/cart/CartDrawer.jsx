import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (!isOpen) return null;

  return (
    <div className={`cart-drawer ${isOpen ? 'is-open' : ''}`}>
      <div className="cart-drawer__overlay" onClick={onClose}></div>
      <div className="cart-drawer__content">
        <div className="cart-drawer__header">
          <h3>Tu Carrito</h3>
          <button className="btn-icon" onClick={onClose}><X size={24} /></button>
        </div>

        <div className="cart-drawer__items">
          {cartItems.length === 0 ? (
            <div className="cart-drawer__empty">
              <ShoppingBag size={48} />
              <p>Tu carrito está vacío</p>
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
            <button className="btn btn-primary w-100 mt-3">Finalizar Compra</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;