// src/pages/SuccessPage.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, MessageCircle, Phone, MapPin, Mail, ArrowRight } from 'lucide-react';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import { siteConfig } from '../data/siteConfig';

const SuccessPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="bg-bg min-h-screen py-20">
        <Container>
          <div className="max-w-3xl mx-auto">
            {/* Success Card */}
            <div className="bg-white rounded-3xl shadow-2xl shadow-primary/5 overflow-hidden border border-border-light">
              <div className="bg-primary p-12 text-center text-white relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce">
                    <CheckCircle2 size={48} className="text-primary" />
                  </div>
                  <h1 className="text-4xl font-black mb-4 tracking-tight">¡Pedido Confirmado!</h1>
                  <p className="text-white/80 text-lg font-medium max-w-md mx-auto">
                    Gracias por confiar en Aberturas Miño. Tu pedido ha sido enviado y nos pondremos en contacto pronto.
                  </p>
                </div>
              </div>

              <div className="p-10 md:p-16 space-y-12">
                {/* Contact Info */}
                <section>
                  <h2 className="text-xl font-bold text-secondary mb-8 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-secondary/5 flex items-center justify-center">
                      <Phone size={18} className="text-secondary" />
                    </div>
                    Información de Contacto
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-bg flex items-center justify-center shrink-0">
                        <MessageCircle size={24} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-text-light uppercase tracking-widest mb-1">WhatsApp</p>
                        <p className="font-bold text-secondary">{siteConfig.phone}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-bg flex items-center justify-center shrink-0">
                        <MapPin size={24} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-text-light uppercase tracking-widest mb-1">Ubicación</p>
                        <p className="font-bold text-secondary text-sm">{siteConfig.address}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-bg flex items-center justify-center shrink-0">
                        <Mail size={24} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-text-light uppercase tracking-widest mb-1">Email</p>
                        <p className="font-bold text-secondary">ventas@aberturasmino.com</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-bg flex items-center justify-center shrink-0">
                        {/* Custom Instagram SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-black text-text-light uppercase tracking-widest mb-1">Instagram</p>
                        <p className="font-bold text-secondary">@aberturasmino</p>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="pt-8 border-t border-border-light flex flex-col sm:flex-row gap-4">
                  <Link to="/" className="flex-1">
                    <Button variant="secondary" className="w-full h-14 gap-2">
                      Volver al Inicio
                    </Button>
                  </Link>
                  <a href={`https://wa.me/${siteConfig.whatsappNumber}`} target="_blank" rel="noreferrer" className="flex-1">
                    <Button variant="outline" className="w-full h-14 gap-2 border-primary text-primary hover:bg-primary hover:text-white">
                      Consultar por WhatsApp <ArrowRight size={18} />
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Note */}
            <p className="text-center mt-12 text-text-light text-sm font-medium">
              Si no recibes una respuesta en 24hs, por favor llámanos directamente.
            </p>
          </div>
        </Container>
      </div>
    </>
  );
};

export default SuccessPage;