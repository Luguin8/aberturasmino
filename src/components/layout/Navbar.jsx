import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import Container from '../ui/Container';

const Navbar = ({ isOpen }) => {
  const [categories, setCategories] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const getCategories = async () => {
      const { data } = await supabase.from('categories').select('*');
      if (data) setCategories(data);
    };
    getCategories();
  }, []);

  const navLinks = [
    { label: 'Inicio', path: '/' },
    { label: 'Ofertas', path: '/ofertas' },
    { label: 'Medios de Pago', path: '/medios-de-pago' },
    { label: 'Soporte', path: '/preguntas-frecuentes' },
  ];

  return (
    <nav className={`bg-white border-b border-gray-100 sticky top-20 z-40 transition-all duration-300 hidden md:block`}>
      <Container>
        <ul className="flex items-center justify-center gap-12 h-16">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link 
                to={link.path} 
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-primary ${
                  location.pathname === link.path ? 'text-primary' : 'text-gray-400'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          
          <li className="relative group">
            <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-primary transition-all">
              Catálogo <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
            </button>
            
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
               <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 w-64 overflow-hidden">
                  <div className="space-y-1">
                     <Link to="/categoria/todos" className="block px-4 py-3 rounded-xl hover:bg-gray-50 text-xs font-bold text-secondary transition-colors">
                        Todos los Productos
                     </Link>
                     <div className="h-[1px] bg-gray-50 my-2"></div>
                     {categories.map(cat => (
                        <Link 
                          key={cat.id} 
                          to={`/categoria/${cat.id}`}
                          className="block px-4 py-3 rounded-xl hover:bg-gray-50 text-xs font-bold text-gray-500 hover:text-secondary transition-colors"
                        >
                          {cat.name}
                        </Link>
                     ))}
                  </div>
               </div>
            </div>
          </li>
        </ul>
      </Container>
    </nav>
  );
};

export default Navbar;