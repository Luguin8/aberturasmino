// src/components/layout/Header.jsx
import React, { useState, useEffect } from 'react';
import { Search, User, ShoppingCart, Menu, Tag, HelpCircle, DoorClosed, LayoutGrid, Sofa, Home, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { siteConfig } from '../../data/siteConfig';
import Button from '../ui/Button';
import Container from '../ui/Container';

const Header = ({ onMenuClick, onCartClick, cartCount = 0 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchTerm.trim())}`);
      setIsSearchOpen(false);
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

  // Filtramos las categorías principales para mobile
  const mobileCategories = [
    { label: 'Ventanas', path: '/categoria/6ec021b8-c3c7-4be2-a822-b02019a9c52b' },
    { label: 'Puertas', path: '/categoria/9abab4ac-c816-458c-9f5a-cfbb18aa0cae' },
    { label: 'Ofertas', path: '/ofertas', isHighlight: true },
  ];

  return (
    <header className={`sticky top-0 z-[500] w-full bg-white shadow-sm border-b border-gray-100 transition-all duration-300 ${isScrolled ? 'py-1' : 'py-0'}`}>
      
      {/* Fila Principal */}
      <div className={`transition-all duration-300 ${isScrolled ? 'py-2 md:py-3' : 'py-4 md:py-6'}`}>
        <Container fluid clean className="px-6 md:px-10 lg:px-16 xl:px-20 grid grid-cols-3 md:flex items-center justify-between gap-4 md:gap-12 lg:gap-24">

          {/* Menú Izquierda (Solo Mobile) */}
          <div className="flex md:hidden items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="w-10 h-10 -ml-2"
            >
              <Menu size={24} className="text-secondary" />
            </Button>
          </div>

          {/* Logo (Centrado en mobile, izquierda en desktop) */}
          <div className="flex justify-center md:justify-start">
            <Link to="/" className="flex items-center gap-2 md:gap-4 group flex-shrink-0">
              <div className={`bg-secondary text-white rounded-xl flex items-center justify-center font-black text-[10px] transition-all group-hover:scale-105 ${isScrolled ? 'w-10 h-10' : 'w-11 h-11 md:w-14 md:h-14'}`}>
                AM
              </div>
              <div className="flex flex-col">
                <h1 className={`font-black text-secondary leading-none transition-all ${isScrolled ? 'text-base md:text-xl' : 'text-lg md:text-2xl'}`}>
                  Aberturas <span className="text-primary">Miño</span>
                </h1>
                <p className={`text-gray-500 font-bold uppercase tracking-widest mt-0.5 md:mt-1 transition-all ${isScrolled ? 'text-[8px] md:text-[9px]' : 'text-[9px] md:text-[10px]'}`}>
                  {siteConfig.businessSubtitle}
                </p>
              </div>
            </Link>
          </div>

          {/* Buscador Desktop */}
          <form className="hidden md:flex flex-1 max-w-2xl group mx-8" onSubmit={handleSearch}>
            <div className={`relative w-full bg-gray-50 border-2 border-primary/20 focus-within:border-primary focus-within:bg-white rounded-2xl flex items-center transition-all overflow-hidden ${isScrolled ? 'h-11' : 'h-14'}`}>
              <div className="w-16 flex items-center justify-center text-primary/60 group-focus-within:text-primary transition-colors shrink-0">
                <Search size={20} />
              </div>
              <input
                type="text"
                className="flex-1 h-full bg-transparent pl-0 pr-32 text-sm font-bold text-secondary outline-none placeholder:text-gray-400"
                placeholder="¿Qué estás buscando hoy?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="search-button-custom absolute right-1 top-1 bottom-1 px-6 text-[10px]"
              >
                BUSCAR
              </button>
            </div>
          </form>

          {/* Acciones Derecha */}
          <div className="flex items-center justify-end gap-1 md:gap-4 flex-shrink-0">
            {/* Lupa Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden w-10 h-10"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search size={22} className="text-secondary" />
            </Button>

            <Link to="/admin" className="hidden lg:block">
              <Button variant="ghost" className="h-12 px-4 font-bold text-gray-600">
                <User size={20} className="mr-2" /> Admin
              </Button>
            </Link>

            <button
              onClick={onCartClick}
              className={`relative flex items-center justify-center gap-2 bg-secondary text-white rounded-xl hover:bg-secondary-hover transition-all shadow-md active:scale-95 ${isScrolled ? 'h-10 px-3 md:h-12 md:px-6' : 'h-11 px-3 md:h-14 md:px-8'}`}
            >
              <ShoppingCart className="w-5 h-5 md:w-[22px] md:h-[22px]" />
              <span className="hidden md:inline text-base font-black uppercase tracking-tight">Mi Pedido</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white font-black shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </Container>
      </div>

      {/* Categorías Mobile (3 principales) */}
      <div className="md:hidden bg-white border-t border-gray-50 overflow-hidden">
        <Container fluid clean className="px-4 py-2">
          <ul className="flex items-center justify-between gap-1">
            {mobileCategories.map((link) => (
              <li key={link.label} className="flex-1">
                <Link
                  to={link.path}
                  className={`
                    flex items-center justify-center py-2 px-2 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all
                    ${link.isHighlight
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-gray-500 active:bg-gray-50'
                    }
                  `}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>

      {/* Navegación Desktop */}
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

      {/* Overlay de Búsqueda Mobile */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-white z-[1000] flex flex-col p-6 animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center justify-between mb-8">
            <span className="font-black text-secondary text-xl">Buscar producto</span>
            <button onClick={() => setIsSearchOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={32} className="text-secondary" />
            </button>
          </div>
          
          <form onSubmit={handleSearch} className="relative">
            <input
              autoFocus
              type="text"
              className="w-full h-16 bg-gray-50 border-2 border-primary rounded-2xl px-6 text-lg font-bold text-secondary outline-none"
              placeholder="¿Qué estás buscando?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-3 bottom-3 px-6 bg-primary text-white font-black rounded-xl text-sm">
              BUSCAR
            </button>
          </form>

          <div className="mt-8">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Sugerencias</p>
            <div className="flex flex-wrap gap-2">
              {['Ventanas aluminio', 'Puertas chapa', 'Puertas madera'].map(sug => (
                <button 
                  key={sug} 
                  onClick={() => { setSearchTerm(sug); }}
                  className="px-4 py-2 bg-gray-100 hover:bg-primary hover:text-white rounded-lg text-sm font-bold transition-all"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;