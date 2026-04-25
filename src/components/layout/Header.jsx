import React, { useState } from 'react';
import { Search, User, ShoppingCart, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { siteConfig } from '../../data/siteConfig';
import Button from '../ui/Button';
import Container from '../ui/Container';

const Header = ({ onMenuClick, onCartClick, cartCount = 0 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-[200] bg-white/80 backdrop-blur-md border-b border-gray-100 py-4">
      <Container className="flex items-center justify-between gap-8">
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={onMenuClick}
        >
          <Menu size={24} />
        </Button>

        {/* Logo */}
        <Link to="/" className="flex flex-col group">
          <h1 className="text-2xl md:text-3xl font-black text-secondary leading-none tracking-tight">
            Aberturas <span className="text-primary group-hover:text-primary-hover transition-colors">Miño</span>
          </h1>
          <span className="text-[10px] md:text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
            {siteConfig.businessSubtitle}
          </span>
        </Link>

        {/* Search Bar - Desktop */}
        <form 
          className="hidden md:flex flex-1 max-w-xl relative" 
          onSubmit={handleSearch}
        >
          <input
            type="text"
            className="w-full h-12 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl px-6 pr-14 text-sm font-medium transition-all outline-none"
            placeholder="Buscar aberturas, modelos, medidas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            type="submit" 
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-primary transition-colors"
          >
            <Search size={20} />
          </button>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-3 md:gap-5">
          <Link to="/admin" className="hidden sm:block">
            <Button variant="ghost" className="gap-2">
              <User size={20} className="text-gray-400" />
              <span className="text-sm">Admin</span>
            </Button>
          </Link>

          <Button 
            variant="secondary" 
            className="relative gap-2" 
            onClick={onCartClick}
          >
            <ShoppingCart size={20} />
            <span className="hidden md:inline">Mi Pedido</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white font-bold">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </Container>
    </header>
  );
};

export default Header;