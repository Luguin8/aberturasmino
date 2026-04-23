import React, { useState } from 'react';
import { Search, User, ShoppingCart, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { siteConfig } from '../../data/siteConfig';

const Header = ({ onMenuClick, cartCount = 0 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="header">
      <div className="container">
        <button className="header__menu-btn" onClick={onMenuClick}>
          <Menu size={24} />
        </button>

        <Link to="/" className="header__logo">
          <h1 className="header__logo-name">
            Aberturas <span>Miño</span>
          </h1>
          <span className="header__logo-subtitle">{siteConfig.businessSubtitle}</span>
        </Link>

        <form className="header__search" onSubmit={handleSearch}>
          <input 
            type="text" 
            className="header__search-input" 
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="header__search-btn">
            <Search size={18} />
          </button>
        </form>

        <div className="header__actions">
          <Link to="/admin" className="header__action">
            <User size={22} />
            <span>Ingresá / Registrate</span>
          </Link>
          <button className="header__action header__cart-btn" onClick={onCartClick}>
            <div className="position-relative">
              <ShoppingCart size={22} />
              {cartCount > 0 && <span className="header__cart-count">{cartCount}</span>}
            </div>
            <span>Carrito</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
