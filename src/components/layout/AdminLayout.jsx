import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  LogOut,
  ShoppingCart,
  Menu,
  X
} from 'lucide-react';
import { siteConfig } from '../../data/siteConfig';
import Button from '../ui/Button';

const AdminLayout = ({ children, title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Package, label: 'Productos', path: '/admin/productos' },
    { icon: ShoppingCart, label: 'Pedidos', path: '/admin/pedidos' },
  ];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-secondary text-white transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="h-full flex flex-col">
          <div className="p-8 flex items-center justify-between">
            <Link to="/" className="flex flex-col">
              <h2 className="text-xl font-black leading-none">
                Aberturas <span className="text-primary">Miño</span>
              </h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Panel de Control</p>
            </Link>
            <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                    isActive 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/5">
            <Button 
              variant="ghost" 
              className="w-full gap-3 text-red-400 hover:bg-red-500/10 hover:text-red-500" 
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span>Cerrar Sesión</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
             <button className="lg:hidden p-2 hover:bg-gray-50 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
               <Menu size={24} />
             </button>
             <h1 className="text-xl font-black text-secondary uppercase tracking-tight">{title}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                Ver Sitio Público
              </Button>
            </Link>
          </div>
        </header>

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
