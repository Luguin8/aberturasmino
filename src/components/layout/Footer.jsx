import React, { useState, useEffect } from 'react';
import { MessageCircle, MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../data/siteConfig';
import { supabase } from '../../config/supabase';
import Container from '../ui/Container';

const Footer = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      const { data } = await supabase.from('categories').select('*').limit(4);
      if (data) setCategories(data);
    };
    fetchCats();
  }, []);

  return (
    <footer className="bg-secondary text-white pt-20 pb-10">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="space-y-6">
            <Link to="/" className="flex flex-col">
              <h3 className="text-2xl font-black leading-none">
                Aberturas <span className="text-primary">Miño</span>
              </h3>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                {siteConfig.businessSubtitle}
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Fabricación propia de aberturas de aluminio de alta calidad. 
              Soluciones a medida para cada proyecto.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Links Col */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider text-sm">Empresa</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-primary transition-colors">Inicio</Link></li>
              <li><Link to="/ofertas" className="hover:text-primary transition-colors">Ofertas</Link></li>
              <li><Link to="/preguntas-frecuentes" className="hover:text-primary transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link to="/admin" className="hover:text-primary transition-colors">Administración</Link></li>
            </ul>
          </div>

          {/* Categories Col */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider text-sm">Productos</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              {categories.map(c => (
                <li key={c.id}>
                  <Link to={`/categoria/${c.id}`} className="hover:text-primary transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider text-sm">Contacto</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-primary mt-1" />
                <span>{siteConfig.phone}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary mt-1" />
                <span>{siteConfig.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-primary mt-1" />
                <span>info@aberturasmino.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-xs font-medium">
          <p>&copy; {new Date().getFullYear()} Aberturas Miño. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Políticas de Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;