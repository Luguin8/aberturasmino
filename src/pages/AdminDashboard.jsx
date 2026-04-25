import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { Package, FolderTree, ShoppingCart, TrendingUp, ArrowUpRight } from 'lucide-react';
import { supabase } from '../config/supabase';
import Container from '../components/ui/Container';

const AdminDashboard = () => {
  const [stats, setStats] = useState([
    { id: 1, label: 'Productos', value: '0', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 2, label: 'Categorías', value: '0', icon: FolderTree, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 3, label: 'Pedidos Hoy', value: '0', icon: ShoppingCart, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 4, label: 'Facturación', value: '$0', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
  ]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
      const { count: categoryCount } = await supabase.from('categories').select('*', { count: 'exact', head: true });
      const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });

      setStats(prev => prev.map(stat => {
        if (stat.label === 'Productos') return { ...stat, value: productCount?.toString() || '0' };
        if (stat.label === 'Categorías') return { ...stat, value: categoryCount?.toString() || '0' };
        if (stat.label === 'Pedidos Hoy') return { ...stat, value: orderCount?.toString() || '0' };
        return stat;
      }));
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                  <Icon size={24} />
                </div>
                <div className="text-gray-300 group-hover:text-primary transition-colors">
                  <ArrowUpRight size={20} />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</h3>
                <p className="text-3xl font-black text-secondary">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h2 className="text-3xl font-black text-secondary leading-tight uppercase tracking-tight">
              Bienvenido al Panel de Control de <span className="text-primary">Aberturas Miño</span>
            </h2>
            <p className="text-gray-400 text-lg font-medium leading-relaxed">
              Desde aquí podés gestionar el catálogo de productos, controlar los pedidos entrantes y actualizar la información de tu sitio web de manera sencilla y eficiente.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
               <div className="px-6 py-3 bg-gray-50 rounded-xl flex items-center gap-2 border border-gray-100">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-bold text-gray-500">Sistema Conectado</span>
               </div>
               <div className="px-6 py-3 bg-gray-50 rounded-xl flex items-center gap-2 border border-gray-100">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-xs font-bold text-gray-500">Base de Datos OK</span>
               </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 aspect-square bg-gray-50 rounded-[3rem] overflow-hidden border border-gray-100 flex items-center justify-center p-10">
             <TrendingUp size={120} className="text-primary opacity-20" />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;