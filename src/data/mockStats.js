/**
 * ============================================
 * ARCHIVO MOCK — ESTADÍSTICAS DEL DASHBOARD
 * ============================================
 * EN PRODUCCIÓN: Reemplazar por consultas a Supabase
 * con datos reales de analytics.
 * ============================================
 */

export const dashboardStats = {
  totalVisits: 12450,
  totalOrders: 347,
  totalRevenue: 28500000,
  conversionRate: 2.8,
  topProducts: [
    { name: 'Ventana aluminio corrediza 150x110', views: 1230, orders: 45 },
    { name: 'Puerta chapa inyectada 80x200', views: 980, orders: 38 },
    { name: 'Portón levadizo 240x200', views: 756, orders: 22 },
    { name: 'Placard melamina 180x240x60', views: 645, orders: 18 },
    { name: 'Ventana aluminio corrediza 120x110', views: 590, orders: 15 },
  ],
  recentOrders: [
    { id: 'ORD-001', customer: 'Juan Pérez', total: 189999, status: 'completado', date: '2026-04-22' },
    { id: 'ORD-002', customer: 'María López', total: 321999, status: 'pendiente', date: '2026-04-22' },
    { id: 'ORD-003', customer: 'Carlos García', total: 674999, status: 'enviado', date: '2026-04-21' },
    { id: 'ORD-004', customer: 'Ana Rodríguez', total: 142499, status: 'completado', date: '2026-04-21' },
    { id: 'ORD-005', customer: 'Pedro Martín', total: 489999, status: 'pendiente', date: '2026-04-20' },
  ],
  monthlyRevenue: [
    { month: 'Ene', value: 1800000 },
    { month: 'Feb', value: 2200000 },
    { month: 'Mar', value: 2800000 },
    { month: 'Abr', value: 3100000 },
  ],
  categoryDistribution: [
    { name: 'Ventanas', percentage: 35 },
    { name: 'Puertas', percentage: 25 },
    { name: 'Portones', percentage: 15 },
    { name: 'Placards', percentage: 12 },
    { name: 'Rejas', percentage: 8 },
    { name: 'Mosquiteros', percentage: 5 },
  ],
};
