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

  // Rutas con íconos específicos de Lucide
  const navLinks = [
    { label: 'Inicio', path: '/', icon: <Home size={20} /> },
    { label: 'Ofertas', path: '/ofertas', icon: <Tag size={20} />, isHighlight: true },
    { label: 'Ventanas', path: '/categoria/6ec021b8-c3c7-4be2-a822-b02019a9c52b', icon: <LayoutGrid size={20} /> },
    { label: 'Puertas', path: '/categoria/9abab4ac-c816-458c-9f5a-cfbb18aa0cae', icon: <DoorClosed size={20} /> },
    { label: 'Muebles', path: '/categoria/muebles-proximamente', icon: <Sofa size={20} /> },
    { label: 'Preguntas Frecuentes', path: '/preguntas-frecuentes', icon: <HelpCircle size={20} /> },
  ];

  return (
    <header className="sticky top-0 z-[200] bg-white shadow-md border-b border-gray-100 flex flex-col">
      <div className="py-4">
        {/* Agregamos px-4-6 extra al container para separar del borde de la pantalla */}
        <Container className="flex items-center justify-between gap-6 md:gap-10">

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden w-12 h-12 flex-shrink-0"
            onClick={onMenuClick}
            aria-label="Abrir menú"
          >
            <Menu size={28} className="text-secondary" />
          </Button>

          {/* Logo con margen izquierdo para que no pegue al borde */}
          <Link to="/" className="flex items-center gap-4 group ml-2 md:ml-0">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-gray-100 overflow-hidden flex-shrink-0 transition-transform group-hover:scale-105">
              <span className="text-[10px] md:text-xs text-gray-400 font-black">LOGO</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-black text-secondary leading-none tracking-tight">
                Aberturas <span className="text-primary">Miño</span>
              </h1>
              <span className="text-[9px] md:text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-1">
                {siteConfig.businessSubtitle}
              </span>
            </div>
          </Link>

          {/* Buscador con padding corregido */}
          <form className="hidden md:flex flex-1 max-w-xl relative" onSubmit={handleSearch}>
            <input
              type="text"
              className="w-full h-14 bg-gray-50 border-2 border-gray-200 focus:border-primary focus:bg-white rounded-2xl pl-12 pr-14 text-lg font-bold text-secondary transition-all outline-none placeholder:text-gray-400"
              placeholder="¿Qué buscás?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={20} />
            </div>
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-primary text-white rounded-xl hover:bg-primary-hover"
            >
              <Search size={22} />
            </button>
          </form>

          {/* Acciones del Header */}
          <div className="flex items-center gap-3">
            <Link to="/admin" className="hidden lg:block">
              <Button variant="ghost" className="h-14 px-4 hover:bg-gray-100">
                <User size={24} className="text-gray-600" />
                <span className="ml-2 font-bold text-gray-700">Admin</span>
              </Button>
            </Link>

            {/* Botón Carrito Reforzado: Forzamos el color para que no se vea vacío */}
            <button
              onClick={onCartClick}
              className="relative flex items-center gap-3 h-12 md:h-14 px-4 md:px-6 bg-secondary text-white rounded-xl hover:bg-secondary-hover transition-all shadow-lg"
            >
              <ShoppingCart size={24} />
              <span className="hidden md:inline text-lg font-black uppercase tracking-tight">Mi Pedido</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-7 h-7 rounded-full flex items-center justify-center border-[3px] border-white font-black">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </Container>
      </div>

      {/* Navegación Desktop con más padding y centrado */}
      <div className="hidden md:block bg-gray-50/80 border-t border-gray-200 backdrop-blur-sm">
        <Container>
          <nav className="flex items-center justify-center h-16">
            <ul className="flex items-center gap-4">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className={`
                        flex items-center gap-2 px-6 py-3 rounded-xl text-[15px] font-black transition-all h-12 uppercase
                        ${link.isHighlight
                          ? 'bg-primary text-white hover:bg-primary-hover shadow-md'
                          : isActive
                            ? 'bg-white text-primary border-2 border-primary/20 shadow-sm'
                            : 'text-gray-500 hover:bg-white hover:text-primary border-2 border-transparent'
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