import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { faqs } from '../data/mockFAQs';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';

const FAQPage = () => {
  const [openId, setOpenId] = useState(null);

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <>
      <div className="bg-gray-50 min-h-screen py-20">
        <Container>
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-5xl md:text-6xl font-black text-secondary uppercase tracking-tight leading-none">
                Ayuda & <span className="text-primary">Soporte</span>
              </h1>
              <p className="text-gray-400 font-medium text-lg">Todo lo que necesitás saber sobre tus compras y presupuestos en Aberturas Miño.</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => {
                const isOpen = openId === faq.id;
                return (
                  <div 
                    key={faq.id} 
                    className={`bg-white rounded-3xl border transition-all duration-300 ${
                      isOpen ? 'border-primary shadow-xl shadow-primary/5' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <button 
                      className="w-full px-8 py-6 flex items-center justify-between text-left group" 
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-primary' : 'text-secondary group-hover:text-primary'}`}>
                        {faq.question}
                      </span>
                      <div className={`shrink-0 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 bg-primary/10 text-primary' : 'text-gray-300'}`}>
                        <ChevronDown size={18} />
                      </div>
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="px-8 pb-8 text-gray-500 font-medium leading-relaxed">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-secondary rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-2xl font-black uppercase tracking-tight">¿No encontraste lo que buscabas?</h3>
                <p className="text-white/60 font-medium">Nuestro equipo de atención al cliente está listo para ayudarte con cualquier duda técnica.</p>
              </div>
              <Button variant="primary" className="h-14 px-10 gap-2 shrink-0">
                <MessageCircle size={20} />
                WhatsApp Directo
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default FAQPage;
