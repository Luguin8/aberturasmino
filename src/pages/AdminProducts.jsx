import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { Plus, Edit2, Trash2, Package, X } from 'lucide-react';
import { supabase } from '../config/supabase';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    model: '',
    material: 'Aluminio',
    color: 'Blanco',
    image_url: '',
    variants: [{ size: '', price: 0, stock: 0 }]
  });

  useEffect(() => { fetchInitialData(); }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    const { data: cats } = await supabase.from('categories').select('*');
    const { data: prods } = await supabase.from('products').select('*, categories(name), product_variants(*)');
    if (cats) setCategories(cats);
    if (prods) setProducts(prods);
    setLoading(false);
  };

  const handleAddVariant = () => {
    setFormData({ ...formData, variants: [...formData.variants, { size: '', price: 0, stock: 0 }] });
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    setFormData({ ...formData, variants: newVariants });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: pData, error: pErr } = await supabase.from('products').insert([{
        name: formData.name,
        category_id: formData.category_id,
        model: formData.model,
        material: formData.material,
        color: formData.color,
        image_url: formData.image_url
      }]).select();

      if (pErr) throw pErr;

      const variantsToInsert = formData.variants.map(v => ({ ...v, product_id: pData[0].id }));
      await supabase.from('product_variants').insert(variantsToInsert);

      setIsModalOpen(false);
      fetchInitialData();
      alert("Producto cargado!");
    } catch (err) { alert("Error: " + err.message); }
  };

  return (
    <AdminLayout title="Catálogo de Productos">
      <button className="btn btn-primary mb-4" onClick={() => setIsModalOpen(true)}>
        <Plus size={20} /> Nuevo Producto
      </button>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Medidas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.categories?.name}</td>
                <td>{p.product_variants?.length} medidas</td>
                <td>
                  <button className="btn-icon text-blue"><Edit2 size={16} /></button>
                  <button className="btn-icon text-red"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="d-flex justify-content-between">
              <h2>Nuevo Producto</h2>
              <button onClick={() => setIsModalOpen(false)} className="btn-icon"><X /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre del Producto</label>
                <input className="form-control" type="text" required onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Categoría</label>
                <select className="form-control" required onChange={e => setFormData({ ...formData, category_id: e.target.value })}>
                  <option value="">Seleccionar...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <h3>Variantes (Precios por Medida)</h3>
              {formData.variants.map((v, i) => (
                <div key={i} className="variant-row">
                  <div><label>Medida</label><input className="form-control" type="text" placeholder="120x110" onChange={e => updateVariant(i, 'size', e.target.value)} /></div>
                  <div><label>Precio</label><input className="form-control" type="number" onChange={e => updateVariant(i, 'price', e.target.value)} /></div>
                  <div><label>Stock</label><input className="form-control" type="number" onChange={e => updateVariant(i, 'stock', e.target.value)} /></div>
                </div>
              ))}
              <button type="button" className="btn btn-secondary mt-2" onClick={handleAddVariant}>+ Otra Medida</button>

              <div className="mt-4">
                <button type="submit" className="btn btn-primary w-100">Guardar Todo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;