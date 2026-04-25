import React, { useState } from 'react';
import { Search, User, ShoppingCart, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { siteConfig } from '../../data/siteConfig';

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
    <header className="header">
      <div className="container">
        <button className="header__menu-btn" onClick={onMenuClick} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer' }}>
          <Menu size={24} />
          <span style={{ fontSize: '15px', fontWeight: 'bold' }}>MENÚ</span>
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
          <button type="submit" className="header__search-btn" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0 15px' }}>
            <Search size={18} />
            <span style={{ fontWeight: 'bold' }}>Buscar</span>
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
            <span>Mi Pedido</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;