import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Grid, 
  Image as ImageIcon, 
  HelpCircle, 
  Settings, 
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { siteConfig } from '../../data/siteConfig';

const AdminLayout = ({ children, title }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Package, label: 'Productos', path: '/admin/productos' },
    { icon: Grid, label: 'Categorías', path: '/admin/categorias' },
    { icon: ImageIcon, label: 'Banners / Hero', path: '/admin/banners' },
    { icon: HelpCircle, label: 'FAQs', path: '/admin/faqs' },
    { icon: Settings, label: 'Configuración', path: '/admin/config' },
  ];

  const handleLogout = () => {
    // In a real app, clear session/token
    navigate('/');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          <Link to="/" style={{color: 'white', textDecoration: 'none'}}>
            <h2>{siteConfig.businessName}</h2>
            <p>PANEL DE CONTROL</p>
          </Link>
        </div>

        <nav className="admin-sidebar__nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar__footer">
          <button className="admin-sidebar__logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        <header className="admin-content__header">
          <h1 className="admin-content__title">{title}</h1>
          <div style={{display: 'flex', gap: '10px'}}>
            <Link to="/" className="admin-content__action-btn" style={{backgroundColor: 'var(--color-secondary)'}}>
              Ver Sitio
            </Link>
            {title !== 'Dashboard' && (
              <button className="admin-content__action-btn">
                Nuevo Item
              </button>
            )}
          </div>
        </header>

        <div className="admin-content__body">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
