import React from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { dashboardStats } from '../data/mockStats';
import { Users, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const statsCards = [
    { label: 'Visitas Totales', value: dashboardStats.totalVisits.toLocaleString(), icon: Users, change: '+12%', up: true },
    { label: 'Pedidos Recibidos', value: dashboardStats.totalOrders, icon: ShoppingBag, change: '+5%', up: true },
    { label: 'Ventas Totales', value: `$${(dashboardStats.totalRevenue / 1000000).toFixed(1)}M`, icon: DollarSign, change: '+18%', up: true },
    { label: 'Tasa Conversión', value: `${dashboardStats.conversionRate}%`, icon: TrendingUp, change: '-2%', up: false },
  ];

  return (
    <AdminLayout title="Dashboard">
      {/* Stats Grid */}
      <div className="admin-stats">
        {statsCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="admin-stat-card">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div className="admin-stat-card__label">{stat.label}</div>
                <Icon size={20} color="var(--color-text-light)" />
              </div>
              <div className="admin-stat-card__value">{stat.value}</div>
              <div className={`admin-stat-card__change ${stat.up ? 'admin-stat-card__change--up' : 'admin-stat-card__change--down'}`}>
                {stat.change} vs mes anterior
              </div>
            </div>
          );
        })}
      </div>

      <div className="admin-grid-2">
        {/* Sales Chart Mockup */}
        <div className="admin-chart">
          <h3 className="admin-chart__title">Ventas Mensuales (Millones ARS)</h3>
          <div className="admin-chart__bar-container">
            {dashboardStats.monthlyRevenue.map((item, idx) => (
              <div key={idx} className="admin-chart__bar-item">
                <div className="admin-chart__bar-value">${(item.value / 1000000).toFixed(1)}</div>
                <div 
                  className="admin-chart__bar" 
                  style={{height: `${(item.value / 3500000) * 100}%`}}
                ></div>
                <div className="admin-chart__bar-label">{item.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="admin-table-wrapper">
          <div style={{padding: '20px', borderBottom: '1px solid var(--color-border)'}}>
            <h3 style={{fontSize: '1rem', fontWeight: '700'}}>Productos más vistos</h3>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Vistas</th>
                <th>Ventas</th>
              </tr>
            </thead>
            <tbody>
              {dashboardStats.topProducts.map((prod, idx) => (
                <tr key={idx}>
                  <td style={{fontWeight: '500'}}>{prod.name}</td>
                  <td>{prod.views}</td>
                  <td>{prod.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="admin-table-wrapper" style={{marginTop: '30px'}}>
        <div style={{padding: '20px', borderBottom: '1px solid var(--color-border)'}}>
          <h3 style={{fontSize: '1rem', fontWeight: '700'}}>Pedidos Recientes</h3>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {dashboardStats.recentOrders.map((order) => (
              <tr key={order.id}>
                <td style={{fontWeight: '600', color: 'var(--color-primary)'}}>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.date}</td>
                <td>${order.total.toLocaleString()}</td>
                <td>
                  <span className={`admin-badge ${
                    order.status === 'completado' ? 'admin-badge--success' : 
                    order.status === 'pendiente' ? 'admin-badge--warning' : 'admin-badge--info'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
