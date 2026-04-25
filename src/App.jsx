import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import FAQPage from './pages/FAQPage';
import PaymentMethodsPage from './pages/PaymentMethodsPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
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
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/success" element={<SuccessPage />} />

            {/* Ruta Pública pero oculta (Login del Admin) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Rutas Protegidas (Solo accesible si estás logueado) */}
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/productos" element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
            <Route path="/admin/pedidos" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />

            <Route path="*" element={<HomePage />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;