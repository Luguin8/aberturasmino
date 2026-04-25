// src/components/layout/Layout.jsx
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { X, Home, Tag, Package, HelpCircle } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import WhatsAppButton from '../ui/WhatsAppButton';
import { useCart } from '../../context/CartContext';

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();

  // CORRECCIÓN: Usamos tu custom hook en lugar de intentar extraer el Contexto directamente
  const { cart } = useCart();
  const cartCount = cart?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  // Rutas con IDs de Supabase y diseño accesible
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

      {/* MENÚ MOBILE: Overlay oscuro */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-secondary/60 backdrop-blur-sm z-[300] md:hidden transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* MENÚ MOBILE: Panel lateral accesible */}
      <div className={`
        fixed top-0 left-0 w-[85%] max-w-sm h-full bg-white z-[400] md:hidden transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-6 border-b border-border-light bg-bg-alt">
          <span className="font-black text-secondary text-xl">Menú Principal</span>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 bg-white text-text-light hover:text-primary rounded-xl shadow-sm border border-border-light transition-colors"
            aria-label="Cerrar menú"
          >
            <X size={28} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-3">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`
                      flex items-center gap-4 px-5 py-5 rounded-2xl text-lg font-bold transition-all
                      ${isActive
                        ? 'bg-primary-light text-primary border border-primary/20'
                        : 'text-text hover:bg-bg-alt border border-transparent'}
                    `}
                  >
                    <span className={isActive ? 'text-primary' : 'text-text-light'}>
                      {link.icon}
                    </span>
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Banner inferior de confianza */}
        <div className="p-6 bg-bg-alt border-t border-border-light">
          <p className="text-sm font-bold text-text-light text-center">
            ¿Necesitás ayuda para comprar?<br />Tocá el ícono verde de WhatsApp.
          </p>
        </div>
      </div>

      <main className="flex-1">
        {children}
      </main>

      <Footer />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WhatsAppButton />
    </div>
  );
};

export default Layout;