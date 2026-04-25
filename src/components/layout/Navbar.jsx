import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';

const Navbar = ({ isOpen }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      const { data } = await supabase.from('categories').select('*');
      if (data) setCategories(data);
    };
    getCategories();
  }, []);

  return (
    <nav className={`navbar ${isOpen ? 'is-open' : ''}`}>
      <div className="container">
        <ul className="navbar__list">
          <li className="navbar__item"><Link to="/" className="navbar__link">Inicio</Link></li>
          <li className="navbar__item has-dropdown">
            <span className="navbar__link">Productos <ChevronDown size={16} /></span>
            <ul className="navbar__dropdown">
              {categories.map(cat => (
                <li key={cat.id}><Link to={`/categoria/${cat.id}`}>{cat.name}</Link></li>
              ))}
            </ul>
          </li>
          <li className="navbar__item"><Link to="/ofertas" className="navbar__link">Ofertas</Link></li>
          <li className="navbar__item"><Link to="/preguntas-frecuentes" className="navbar__link">Preguntas Frecuentes</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;