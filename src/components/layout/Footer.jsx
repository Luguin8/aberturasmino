import React, { useState, useEffect } from 'react';
import { MessageCircle, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../data/siteConfig';
import { supabase } from '../../config/supabase';

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
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__col">
          <h3>Aberturas <span>Miño</span></h3>
          <p>{siteConfig.businessSubtitle}</p>
        </div>
        <div className="footer__col">
          <h4>Categorías</h4>
          <ul>
            {categories.map(c => <li key={c.id}><Link to={`/categoria/${c.id}`}>{c.name}</Link></li>)}
          </ul>
        </div>
        <div className="footer__col">
          <h4>Contacto</h4>
          <ul>
            <li><Phone size={16} /> {siteConfig.phone}</li>
            <li><MapPin size={16} /> {siteConfig.address}</li>
            <li><Mail size={16} /> info@aberturasmino.com</li>
          </ul>
        </div>
      </div>
      <div className="footer__bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Aberturas Miño. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;