import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { Plus, Edit2, Trash2, X, Search } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
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
    accessories: [''], ideal_for: [''], benefits: [''], options: [''],
    image_url: '', is_featured: false, in_offer: false,
    variants: [{ 
      size: '', price: 0, price_repartido: 0, price_guia: 0, 
      price_cortina: 0, price_postigo: 0, price_mosquitero: 0, 
      price_reja: 0, sale_price: '', stock: 0, sku: '' 
    }]
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchInitialData = async () => {
    setLoading(true);
    const { data: cats } = await supabase.from('categories').select('*');
    const { data: prods } = await supabase.from('products').select('*, categories(name), product_variants(*)');
    if (cats) setCategories(cats);
    if (prods) setProducts(prods);
    setLoading(false);
  };

  useEffect(() => { fetchInitialData(); }, []);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      accessories: product.accessories?.length > 0 ? product.accessories : [''],
      ideal_for: product.ideal_for?.length > 0 ? product.ideal_for : [''],
      benefits: product.benefits?.length > 0 ? product.benefits : [''],
      options: product.options?.length > 0 ? product.options : [''],
      variants: product.product_variants?.length > 0
        ? product.product_variants.map(v => ({ 
            ...v, 
            price: v.price || 0,
            price_repartido: v.price_repartido || 0,
            price_guia: v.price_guia || 0,
            price_cortina: v.price_cortina || 0,
            price_postigo: v.price_postigo || 0,
            price_mosquitero: v.price_mosquitero || 0,
            price_reja: v.price_reja || 0,
            sale_price: v.sale_price || '',
            stock: v.stock || 0
          }))
        : initialFormState.variants
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.')) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        toast.success("Producto eliminado");
        fetchInitialData();
      } catch (err) {
        toast.error("Error al eliminar: " + err.message);
      }
    }
  };

  const handleAddVariant = () => {
    setFormData({ 
      ...formData, 
      variants: [...formData.variants, { 
        size: '', price: 0, price_repartido: 0, price_guia: 0, 
        price_cortina: 0, price_postigo: 0, price_mosquitero: 0, 
        price_reja: 0, sale_price: '', stock: 0, sku: '' 
      }] 
    });
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    setFormData({ ...formData, variants: newVariants });
  };

  // Dynamic Lists Helpers
  const addListItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const updateListItem = (field, index, value) => {
    const newList = [...formData[field]];
    newList[index] = value;
    setFormData({ ...formData, [field]: newList });
  };

  const removeListItem = (field, index) => {
    const newList = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newList.length > 0 ? newList : [''] });
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
        accessories: formData.accessories.filter(a => a.trim() !== ''),
        ideal_for: formData.ideal_for.filter(i => i.trim() !== ''),
        benefits: formData.benefits.filter(b => b.trim() !== ''),
        options: formData.options.filter(o => o.trim() !== '')
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
        price_repartido: parseFloat(v.price_repartido) || 0,
        price_guia: parseFloat(v.price_guia) || 0,
        price_cortina: parseFloat(v.price_cortina) || 0,
        price_postigo: parseFloat(v.price_postigo) || 0,
        price_mosquitero: parseFloat(v.price_mosquitero) || 0,
        price_reja: parseFloat(v.price_reja) || 0,
        sale_price: v.sale_price ? parseFloat(v.sale_price) : null,
        stock: parseInt(v.stock) || 0,
        sku: v.sku || null
      }));

      const { error: vErr } = await supabase.from('product_variants').insert(variantsToInsert);
      if (vErr) throw vErr;

      toast.success("Producto guardado correctamente");
      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData(initialFormState);
      fetchInitialData();
    } catch (err) {
      toast.error(err.message);
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
            <thead className="hidden md:table-header-group">
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
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors flex items-center justify-between p-4 border-b border-gray-100 md:table-row md:p-0 md:border-b-0">
                  <td className="p-0 md:p-6 block md:table-cell">
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 overflow-hidden border border-gray-100 shrink-0">
                         <img src={p.image_url || '/placeholder.png'} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-secondary text-sm leading-none mb-1">{p.name}</p>
                        <p className="text-xs text-gray-400 font-medium">{p.model}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 hidden md:table-cell">
                    <Badge variant="default">{p.categories?.name || 'General'}</Badge>
                  </td>
                  <td className="p-6 text-sm font-bold text-gray-500 hidden md:table-cell">
                    {p.product_variants?.length} medidas
                  </td>
                  <td className="p-6 hidden md:table-cell">
                    <div className="flex gap-2">
                      {p.is_featured && <Badge variant="featured">Destacado</Badge>}
                      {p.in_offer && <Badge variant="offer">Oferta</Badge>}
                    </div>
                  </td>
                  <td className="p-0 md:p-6 block md:table-cell">
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

              <form onSubmit={handleSubmit} className="space-y-12">
                {/* SECCIÓN: Información Básica */}
                <section className="bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100">
                  <h3 className="text-lg font-black text-secondary uppercase tracking-tight mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Información Básica
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nombre del Producto *</label>
                      <input className="w-full h-14 bg-white border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 font-bold transition-all outline-none shadow-sm" type="text" value={formData.name} required onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Categoría</label>
                      <select className="w-full h-14 bg-white border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 font-bold transition-all outline-none appearance-none shadow-sm cursor-pointer" value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })}>
                        <option value="">Seleccionar...</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Modelo</label>
                      <input className="w-full h-14 bg-white border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 font-bold transition-all outline-none shadow-sm" type="text" value={formData.model || ''} onChange={e => setFormData({ ...formData, model: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Línea</label>
                      <input className="w-full h-14 bg-white border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 font-bold transition-all outline-none shadow-sm" type="text" value={formData.line_type || ''} onChange={e => setFormData({ ...formData, line_type: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Diseño</label>
                      <input className="w-full h-14 bg-white border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 font-bold transition-all outline-none shadow-sm" type="text" value={formData.design || ''} onChange={e => setFormData({ ...formData, design: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Color</label>
                      <input className="w-full h-14 bg-white border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 font-bold transition-all outline-none shadow-sm" type="text" value={formData.color || ''} onChange={e => setFormData({ ...formData, color: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Material</label>
                      <input className="w-full h-14 bg-white border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 font-bold transition-all outline-none shadow-sm" type="text" value={formData.material || ''} onChange={e => setFormData({ ...formData, material: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Vidrio</label>
                      <input className="w-full h-14 bg-white border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 font-bold transition-all outline-none shadow-sm" type="text" value={formData.glass || ''} onChange={e => setFormData({ ...formData, glass: e.target.value })} />
                    </div>
                  </div>
                </section>

                {/* SECCIÓN: Imágenes y Flags */}
                <section className="bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100">
                  <h3 className="text-lg font-black text-secondary uppercase tracking-tight mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Imágenes y Visibilidad
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">URL de la Imagen Principal</label>
                      <input className="w-full h-14 bg-white border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 font-bold transition-all outline-none shadow-sm" type="text" value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} />
                    </div>
                    <div className="flex items-center gap-8 pt-6">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-6 h-6 rounded-lg border-2 border-gray-200 text-primary focus:ring-primary/20 transition-all cursor-pointer" checked={formData.is_featured} onChange={e => setFormData({ ...formData, is_featured: e.target.checked })} /> 
                        <span className="text-sm font-bold text-gray-500 group-hover:text-secondary">Destacado</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-6 h-6 rounded-lg border-2 border-gray-200 text-primary focus:ring-primary/20 transition-all cursor-pointer" checked={formData.in_offer} onChange={e => setFormData({ ...formData, in_offer: e.target.checked })} /> 
                        <span className="text-sm font-bold text-gray-500 group-hover:text-secondary">En Oferta</span>
                      </label>
                    </div>
                  </div>
                </section>

                {/* SECCIÓN: Listas y Detalles */}
                <section className="bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100">
                  <h3 className="text-lg font-black text-secondary uppercase tracking-tight mb-8 flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Listas y Detalles
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {[
                      { label: 'Beneficios', field: 'benefits' },
                      { label: 'Ideal Para', field: 'ideal_for' },
                      { label: 'Accesorios', field: 'accessories' },
                      { label: 'Opciones', field: 'options' }
                    ].map((list) => (
                      <div key={list.field} className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">{list.label}</label>
                        <div className="space-y-3">
                          {formData[list.field].map((item, idx) => (
                            <div key={idx} className="flex gap-2">
                              <input 
                                className="flex-1 h-12 bg-white border-2 border-transparent focus:border-primary/20 rounded-xl px-5 font-bold transition-all outline-none shadow-sm text-sm" 
                                type="text" 
                                value={item} 
                                onChange={(e) => updateListItem(list.field, idx, e.target.value)} 
                                placeholder={`Agregar ${list.label.toLowerCase()}...`}
                              />
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                className="w-12 h-12 text-red-400 hover:text-red-500 hover:bg-red-50 shrink-0" 
                                onClick={() => removeListItem(list.field, idx)}
                              >
                                <Trash2 size={18} />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          className="text-primary hover:bg-primary/10 w-full h-12 rounded-xl border-2 border-dashed border-primary/20 gap-2 text-xs font-bold uppercase tracking-widest" 
                          onClick={() => addListItem(list.field)}
                        >
                          <Plus size={16} /> Agregar {list.label.split(' ')[0]}
                        </Button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* SECCIÓN: Variantes y Precios */}
                <section className="bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-black text-secondary uppercase tracking-tight flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      Variantes y Precios
                    </h3>
                    <Button type="button" variant="primary" size="sm" className="h-10 px-6 gap-2" onClick={handleAddVariant}>
                      <Plus size={16} /> Nueva Variante
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    {formData.variants.map((v, i) => (
                      <div key={i} className="bg-white p-8 rounded-[1.5rem] border border-gray-100 shadow-sm relative group">
                        {i > 0 && (
                          <button 
                            type="button" 
                            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all" 
                            onClick={() => setFormData({ ...formData, variants: formData.variants.filter((_, idx) => idx !== i) })}
                          >
                            <Trash2 size={18} />
                          </button>
                        )}

                        <div className="space-y-8">
                          {/* Fila 1: Datos Principales */}
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                            <div className="space-y-2 col-span-2 md:col-span-1">
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Medida *</label>
                              <input className="w-full h-12 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl px-4 text-sm font-bold transition-all outline-none" type="text" value={v.size} required onChange={e => updateVariant(i, 'size', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Precio Base *</label>
                              <input className="w-full h-12 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl px-4 text-sm font-bold transition-all outline-none" type="number" value={v.price} required onChange={e => updateVariant(i, 'price', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">P. Repartido</label>
                              <input className="w-full h-12 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl px-4 text-sm font-bold transition-all outline-none" type="number" value={v.price_repartido} onChange={e => updateVariant(i, 'price_repartido', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">P. Oferta</label>
                              <input className="w-full h-12 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl px-4 text-sm font-bold transition-all outline-none text-primary" type="number" value={v.sale_price} onChange={e => updateVariant(i, 'sale_price', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Stock</label>
                              <input className="w-full h-12 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl px-4 text-sm font-bold transition-all outline-none" type="number" value={v.stock} onChange={e => updateVariant(i, 'stock', e.target.value)} />
                            </div>
                          </div>

                          {/* Fila 2: Opcionales */}
                          <div className="pt-6 border-t border-gray-50">
                            <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-4 opacity-50">Adicionales (Precios Opcionales)</p>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Guía</label>
                                <input className="w-full h-12 bg-gray-50/50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl px-4 text-sm font-bold transition-all outline-none" type="number" value={v.price_guia} onChange={e => updateVariant(i, 'price_guia', e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Cortina</label>
                                <input className="w-full h-12 bg-gray-50/50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl px-4 text-sm font-bold transition-all outline-none" type="number" value={v.price_cortina} onChange={e => updateVariant(i, 'price_cortina', e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Postigo</label>
                                <input className="w-full h-12 bg-gray-50/50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl px-4 text-sm font-bold transition-all outline-none" type="number" value={v.price_postigo} onChange={e => updateVariant(i, 'price_postigo', e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Mosquitero</label>
                                <input className="w-full h-12 bg-gray-50/50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl px-4 text-sm font-bold transition-all outline-none" type="number" value={v.price_mosquitero} onChange={e => updateVariant(i, 'price_mosquitero', e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Reja</label>
                                <input className="w-full h-12 bg-gray-50/50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl px-4 text-sm font-bold transition-all outline-none" type="number" value={v.price_reja} onChange={e => updateVariant(i, 'price_reja', e.target.value)} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

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