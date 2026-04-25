import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { Plus, Edit2, Trash2, Package, X } from 'lucide-react';
import { supabase } from '../config/supabase';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Estado del formulario alineado exactamente con tu base de datos
  const [formData, setFormData] = useState({
    name: '', category_id: '', model: '', design: '', color: '',
    line_type: '', material: 'Aluminio', glass: '',
    accessories: '', ideal_for: '', benefits: '', options: '',
    image_url: '', is_featured: false, in_offer: false,
    variants: [{ size: '', price: 0, sale_price: '', stock: 0, sku: '' }]
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
    setFormData({ ...formData, variants: [...formData.variants, { size: '', price: 0, sale_price: '', stock: 0, sku: '' }] });
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    setFormData({ ...formData, variants: newVariants });
  };

  // Función utilitaria para convertir texto separado por comas en un Array real de PostgreSQL
  const stringToArray = (str) => {
    if (!str) return [];
    return str.split(',').map(item => item.trim()).filter(item => item !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Preparamos el objeto principal del producto
      const productToInsert = {
        name: formData.name,
        category_id: formData.category_id || null,
        model: formData.model,
        design: formData.design,
        color: formData.color,
        line_type: formData.line_type,
        material: formData.material,
        glass: formData.glass,
        image_url: formData.image_url,
        is_featured: formData.is_featured,
        in_offer: formData.in_offer,
        accessories: stringToArray(formData.accessories),
        ideal_for: stringToArray(formData.ideal_for),
        benefits: stringToArray(formData.benefits),
        options: stringToArray(formData.options)
      };

      const { data: pData, error: pErr } = await supabase.from('products').insert([productToInsert]).select();
      if (pErr) throw pErr;

      // 2. Preparamos y guardamos las variantes
      const productId = pData[0].id;
      const variantsToInsert = formData.variants.map(v => ({
        product_id: productId,
        size: v.size,
        price: parseFloat(v.price) || 0,
        sale_price: v.sale_price ? parseFloat(v.sale_price) : null,
        stock: parseInt(v.stock) || 0,
        sku: v.sku || null
      }));

      const { error: vErr } = await supabase.from('product_variants').insert(variantsToInsert);
      if (vErr) throw vErr;

      setIsModalOpen(false);
      fetchInitialData();
      alert("¡Producto cargado exitosamente!");
    } catch (err) {
      alert("Error al guardar: " + err.message);
      console.error(err);
    }
  };

  return (
    <AdminLayout title="Catálogo de Productos">
      <button className="btn btn-primary mb-4" onClick={() => setIsModalOpen(true)}>
        <Plus size={20} /> Nuevo Producto
      </button>

      {loading ? <p>Cargando datos...</p> : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Variantes</th>
                <th>Destacado / Oferta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Package size={16} />
                      <strong>{p.name}</strong>
                    </div>
                    <small style={{ color: '#64748b' }}>Mod: {p.model || 'S/M'}</small>
                  </td>
                  <td>{p.categories?.name}</td>
                  <td>{p.product_variants?.length} medidas</td>
                  <td>
                    {p.is_featured && <span style={{ marginRight: '5px', color: 'blue' }}>⭐ Dest</span>}
                    {p.in_offer && <span style={{ color: 'orange' }}>🔥 Oferta</span>}
                  </td>
                  <td>
                    <button className="btn-icon text-blue"><Edit2 size={16} /></button>
                    <button className="btn-icon text-red"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '800px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2>Nuevo Producto Completo</h2>
              <button onClick={() => setIsModalOpen(false)} className="btn-icon"><X /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                {/* Sección 1: Datos Básicos */}
                <div style={{ gridColumn: '1 / -1', background: '#f8fafc', padding: '15px', borderRadius: '8px' }}>
                  <h4 style={{ marginTop: 0 }}>Datos Principales</h4>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <div className="form-group" style={{ flex: 2 }}>
                      <label>Nombre del Producto *</label>
                      <input className="form-control" type="text" required onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Categoría *</label>
                      <select className="form-control" required onChange={e => setFormData({ ...formData, category_id: e.target.value })}>
                        <option value="">Seleccionar...</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div className="form-group w-100"><label>Modelo</label><input className="form-control" type="text" onChange={e => setFormData({ ...formData, model: e.target.value })} /></div>
                    <div className="form-group w-100"><label>Línea (Ej: Herrero)</label><input className="form-control" type="text" onChange={e => setFormData({ ...formData, line_type: e.target.value })} /></div>
                    <div className="form-group w-100"><label>URL de Imagen</label><input className="form-control" type="text" onChange={e => setFormData({ ...formData, image_url: e.target.value })} /></div>
                  </div>
                </div>

                {/* Sección 2: Especificaciones Físicas */}
                <div className="form-group"><label>Material</label><input className="form-control" type="text" defaultValue="Aluminio" onChange={e => setFormData({ ...formData, material: e.target.value })} /></div>
                <div className="form-group"><label>Color</label><input className="form-control" type="text" onChange={e => setFormData({ ...formData, color: e.target.value })} /></div>
                <div className="form-group"><label>Diseño (Ej: Vidrio entero)</label><input className="form-control" type="text" onChange={e => setFormData({ ...formData, design: e.target.value })} /></div>
                <div className="form-group"><label>Vidrio (Ej: 4mm)</label><input className="form-control" type="text" onChange={e => setFormData({ ...formData, glass: e.target.value })} /></div>

                {/* Sección 3: Listas (Separadas por coma) */}
                <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
                  <h4>Características Adicionales (Separar por comas)</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div className="form-group"><label>Accesorios</label><input className="form-control" type="text" placeholder="Ej: Felpas, Ruedas, Cierre central" onChange={e => setFormData({ ...formData, accessories: e.target.value })} /></div>
                    <div className="form-group"><label>Ideal para</label><input className="form-control" type="text" placeholder="Ej: Viviendas, Quinchos" onChange={e => setFormData({ ...formData, ideal_for: e.target.value })} /></div>
                    <div className="form-group"><label>Beneficios</label><input className="form-control" type="text" placeholder="Ej: Fácil mantenimiento, Resistente" onChange={e => setFormData({ ...formData, benefits: e.target.value })} /></div>
                    <div className="form-group"><label>Opcionales</label><input className="form-control" type="text" placeholder="Ej: Mosquitero, Reja" onChange={e => setFormData({ ...formData, options: e.target.value })} /></div>
                  </div>
                </div>

                {/* Checkboxes de estado */}
                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                    <input type="checkbox" onChange={e => setFormData({ ...formData, is_featured: e.target.checked })} /> Destacar en Home
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                    <input type="checkbox" onChange={e => setFormData({ ...formData, in_offer: e.target.checked })} /> Marcar como Oferta
                  </label>
                </div>
              </div>

              {/* Sección 4: Variantes */}
              <div style={{ marginTop: '20px', background: '#f8fafc', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ marginTop: 0 }}>Variantes (Medidas y Precios)</h3>
                {formData.variants.map((v, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '10px', marginBottom: '10px', alignItems: 'end' }}>
                    <div><label>Medida *</label><input className="form-control" type="text" required placeholder="120x110 cm" onChange={e => updateVariant(i, 'size', e.target.value)} /></div>
                    <div><label>Precio *</label><input className="form-control" type="number" required onChange={e => updateVariant(i, 'price', e.target.value)} /></div>
                    <div><label>Precio Oferta</label><input className="form-control" type="number" placeholder="Opcional" onChange={e => updateVariant(i, 'sale_price', e.target.value)} /></div>
                    <div><label>Stock *</label><input className="form-control" type="number" required onChange={e => updateVariant(i, 'stock', e.target.value)} /></div>
                    <div><label>SKU</label><input className="form-control" type="text" placeholder="Código" onChange={e => updateVariant(i, 'sku', e.target.value)} /></div>
                  </div>
                ))}
                <button type="button" className="btn btn-secondary mt-2" onClick={handleAddVariant}>+ Agregar Otra Medida</button>
              </div>

              <div className="mt-4" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ minWidth: '150px' }}>Guardar Producto</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;