import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { Plus, Edit2, Trash2, Package, X, ShoppingCart } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useCart } from '../context/CartContext';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  const { addToCart } = useCart();

  const initialFormState = {
    name: '', category_id: '', model: '', design: '', color: '',
    line_type: '', material: 'Aluminio', glass: '',
    accessories: '', ideal_for: '', benefits: '', options: '',
    image_url: '', is_featured: false, in_offer: false,
    variants: [{ size: '', price: 0, sale_price: '', stock: 0, sku: '' }]
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => { fetchInitialData(); }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    const { data: cats } = await supabase.from('categories').select('*');
    const { data: prods } = await supabase.from('products').select('*, categories(name), product_variants(*)');
    if (cats) setCategories(cats);
    if (prods) setProducts(prods);
    setLoading(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      accessories: product.accessories?.join(', ') || '',
      ideal_for: product.ideal_for?.join(', ') || '',
      benefits: product.benefits?.join(', ') || '',
      options: product.options?.join(', ') || '',
      variants: product.product_variants?.length > 0
        ? product.product_variants.map(v => ({ ...v, sale_price: v.sale_price || '' }))
        : initialFormState.variants
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.')) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        fetchInitialData();
      } catch (err) {
        alert("Error al eliminar: " + err.message);
      }
    }
  };

  const handleAddToCartTest = (product) => {
    if (product.product_variants?.length > 0) {
      const v = product.product_variants[0];
      addToCart({
        id: v.id,
        productId: product.id,
        name: `${product.name} (${v.size}) - TEST`,
        price: v.price,
        salePrice: v.sale_price || v.price,
        image: product.image_url,
      });
      alert(`Añadido al carrito: ${product.name} (${v.size})`);
    } else {
      alert("Este producto no tiene medidas/precios cargados.");
    }
  };

  const handleAddVariant = () => {
    setFormData({ ...formData, variants: [...formData.variants, { size: '', price: 0, sale_price: '', stock: 0, sku: '' }] });
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    setFormData({ ...formData, variants: newVariants });
  };

  const stringToArray = (str) => {
    if (!str || typeof str !== 'string') return [];
    return str.split(',').map(item => item.trim()).filter(item => item !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productToSave = {
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

      let productId;

      if (editingProduct) {
        const { error: pErr } = await supabase.from('products').update(productToSave).eq('id', editingProduct.id);
        if (pErr) throw pErr;
        productId = editingProduct.id;
        // Limpiamos variantes viejas para re-insertar
        await supabase.from('product_variants').delete().eq('product_id', productId);
      } else {
        const { data: pData, error: pErr } = await supabase.from('products').insert([productToSave]).select();
        if (pErr) throw pErr;
        productId = pData[0].id;
      }

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
      setEditingProduct(null);
      setFormData(initialFormState);
      fetchInitialData();
      alert(editingProduct ? "¡Producto actualizado!" : "¡Producto creado!");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <AdminLayout title="Gestión de Productos">
      <button className="btn btn-primary mb-4" onClick={() => { setEditingProduct(null); setFormData(initialFormState); setIsModalOpen(true); }}>
        <Plus size={20} /> Nuevo Producto
      </button>

      {loading ? <p>Cargando datos...</p> : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Variantes</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.name}</strong><br />
                    <small>{p.categories?.name || 'Sin categoría'}</small>
                  </td>
                  <td>{p.product_variants?.length} medidas</td>
                  <td>
                    {p.is_featured && <span className="badge-featured" style={{ fontSize: '10px', padding: '2px 5px', marginRight: '5px' }}>⭐</span>}
                    {p.in_offer && <span className="badge-offer" style={{ fontSize: '10px', padding: '2px 5px' }}>🔥</span>}
                  </td>
                  <td>
                    <div className="table-actions" style={{ display: 'flex', gap: '10px' }}>
                      <button className="btn-icon text-blue" onClick={() => handleEdit(p)} title="Editar"><Edit2 size={18} /></button>
                      <button className="btn-icon text-red" onClick={() => handleDelete(p.id)} title="Eliminar"><Trash2 size={18} /></button>
                      <button className="btn-icon text-green" onClick={() => handleAddToCartTest(p)} title="Probar Carrito"><ShoppingCart size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '850px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="btn-icon"><X /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Nombre del Producto *</label>
                  <input className="form-control" type="text" value={formData.name} required onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>

                <div className="form-group">
                  <label>Categoría</label>
                  <select className="form-control" value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })}>
                    <option value="">Seleccionar...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Línea (Ej: Herrero)</label>
                  <input className="form-control" type="text" value={formData.line_type} onChange={e => setFormData({ ...formData, line_type: e.target.value })} />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Accesorios (Separar por comas)</label>
                  <input className="form-control" type="text" value={formData.accessories} placeholder="Felpas, Ruedas, Cierre central..." onChange={e => setFormData({ ...formData, accessories: e.target.value })} />
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '20px', padding: '10px 0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" checked={formData.is_featured} onChange={e => setFormData({ ...formData, is_featured: e.target.checked })} /> Destacar
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" checked={formData.in_offer} onChange={e => setFormData({ ...formData, in_offer: e.target.checked })} /> En Oferta
                  </label>
                </div>
              </div>

              <div style={{ marginTop: '20px', background: '#f1f5f9', padding: '15px', borderRadius: '8px' }}>
                <h3 className="mb-3">Variantes (Medidas y Precios)</h3>
                {formData.variants.map((v, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '10px', marginBottom: '10px', alignItems: 'end' }}>
                    <div><label>Medida *</label><input className="form-control" type="text" value={v.size} required onChange={e => updateVariant(i, 'size', e.target.value)} /></div>
                    <div><label>Precio *</label><input className="form-control" type="number" value={v.price} required onChange={e => updateVariant(i, 'price', e.target.value)} /></div>
                    <div><label>Oferta</label><input className="form-control" type="number" value={v.sale_price} onChange={e => updateVariant(i, 'sale_price', e.target.value)} /></div>
                    <div><label>Stock</label><input className="form-control" type="number" value={v.stock} onChange={e => updateVariant(i, 'stock', e.target.value)} /></div>
                    {i > 0 && (
                      <button type="button" className="btn-icon text-red" onClick={() => setFormData({ ...formData, variants: formData.variants.filter((_, idx) => idx !== i) })}><Trash2 size={18} /></button>
                    )}
                  </div>
                ))}
                <button type="button" className="btn btn-secondary mt-2" onClick={handleAddVariant}>+ Agregar Medida</button>
              </div>

              <div className="mt-4 d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;