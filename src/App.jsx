import CheckoutPage from './pages/CheckoutPage';
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

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminLogin from './pages/AdminLogin';

// Contexts & Auth
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/producto/:slug" element={<ProductPage />} />
            <Route path="/categoria/:slug" element={<CategoryPage />} />
            <Route path="/ofertas" element={<CategoryPage />} />
            <Route path="/preguntas-frecuentes" element={<FAQPage />} />
            <Route path="/medios-de-pago" element={<PaymentMethodsPage />} />

            {/* Ruta Pública pero oculta (Login del Admin) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Rutas Protegidas (Solo accesible si estás logueado) */}
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/productos" element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />

            <Route path="*" element={<HomePage />} />
            <Route path="/finalizar-pedido" element={<CheckoutPage />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;