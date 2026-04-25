// src/components/layout/Header.jsx
import React, { useState } from 'react';
import { Search, User, ShoppingCart, Menu, Tag, HelpCircle, DoorClosed, LayoutGrid, Sofa, Home } from 'lucide-react';
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

  const navLinks = [
    { label: 'Inicio', path: '/', icon: <Home size={18} /> },
    { label: 'Ofertas', path: '/ofertas', icon: <Tag size={18} />, isHighlight: true },
    { label: 'Ventanas', path: '/categoria/6ec021b8-c3c7-4be2-a822-b02019a9c52b', icon: <LayoutGrid size={18} /> },
    { label: 'Puertas', path: '/categoria/9abab4ac-c816-458c-9f5a-cfbb18aa0cae', icon: <DoorClosed size={18} /> },
    { label: 'Muebles', path: '/categoria/muebles-proximamente', icon: <Sofa size={18} /> },
    { label: 'Preguntas Frecuentes', path: '/preguntas-frecuentes', icon: <HelpCircle size={18} /> },
  ];

  return (
    <header className="sticky top-0 z-[500] w-full bg-white shadow-sm border-b border-gray-100">
      {/* Fila Superior */}
      <div className="py-4 md:py-6">
        <Container fluid clean className="px-6 md:px-10 lg:px-16 xl:px-20 flex items-center justify-between gap-12 lg:gap-24">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-4 group flex-shrink-0">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-secondary text-white rounded-xl flex items-center justify-center font-black text-xs transition-transform group-hover:scale-105">
              AM
            </div>
            <div className="hidden sm:flex flex-col">
              <h1 className="text-xl md:text-2xl font-black text-secondary leading-none">
                Aberturas <span className="text-primary">Miño</span>
              </h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                {siteConfig.businessSubtitle}
              </p>
            </div>
          </Link>

          {/* Buscador: Refactorizado a Flex para evitar solapamientos */}
          <form className="hidden md:flex flex-1 max-w-2xl group" onSubmit={handleSearch}>
            <div className="relative w-full h-14 bg-gray-50 border-2 border-primary/20 focus-within:border-primary focus-within:bg-white rounded-2xl flex items-center transition-all overflow-hidden">
              <div className="w-20 flex items-center justify-center text-primary/60 group-focus-within:text-primary transition-colors shrink-0">
                <Search size={24} />
              </div>
              <input
                type="text"
                className="flex-1 h-full bg-transparent pl-2 pr-44 text-base font-bold text-secondary outline-none placeholder:text-gray-400"
                placeholder="¿Qué estás buscando hoy?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="search-button-custom absolute right-1.5 top-1.5 bottom-1.5"
              >
                BUSCAR
              </button>
            </div>
          </form>

          {/* Carrito y Admin */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            <Link to="/admin" className="hidden lg:block">
              <Button variant="ghost" className="h-12 px-4 font-bold text-gray-600">
                <User size={20} className="mr-2" /> Admin
              </Button>
            </Link>

            <button
              onClick={onCartClick}
              className="relative flex items-center gap-3 h-12 md:h-14 px-5 md:px-8 bg-secondary text-white rounded-xl hover:bg-secondary-hover transition-all shadow-md active:scale-95"
            >
              <ShoppingCart size={22} />
              <span className="hidden md:inline text-base font-black uppercase tracking-tight">Mi Pedido</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center border-2 border-white font-black shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onMenuClick}
            >
              <Menu size={28} className="text-secondary" />
            </Button>
          </div>
        </Container>
      </div>

      {/* Navegación: Corregido el espaciado (px-8) y el wrap (whitespace-nowrap) */}
      <div className="hidden md:block bg-gray-50 border-t border-gray-100">
        <Container fluid clean className="px-6 md:px-10 lg:px-16 xl:px-20">
          <nav className="flex items-center justify-center overflow-x-auto no-scrollbar py-2">
            <ul className="flex items-center gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className={`
                        flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-black transition-all whitespace-nowrap uppercase tracking-tighter
                        ${link.isHighlight
                          ? 'bg-primary text-white hover:bg-primary-hover shadow-sm'
                          : isActive
                            ? 'bg-white text-primary border border-gray-200 shadow-sm'
                            : 'text-gray-500 hover:text-primary hover:bg-white'
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