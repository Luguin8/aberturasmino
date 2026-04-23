import React from 'react';
import { Phone, HelpCircle, MessageCircle } from 'lucide-react';
import { siteConfig } from '../../data/siteConfig';
import { Link } from 'react-router-dom';

const TopBar = () => {
  return (
    <div className="topbar">
      <div className="container">
        <div className="topbar__left">
          {siteConfig.topBarText}
        </div>
        <div className="topbar__right">
          <a 
            href={`https://wa.me/${siteConfig.whatsappNumber}`} 
            className="topbar__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={14} />
            <span>WhatsApp: {siteConfig.whatsappDisplay}</span>
          </a>
          <Link to="/preguntas-frecuentes" className="topbar__link">
            <HelpCircle size={14} />
            <span>Preguntas frecuentes</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
