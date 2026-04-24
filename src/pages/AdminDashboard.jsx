import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { Package, FolderTree, ShoppingCart, TrendingUp } from 'lucide-react';
import { supabase } from '../config/supabase';

const AdminDashboard = () => {
  const [stats, setStats] = useState([
    { id: 1, label: 'Productos', value: '0', icon: <Package size={24} />, color: 'blue' },
    { id: 2, label: 'Categorías', value: '0', icon: <FolderTree size={24} />, color: 'green' },
    { id: 3, label: 'Pedidos (Sim)', value: '0', icon: <ShoppingCart size={24} />, color: 'purple' },
    { id: 4, label: 'Ventas (Sim)', value: '$0', icon: <TrendingUp size={24} />, color: 'orange' },
  ]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
      const { count: categoryCount } = await supabase.from('categories').select('*', { count: 'exact', head: true });

      setStats(prev => prev.map(stat => {
        if (stat.label === 'Productos') return { ...stat, value: productCount?.toString() || '0' };
        if (stat.label === 'Categorías') return { ...stat, value: categoryCount?.toString() || '0' };
        return stat;
      }));
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  return (
    <AdminLayout title="Dashboard">
      <div className="admin-stats-grid">
        {stats.map((stat) => (
          <div key={stat.id} className={`admin-stat-card border-${stat.color}`}>
            <div className={`admin-stat-icon bg-${stat.color}`}>
              {stat.icon}
            </div>
            <div className="admin-stat-info">
              <h3>{stat.label}</h3>
              <p>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-welcome-section mt-4">
        <h2>Bienvenido al Panel de Control</h2>
        <p>Desde aquí podés gestionar el catálogo de productos y las categorías de Aberturas Miño.</p>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;