// src/components/layout/Layout.jsx
import React, { useState, useContext } from 'react';
import { useLocation, Link, Outlet } from 'react-router-dom'; // Importamos Outlet
import { X, Home, Tag, Package, HelpCircle } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import WhatsAppButton from '../ui/WhatsAppButton';
import { CartContext } from '../../context/CartContext';

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();

  const { cart } = useContext(CartContext) || { cart: [] };
  const cartCount = cart?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const navLinks = [
    { label: 'Inicio', path: '/', icon: <Home size={24} /> },
    { label: 'Ofertas', path: '/ofertas', icon: <Tag size={24} /> },
    { label: 'Ventanas', path: '/categoria/6ec021b8-c3c7-4be2-a822-b02019a9c52b', icon: <Package size={24} /> },
    { label: 'Puertas', path: '/categoria/9abab4ac-c816-458c-9f5a-cfbb18aa0cae', icon: <Package size={24} /> },
    { label: 'Muebles', path: '/categoria/muebles-proximamente', icon: <Package size={24} /> },
    { label: 'Preguntas Frecuentes', path: '/preguntas-frecuentes', icon: <HelpCircle size={24} /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <Header
        onMenuClick={() => setIsMenuOpen(true)}
        onCartClick={() => setIsCartOpen(true)}
        cartCount={cartCount}
      />

      {/* Menú Mobile */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-secondary/60 backdrop-blur-sm z-[300] md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <div className={`
        fixed top-0 left-0 w-[85%] max-w-sm h-full bg-white z-[400] md:hidden transform transition-transform duration-300
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* ... contenido del menú mobile igual al anterior ... */}
      </div>

      {/* Aquí es donde ocurre la magia: Outlet renderiza la ruta hija */}
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WhatsAppButton />
    </div>
  );
};

export default Layout;