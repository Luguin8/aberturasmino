import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { supabase } from '../config/supabase';
import { ShoppingBag, Eye, Trash2, Calendar, CreditCard, Tag } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-AR');
  };

  return (
    <AdminLayout title="Pedidos Recibidos">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Cargando pedidos...</div>
        ) : orders.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No hay pedidos registrados aún.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 font-bold text-gray-600">Fecha</th>
                  <th className="p-4 font-bold text-gray-600">Productos</th>
                  <th className="p-4 font-bold text-gray-600">Método de Pago</th>
                  <th className="p-4 font-bold text-gray-600">Total</th>
                  <th className="p-4 font-bold text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} />
                        {formatDate(order.created_at)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {order.items?.map((item, i) => (
                          <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium">
                            {item.name} (x{item.quantity})
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm">
                        <CreditCard size={14} className="text-gray-400" />
                        {order.payment_method}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-secondary">{formatPrice(order.total)}</span>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Detalle (Simple) */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-secondary">Detalle del Pedido</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-secondary">{item.name}</p>
                      <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{formatPrice((item.salePrice || item.price) * item.quantity)}</p>
                  </div>
                ))}
              </div>
              
              <div className="pt-6 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Método de Pago:</span>
                  <span className="font-medium text-secondary">{selectedOrder.payment_method}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-primary">
                  <span>Total Final:</span>
                  <span>{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 text-right">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 bg-secondary text-white rounded-lg font-bold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
