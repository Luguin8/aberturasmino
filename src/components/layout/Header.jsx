// src/components/layout/Header.jsx
import React, { useState } from 'react';
import { Search, User, ShoppingCart, Menu, Tag, HelpCircle, Package, Home } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { siteConfig } from '../../data/siteConfig';
import Button from '../ui/Button';
import Container from '../ui/Container';

const Header = ({ onMenuClick, onCartClick, cartCount = 0 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Rutas hardcodeadas con los IDs exactos de Supabase
  const navLinks = [
    { label: 'Inicio', path: '/', icon: <Home size={20} /> },
    { label: 'Ofertas', path: '/ofertas', icon: <Tag size={20} />, isHighlight: true },
    { label: 'Ventanas', path: '/categoria/6ec021b8-c3c7-4be2-a822-b02019a9c52b', icon: <Package size={20} /> },
    { label: 'Puertas', path: '/categoria/9abab4ac-c816-458c-9f5a-cfbb18aa0cae', icon: <Package size={20} /> },
    { label: 'Muebles', path: '/categoria/muebles-proximamente', icon: <Package size={20} /> },
    { label: 'Preguntas Frecuentes', path: '/preguntas-frecuentes', icon: <HelpCircle size={20} /> },
  ];

  return (
    <header className="sticky top-0 z-[200] bg-white shadow-md border-b border-gray-100 flex flex-col">
      {/* Fila Superior: Logo, Buscador y Carrito */}
      <div className="py-4">
        <Container className="flex items-center justify-between gap-4 md:gap-8">

          {/* Botón Menú Mobile (Touch Target Ampliado) */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden w-12 h-12 flex-shrink-0"
            onClick={onMenuClick}
            aria-label="Abrir menú"
          >
            <Menu size={28} className="text-secondary" />
          </Button>

          {/* Área del Logo con Espacio Preparado */}
          <Link to="/" className="flex items-center gap-3 md:gap-4 group">
            {/* Contenedor Cuadrado para el PNG */}
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-gray-100 overflow-hidden flex-shrink-0 transition-transform group-hover:scale-105">
              {/* CUANDO TENGAS EL LOGO, DESCOMENTA LA LÍNEA DE ABAJO Y BORRA EL SPAN */}
              {/* <img src="/logo.png" alt="Aberturas Miño" className="w-full h-full object-cover" /> */}
              <span className="text-[10px] md:text-xs text-gray-400 font-black">LOGO</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl md:text-3xl font-black text-secondary leading-none tracking-tight">
                Aberturas <span className="text-primary group-hover:text-primary-hover transition-colors">Miño</span>
              </h1>
              <span className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-[0.1em] mt-1">
                {siteConfig.businessSubtitle}
              </span>
            </div>
          </Link>

          {/* Buscador Optimizado para Cognición Visual */}
          <form
            className="hidden md:flex flex-1 max-w-xl relative"
            onSubmit={handleSearch}
          >
            <input
              type="text"
              className="w-full h-14 bg-gray-50 border-2 border-gray-200 focus:border-primary focus:bg-white rounded-2xl px-6 pr-14 text-lg font-bold text-secondary transition-all outline-none placeholder:text-gray-400 placeholder:font-medium"
              placeholder="¿Qué buscás? (Ej: Puerta inyectada)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors"
              aria-label="Buscar"
            >
              <Search size={22} />
            </button>
          </form>

          {/* Acciones */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            <Link to="/admin" className="hidden lg:block">
              <Button variant="ghost" className="gap-2 h-14 px-4 hover:bg-gray-100">
                <User size={24} className="text-gray-600" />
                <span className="text-base font-bold text-gray-700">Admin</span>
              </Button>
            </Link>

            <Button
              variant="secondary"
              className="relative gap-3 h-12 md:h-14 px-4 md:px-6 rounded-xl hover:bg-secondary-hover"
              onClick={onCartClick}
            >
              <ShoppingCart size={24} />
              <span className="hidden md:inline text-lg font-bold">Mi Pedido</span>
              {cartCount > 0 && (
                <span className="absolute -top-3 -right-3 bg-primary text-white text-sm w-7 h-7 rounded-full flex items-center justify-center border-[3px] border-white font-black shadow-md">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </Container>
      </div>

      {/* Fila Inferior: Navegación Principal (Solo Desktop) */}
      <div className="hidden md:block bg-gray-50/80 border-t border-gray-200 backdrop-blur-sm">
        <Container>
          <nav className="flex items-center h-16">
            <ul className="flex items-center gap-3 w-full">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className={`
                          flex items-center gap-2 px-5 py-3 rounded-xl text-base font-bold transition-all h-12
                          ${link.isHighlight
                          ? 'bg-primary text-white hover:bg-primary-hover shadow-sm'
                          : isActive
                            ? 'bg-white text-primary border border-gray-200 shadow-sm'
                            : 'text-gray-600 hover:bg-white hover:text-primary hover:border-gray-200 border border-transparent'
                        }
                        `}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </Container>
      </div>
    </header>
  );
};

export default Header;