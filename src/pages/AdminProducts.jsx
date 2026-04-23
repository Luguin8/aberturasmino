import React from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { products } from '../data/mockProducts';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminProducts = () => {
  return (
    <AdminLayout title="Gestión de Productos">
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id}>
                <td>
                  <img 
                    src={prod.images[0]} 
                    alt="" 
                    style={{width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover'}}
                  />
                </td>
                <td style={{fontWeight: '500'}}>{prod.name}</td>
                <td>{prod.categoryId === 'cat-1' ? 'Ventanas' : 'Otros'}</td>
                <td>${prod.salePrice.toLocaleString()}</td>
                <td>
                  <span className={`admin-badge ${prod.stock > 10 ? 'admin-badge--success' : 'admin-badge--warning'}`}>
                    {prod.stock} un.
                  </span>
                </td>
                <td>
                  <div className="admin-table__actions">
                    <Link to={`/producto/${prod.slug}`} className="admin-table__btn" title="Ver en sitio">
                      <Eye size={16} />
                    </Link>
                    <button className="admin-table__btn" title="Editar">
                      <Edit2 size={16} />
                    </button>
                    <button className="admin-table__btn admin-table__btn--delete" title="Eliminar">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
