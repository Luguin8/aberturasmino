import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, MessageCircle, Phone, MapPin, Mail, Instagram, ArrowRight } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import { siteConfig } from '../data/siteConfig';

const SuccessPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-20">
        <Container>
          <div className="max-w-3xl mx-auto">
            {/* Success Card */}
            <div className="bg-white rounded-3xl shadow-2xl shadow-primary/5 overflow-hidden border border-gray-100">
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
                      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                        <MessageCircle size={24} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">WhatsApp</p>
                        <p className="font-bold text-secondary">{siteConfig.phone}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                        <MapPin size={24} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Ubicación</p>
                        <p className="font-bold text-secondary text-sm">{siteConfig.address}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                        <Mail size={24} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Email</p>
                        <p className="font-bold text-secondary">ventas@aberturasmino.com</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                        <Instagram size={24} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Instagram</p>
                        <p className="font-bold text-secondary">@aberturasmino</p>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
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
            <p className="text-center mt-12 text-gray-400 text-sm font-medium">
              Si no recibes una respuesta en 24hs, por favor llámanos directamente.
            </p>
          </div>
        </Container>
      </div>
    </Layout>
  );
};

export default SuccessPage;
