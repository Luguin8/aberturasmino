import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categories } from '../../data/mockCategories';

const Navbar = ({ isOpen }) => {
  return (
    <nav className={`navbar ${isOpen ? 'navbar--mobile-open' : ''}`}>
      <div className="container">
        <ul className="navbar__list">
          {categories.map((cat) => (
            <li key={cat.id} className="navbar__item">
              <Link to={`/categoria/${cat.slug}`} className="navbar__link">
                {cat.name}
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <ChevronDown size={14} />
                )}
              </Link>
              
              {cat.subcategories && cat.subcategories.length > 0 && (
                <div className="navbar__dropdown">
                  {cat.subcategories.map((sub) => (
                    <Link 
                      key={sub.id} 
                      to={`/categoria/${sub.slug}`} 
                      className="navbar__dropdown-link"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
          <li className="navbar__item">
            <Link to="/ofertas" className="navbar__link">Ofertas</Link>
          </li>
          <li className="navbar__item">
            <Link to="/medios-de-pago" className="navbar__link">Medios de Pago</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
