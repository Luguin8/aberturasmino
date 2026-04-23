import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { faqs } from '../data/mockFAQs';

const FAQPage = () => {
  const [openId, setOpenId] = useState(null);

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <Layout>
      <div className="page-header">
        <div className="container">
          <h1 className="page-header__title">Preguntas Frecuentes</h1>
          <p className="page-header__subtitle">Todo lo que necesitás saber sobre tus compras en Aberturas Miño</p>
        </div>
      </div>

      <div className="container">
        <div className="faq-list">
          {faqs.map((faq) => (
            <div 
              key={faq.id} 
              className={`faq-item ${openId === faq.id ? 'faq-item--open' : ''}`}
            >
              <button className="faq-item__question" onClick={() => toggleFaq(faq.id)}>
                {faq.question}
                <ChevronDown size={20} />
              </button>
              <div className="faq-item__answer">
                <div className="faq-item__answer-content">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default FAQPage;
