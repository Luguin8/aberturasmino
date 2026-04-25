import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { Plus, Edit2, Trash2, X, Search } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Gestión de Productos">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
        <div className="relative flex-1 w-full max-w-md">
          <input 
            type="text" 
            placeholder="Buscar productos..." 
            className="w-full h-12 bg-white border border-gray-100 rounded-2xl px-6 pr-12 text-sm font-medium shadow-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
        </div>
        
        <Button 
          variant="primary" 
          className="w-full md:w-auto h-12 gap-2" 
          onClick={() => { setEditingProduct(null); setFormData(initialFormState); setIsModalOpen(true); }}
        >
          <Plus size={20} /> Nuevo Producto
        </Button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Cargando catálogo...</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Producto</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Categoría</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Variantes</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Estado</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 overflow-hidden border border-gray-100 shrink-0">
                         <img src={p.image_url || '/placeholder.png'} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-secondary text-sm leading-none mb-1">{p.name}</p>
                        <p className="text-xs text-gray-400 font-medium">{p.model}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <Badge variant="default">{p.categories?.name || 'General'}</Badge>
                  </td>
                  <td className="p-6 text-sm font-bold text-gray-500">
                    {p.product_variants?.length} medidas
                  </td>
                  <td className="p-6">
                    <div className="flex gap-2">
                      {p.is_featured && <Badge variant="featured">Destacado</Badge>}
                      {p.in_offer && <Badge variant="offer">Oferta</Badge>}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="w-10 h-10 hover:bg-blue-50 text-blue-500" onClick={() => handleEdit(p)}>
                        <Edit2 size={18} />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-10 h-10 hover:bg-red-50 text-red-500" onClick={() => handleDelete(p.id)}>
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-secondary/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative bg-white w-full max-w-4xl max-h-full overflow-y-auto rounded-[2.5rem] shadow-2xl">
            <div className="p-10">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-secondary uppercase tracking-tight">
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsModalOpen(false)}>
                  <X size={24} />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Nombre del Producto *</label>
                    <input className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl px-6 font-bold transition-all outline-none" type="text" value={formData.name} required onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Categoría</label>
                    <select className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl px-6 font-bold transition-all outline-none appearance-none" value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })}>
                      <option value="">Seleccionar...</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Línea (Ej: Herrero)</label>
                    <input className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl px-6 font-bold transition-all outline-none" type="text" value={formData.line_type} onChange={e => setFormData({ ...formData, line_type: e.target.value })} />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">URL Imagen</label>
                    <input className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl px-6 font-bold transition-all outline-none" type="text" value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} />
                  </div>

                  <div className="flex gap-10 md:col-span-2 pt-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-6 h-6 rounded-lg border-2 border-gray-200 text-primary focus:ring-primary/20 transition-all cursor-pointer" checked={formData.is_featured} onChange={e => setFormData({ ...formData, is_featured: e.target.checked })} /> 
                      <span className="text-sm font-bold text-gray-500 group-hover:text-secondary">Destacar Producto</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-6 h-6 rounded-lg border-2 border-gray-200 text-primary focus:ring-primary/20 transition-all cursor-pointer" checked={formData.in_offer} onChange={e => setFormData({ ...formData, in_offer: e.target.checked })} /> 
                      <span className="text-sm font-bold text-gray-500 group-hover:text-secondary">En Oferta</span>
                    </label>
                  </div>
                </div>

                <div className="bg-gray-50 p-8 rounded-[2rem] space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-secondary uppercase tracking-tight">Variantes (Medidas y Precios)</h3>
                    <Button type="button" variant="ghost" className="text-primary hover:bg-primary/10" onClick={handleAddVariant}>+ Agregar</Button>
                  </div>
                  
                  <div className="space-y-4">
                    {formData.variants.map((v, i) => (
                      <div key={i} className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative group">
                        <div className="space-y-2 col-span-2 md:col-span-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Medida *</label>
                          <input className="w-full h-10 bg-gray-50 rounded-lg px-4 text-xs font-bold" type="text" value={v.size} required onChange={e => updateVariant(i, 'size', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Precio *</label>
                          <input className="w-full h-10 bg-gray-50 rounded-lg px-4 text-xs font-bold" type="number" value={v.price} required onChange={e => updateVariant(i, 'price', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Oferta</label>
                          <input className="w-full h-10 bg-gray-50 rounded-lg px-4 text-xs font-bold" type="number" value={v.sale_price} onChange={e => updateVariant(i, 'sale_price', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Stock</label>
                          <input className="w-full h-10 bg-gray-50 rounded-lg px-4 text-xs font-bold" type="number" value={v.stock} onChange={e => updateVariant(i, 'stock', e.target.value)} />
                        </div>
                        <div className="flex justify-end">
                          {i > 0 && (
                            <Button type="button" variant="ghost" size="icon" className="text-red-300 hover:text-red-500 hover:bg-red-50" onClick={() => setFormData({ ...formData, variants: formData.variants.filter((_, idx) => idx !== i) })}>
                              <Trash2 size={18} />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" className="h-14 px-10" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                  <Button type="submit" variant="primary" className="h-14 px-10">
                    {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;