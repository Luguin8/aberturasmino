import React from 'react';
import { MessageCircle } from 'lucide-react';
import { siteConfig } from '../../data/siteConfig';

const WhatsAppButton = () => {
  return (
    <a 
      href={`https://wa.me/${siteConfig.whatsappNumber}`} 
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={32} />
    </a>
  );
};

export default WhatsAppButton;
