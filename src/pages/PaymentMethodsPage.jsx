import React from 'react';
import { CreditCard, Banknote, Smartphone, Wallet, Check, ShieldCheck, Info } from 'lucide-react';
import { paymentMethods } from '../data/mockPaymentMethods';
import Container from '../components/ui/Container';
import Badge from '../components/ui/Badge';

const IconMap = {
  'credit-card': CreditCard,
  'banknote': Banknote,
  'smartphone': Smartphone,
  'wallet': Wallet
};

const PaymentMethodsPage = () => {
  return (
    <>
      <div className="bg-gray-50 min-h-screen py-20">
        <Container>
          <div className="max-w-4xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h1 className="text-5xl md:text-6xl font-black text-secondary uppercase tracking-tight leading-none">
                Medios de <span className="text-primary">Pago</span>
              </h1>
              <p className="text-gray-400 font-medium text-lg max-w-2xl mx-auto">
                Elegí la forma que más te convenga. En <span className="text-secondary font-bold">Aberturas Miño</span> ofrecemos múltiples opciones con beneficios exclusivos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {paymentMethods.map((method) => {
                const Icon = IconMap[method.icon] || CreditCard;
                return (
                  <div key={method.id} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                    
                    <div className="relative space-y-6">
                      <div className="w-14 h-14 bg-secondary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-secondary/20">
                        <Icon size={28} />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-black text-secondary uppercase tracking-tight">{method.title}</h3>
                          {method.discount && (
                            <Badge variant="success" className="animate-pulse">{method.discount}</Badge>
                          )}
                        </div>
                        <p className="text-gray-400 font-medium leading-relaxed">{method.description}</p>
                      </div>

                      <div className="pt-6 border-t border-gray-50">
                        <p className="text-sm font-bold text-secondary flex items-center gap-2">
                           <Info size={16} className="text-primary" />
                           {method.details}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-10 md:p-16 flex flex-col md:flex-row gap-12 items-center">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 shrink-0">
                  <ShieldCheck size={48} />
                </div>
                <div className="space-y-6 flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-black text-secondary uppercase tracking-tight">Transacciones 100% Seguras</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Procesamiento a través de plataformas oficiales",
                      "Emisión de comprobante fiscal digital",
                      "Soporte personalizado vía WhatsApp",
                      "Garantía de satisfacción Miño"
                    ].map((text, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-500 font-bold text-sm bg-gray-50 p-4 rounded-xl">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
                          <Check size={12} />
                        </div>
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default PaymentMethodsPage;
