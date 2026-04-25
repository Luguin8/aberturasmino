import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('aberturas_mino_cart');
      if (!savedCart) return [];
      const parsed = JSON.parse(savedCart);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Error parsing cart from localStorage:", error);
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('aberturas_mino_cart', JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const cartArray = Array.isArray(prevCart) ? prevCart : [];
      const existingItem = cartArray.find((item) => item.id === product.id);
      if (existingItem) {
        return cartArray.map((item) =>
          item.id === product.id ? { ...item, quantity: (item.quantity || 0) + quantity } : item
        );
      }
      return [...cartArray, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => (Array.isArray(prevCart) ? prevCart.filter((item) => item.id !== productId) : []));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCart((prevCart) =>
      (Array.isArray(prevCart) ? prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      ) : [])
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const safeCart = Array.isArray(cart) ? cart : [];
  const cartTotal = safeCart.reduce((total, item) => {
    const price = item.salePrice || item.price || 0;
    const qty = item.quantity || 0;
    return total + (price * qty);
  }, 0);
  
  const cartCount = safeCart.reduce((total, item) => total + (item.quantity || 0), 0);

  return (
    <CartContext.Provider value={{
      cart: safeCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
