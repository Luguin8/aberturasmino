import React from 'react';
import { CreditCard, Banknote, Smartphone, Wallet, Check } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { paymentMethods } from '../data/mockPaymentMethods';

const IconMap = {
  'credit-card': CreditCard,
  'banknote': Banknote,
  'smartphone': Smartphone,
  'wallet': Wallet
};

const PaymentMethodsPage = () => {
  return (
    <Layout>
      <div className="page-header">
        <div className="container">
          <h1 className="page-header__title">Medios de Pago</h1>
          <p className="page-header__subtitle">Elegí la forma de pago que más te convenga y aprovechá nuestros descuentos</p>
        </div>
      </div>

      <div className="container">
        <div className="payment-grid">
          {paymentMethods.map((method) => {
            const Icon = IconMap[method.icon] || CreditCard;
            return (
              <div key={method.id} className="payment-card">
                <div className="payment-card__icon">
                  <Icon size={24} />
                </div>
                <h3 className="payment-card__title">{method.title}</h3>
                {method.discount && (
                  <span className="payment-card__discount">{method.discount}</span>
                )}
                <p className="payment-card__description">{method.description}</p>
                <div className="payment-card__details">
                  <p>{method.details}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="info-box" style={{
          backgroundColor: 'var(--color-bg-alt)', 
          padding: '40px', 
          borderRadius: '12px', 
          marginBottom: '60px',
          border: '1px solid var(--color-border)'
        }}>
          <h2 style={{marginBottom: '20px'}}>Información de Seguridad</h2>
          <ul style={{listStyle: 'none'}}>
            <li style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
              <Check size={20} color="var(--color-accent)" />
              Tus pagos son procesados de forma segura a través de plataformas oficiales.
            </li>
            <li style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
              <Check size={20} color="var(--color-accent)" />
              Enviamos comprobante fiscal por cada compra realizada.
            </li>
            <li style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
              <Check size={20} color="var(--color-accent)" />
              Soporte personalizado vía WhatsApp para cualquier duda con tu pago.
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentMethodsPage;
