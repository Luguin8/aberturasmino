import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import './styles/layout.css';
import './styles/home.css';
import './styles/product.css';
import './styles/cart.css';
import './styles/pages.css';
import './styles/admin.css';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import FAQPage from './pages/FAQPage';
import PaymentMethodsPage from './pages/PaymentMethodsPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';

import { CartProvider } from './context/CartContext';

function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/producto/:slug" element={<ProductPage />} />
          <Route path="/categoria/:slug" element={<CategoryPage />} />
          <Route path="/ofertas" element={<CategoryPage />} />
          <Route path="/preguntas-frecuentes" element={<FAQPage />} />
          <Route path="/medios-de-pago" element={<PaymentMethodsPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/productos" element={<AdminProducts />} />
          {/* Agregaremos más rutas a medida que avancemos */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;
