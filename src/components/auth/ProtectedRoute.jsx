import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    // Muestra una pantalla en blanco o loader mientras Supabase verifica el token
    if (loading) {
        return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Verificando credenciales...</div>;
    }

    // Si no hay usuario, lo patea a la pantalla de login
    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    // Si es admin, lo deja pasar
    return children;
};

export default ProtectedRoute;