// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Layouts
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout'; // Si tienes uno específico para admin

// Pages Públicas
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
            {/* GRUPO 1: RUTAS PÚBLICAS CON HEADER/FOOTER */}
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/producto/:slug" element={<ProductPage />} />
              <Route path="/categoria/:slug" element={<CategoryPage />} />
              <Route path="/ofertas" element={<CategoryPage />} />
              <Route path="/preguntas-frecuentes" element={<FAQPage />} />
              <Route path="/medios-de-pago" element={<PaymentMethodsPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="*" element={<HomePage />} />
            </Route>

            {/* GRUPO 2: RUTAS DE ADMIN (TOTALMENTE INDEPENDIENTES) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Aquí puedes envolver en un AdminLayout si quieres que compartan Sidebar de admin */}
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/productos" element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
            <Route path="/admin/pedidos" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;