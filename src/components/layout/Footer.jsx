import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, MapPin, Phone, Mail } from 'lucide-react';
import { siteConfig } from '../../data/siteConfig';
import { categories } from '../../data/mockCategories';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__col">
            <h3 className="footer__title">Sobre Nosotros</h3>
            <p className="footer__text">
              En {siteConfig.businessName} nos dedicamos a brindar las mejores soluciones en aberturas para tu hogar. 
              Calidad, seguridad y diseño en un solo lugar.
            </p>
            <div className="footer__social">
              <a href={siteConfig.instagram} className="footer__social-link" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href={siteConfig.facebook} className="footer__social-link" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
            </div>
          </div>

          <div className="footer__col">
            <h3 className="footer__title">Categorías</h3>
            <ul className="footer__links">
              {categories.slice(0, 5).map(cat => (
                <li key={cat.id}>
                  <Link to={`/categoria/${cat.slug}`} className="footer__link">{cat.name}</Link>
                </li>
              ))}
              <li><Link to="/ofertas" className="footer__link">Ofertas</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h3 className="footer__title">Información</h3>
            <ul className="footer__links">
              <li><Link to="/medios-de-pago" className="footer__link">Medios de Pago</Link></li>
              <li><Link to="/preguntas-frecuentes" className="footer__link">Preguntas Frecuentes</Link></li>
              <li><Link to="/contacto" className="footer__link">Contacto</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h3 className="footer__title">Contacto</h3>
            <ul className="footer__links">
              <li className="footer__link">
                <MapPin size={16} style={{marginRight: '8px'}} />
                {siteConfig.address}
              </li>
              <li className="footer__link">
                <Phone size={16} style={{marginRight: '8px'}} />
                {siteConfig.whatsappDisplay}
              </li>
              <li className="footer__link">
                <Mail size={16} style={{marginRight: '8px'}} />
                {siteConfig.email}
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} {siteConfig.businessName}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
