import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { supabase } from '../config/supabase';
import { Check, ChevronRight, ShoppingCart, MessageCircle, ArrowLeft, ShieldCheck, Truck, RotateCcw, ImageOff } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Container from '../components/ui/Container';
import { siteConfig } from '../data/siteConfig';

const ProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedGlass, setSelectedGlass] = useState('Entero');
  const [selectedOptionals, setSelectedOptionals] = useState({
    guia: false,
    cortina: false,
    postigo: false,
    mosquitero: false,
    reja: false
  });

  // Reiniciar opciones al cambiar de variante
  useEffect(() => {
    setSelectedGlass('Entero');
    setSelectedOptionals({
      guia: false,
      cortina: false,
      postigo: false,
      mosquitero: false,
      reja: false
    });
  }, [selectedVariant?.id]);

  const calculatedPrice = useMemo(() => {
    if (!selectedVariant) return 0;
    
    // Precio base: si es Repartido y existe precio_repartido, se usa ese como base
    let basePrice = (selectedGlass === 'Repartido' && selectedVariant.price_repartido > 0) 
      ? selectedVariant.price_repartido 
      : selectedVariant.price;
    
    let total = basePrice;
    
    // Sumar opcionales
    if (selectedOptionals.guia && selectedVariant.price_guia > 0) total += selectedVariant.price_guia;
    if (selectedOptionals.cortina && selectedVariant.price_cortina > 0) total += selectedVariant.price_cortina;
    if (selectedOptionals.postigo && selectedVariant.price_postigo > 0) total += selectedVariant.price_postigo;
    if (selectedOptionals.mosquitero && selectedVariant.price_mosquitero > 0) total += selectedVariant.price_mosquitero;
    if (selectedOptionals.reja && selectedVariant.price_reja > 0) total += selectedVariant.price_reja;
    
    return total;
  }, [selectedVariant, selectedGlass, selectedOptionals]);

  const selectedOptionsSummary = useMemo(() => {
    const options = [];
    if (selectedGlass === 'Repartido') options.push('Vidrio Repartido');
    if (selectedOptionals.guia) options.push('Guía');
    if (selectedOptionals.cortina) options.push('Cortina');
    if (selectedOptionals.postigo) options.push('Postigo');
    if (selectedOptionals.mosquitero) options.push('Mosquitero');
    if (selectedOptionals.reja) options.push('Reja');
    
    return options.length > 0 ? options.join(', ') : 'Estándar';
  }, [selectedGlass, selectedOptionals]);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*, product_variants(*)')
        .eq('id', slug)
        .single();

      if (error || !data) {
        console.error("Error cargando producto:", error);
        navigate('/');
        return;
      }

      setProduct(data);
      if (data.product_variants?.length > 0) {
        setSelectedVariant(data.product_variants[0]);
      }
      setLoading(false);
    };

    fetchProductData();
  }, [slug, navigate]);

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addToCart({
      id: `${selectedVariant.id}-${selectedGlass}-${Object.entries(selectedOptionals).filter(([, v]) => v).map(([k]) => k).join('-')}`, // Unique ID for variant + options
      variantId: selectedVariant.id,
      productId: product.id,
      name: `${product.name} (${selectedVariant.size})`,
      price: calculatedPrice,
      salePrice: calculatedPrice, // Use calculated price as the final price
      selectedOptionsSummary: selectedOptionsSummary,
      image: product.image_url,
    });
    setIsCartOpen(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price || 0);
  };

  if (loading) {
    return (
      <Container className="py-40 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Cargando detalles...</p>
      </Container>
    );
  }

  return (
    <>
      <div className="bg-gray-50 min-h-screen py-6 md:py-10">
        <Container>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 overflow-hidden whitespace-nowrap">
            <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
            <ChevronRight size={14} />
            <Link to="/categoria/todos" className="hover:text-primary transition-colors">Productos</Link>
            <ChevronRight size={14} />
            <span className="text-secondary font-bold truncate">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl shadow-primary/5 group">
                {product.image_url && !product.image_url.includes('placeholder') ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400 gap-6">
                    <ImageOff size={120} strokeWidth={1} className="opacity-50" />
                    <span className="text-xs font-black uppercase tracking-[0.3em]">Imagen no disponible</span>
                  </div>
                )}
              </div>

              {/* Trust Badges - MOVED HERE */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200">
                <div className="flex flex-col items-center text-center gap-3">
                   <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                      <ShieldCheck size={24} />
                   </div>
                   <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Calidad Certificada</p>
                </div>
                <div className="flex flex-col items-center text-center gap-3">
                   <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                      <Truck size={24} />
                   </div>
                   <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Envío Seguro</p>
                </div>
                <div className="flex flex-col items-center text-center gap-3">
                   <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                      <RotateCcw size={24} />
                   </div>
                   <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Garantía Miño</p>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="flex flex-col">
              <div className="space-y-4 mb-8">
                <Badge variant="primary">{product.material}</Badge>
                <h1 className="text-3xl md:text-4xl font-black text-secondary leading-tight uppercase tracking-tight">
                  {product.name}
                </h1>
                <p className="text-gray-400 text-lg font-medium">
                  {product.model} &bull; Línea {product.line_type}
                </p>
              </div>

              {/* Price Section */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-8">
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-4xl font-black text-secondary">
                    {formatPrice(calculatedPrice)}
                  </span>
                  {selectedVariant?.sale_price > 0 && calculatedPrice === selectedVariant.price && (
                    <span className="text-lg text-gray-300 line-through font-bold">
                      {formatPrice(selectedVariant.price)}
                    </span>
                  )}
                </div>
              </div>

              {/* Variants Selection */}
              <div className="space-y-8">
                {/* Medidas */}
                <div className="space-y-4">
                  <label className="text-sm font-black uppercase tracking-widest text-gray-400">
                    1. Seleccionar Medida
                  </label>
                  <div className="relative">
                    <select
                      className="w-full h-16 bg-white border-2 border-gray-200 rounded-2xl px-6 text-xl font-black text-secondary appearance-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all cursor-pointer outline-none"
                      value={selectedVariant?.id || ''}
                      onChange={(e) => {
                        const variant = product.product_variants.find(v => v.id === e.target.value);
                        setSelectedVariant(variant);
                      }}
                    >
                      {product.product_variants.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.size}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                      <ChevronRight size={24} className="rotate-90" />
                    </div>
                  </div>
                </div>

                {/* Tipo de Vidrio */}
                {selectedVariant?.price_repartido > 0 && (
                  <div className="space-y-4">
                    <label className="text-sm font-black uppercase tracking-widest text-gray-400">
                      2. Tipo de Vidrio
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {['Entero', 'Repartido'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setSelectedGlass(type)}
                          className={`p-6 rounded-2xl border-2 text-left transition-all flex justify-between items-start ${
                            selectedGlass === type
                              ? 'border-primary bg-primary/5 ring-4 ring-primary/5'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div>
                            <p className={`text-xl font-black uppercase tracking-tight ${selectedGlass === type ? 'text-secondary' : 'text-gray-700'}`}>
                              {type}
                            </p>
                            <p className="text-sm font-medium text-gray-500 mt-1">
                              {type === 'Entero' ? 'Vidrio tradicional' : 'Diseño dividido'}
                            </p>
                          </div>
                          {selectedGlass === type && (
                            <div className="bg-primary text-white rounded-full p-1">
                              <Check size={20} strokeWidth={4} />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Adicionales */}
                {(selectedVariant?.price_guia > 0 || 
                  selectedVariant?.price_cortina > 0 || 
                  selectedVariant?.price_postigo > 0 || 
                  selectedVariant?.price_mosquitero > 0 || 
                  selectedVariant?.price_reja > 0) && (
                  <div className="space-y-4">
                    <label className="text-sm font-black uppercase tracking-widest text-gray-400">
                      3. Adicionales Opcionales
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { id: 'guia', label: 'Guía', price: selectedVariant.price_guia },
                        { id: 'cortina', label: 'Cortina', price: selectedVariant.price_cortina },
                        { id: 'postigo', label: 'Postigo', price: selectedVariant.price_postigo },
                        { id: 'mosquitero', label: 'Mosquitero', price: selectedVariant.price_mosquitero },
                        { id: 'reja', label: 'Reja', price: selectedVariant.price_reja },
                      ].filter(opt => opt.price > 0).map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setSelectedOptionals(prev => ({ ...prev, [opt.id]: !prev[opt.id] }))}
                          className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${
                            selectedOptionals[opt.id]
                              ? 'border-primary bg-primary/5 ring-4 ring-primary/5'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-colors ${
                              selectedOptionals[opt.id] ? 'bg-primary border-primary text-white' : 'border-gray-300 bg-white'
                            }`}>
                              {selectedOptionals[opt.id] && <Check size={20} strokeWidth={4} />}
                            </div>
                            <div className="text-left">
                              <span className={`text-lg font-bold block ${selectedOptionals[opt.id] ? 'text-secondary' : 'text-gray-700'}`}>
                                {opt.label}
                              </span>
                              <span className="text-lg font-black text-green-700">
                                + {formatPrice(opt.price)}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Final Price Section */}
              <div className="mt-12 mb-8 p-8 bg-gray-50 rounded-3xl border-2 border-gray-100 flex flex-col items-center justify-center text-center">
                <span className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Precio Final:</span>
                <div className="flex flex-col items-center">
                  <span className="text-5xl md:text-6xl font-black text-secondary leading-none">
                    {formatPrice(calculatedPrice)}
                  </span>
                  {selectedVariant?.sale_price > 0 && calculatedPrice === selectedVariant.price && (
                    <span className="text-xl text-gray-400 line-through font-bold mt-2">
                      {formatPrice(selectedVariant.price)}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-4 mb-12">
                <Button 
                  className="h-20 gap-4 text-xl w-full shadow-xl shadow-primary/20" 
                  onClick={handleAddToCart}
                >
                  <ShoppingCart size={28} />
                  Añadir al Pedido
                </Button>
                <a 
                  href={`https://wa.me/${siteConfig.whatsappNumber}?text=¡Hola! Quería consultar sobre la ${product.name} en medida ${selectedVariant?.size}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full"
                >
                  <Button variant="outline" className="w-full h-16 gap-3 text-lg border-green-500 text-green-600 hover:bg-green-500 hover:text-white">
                    <MessageCircle size={24} />
                    Consultar por WhatsApp
                  </Button>
                </a>
              </div>

            </div>
          </div>

          {/* Detailed Info - EXPOSICIÓN TOTAL */}
          <div className="mt-20 space-y-16">
            {/* Beneficios */}
            {product.benefits?.length > 0 && (
              <section className="bg-white p-10 rounded-[2.5rem] border-2 border-gray-100 shadow-sm">
                <h3 className="text-2xl font-black text-secondary mb-8 uppercase tracking-tight flex items-center gap-3">
                  <div className="w-2 h-8 bg-primary rounded-full"></div>
                  Beneficios del Producto
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {product.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-4 text-gray-800 text-lg font-medium leading-relaxed bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
                        <Check size={18} strokeWidth={3} />
                      </div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Ideal Para */}
            {product.ideal_for?.length > 0 && (
              <section className="bg-secondary p-10 rounded-[2.5rem] text-white shadow-xl">
                <h3 className="text-2xl font-black mb-8 uppercase tracking-tight flex items-center gap-3">
                  <div className="w-2 h-8 bg-primary rounded-full"></div>
                  Ideal Para
                </h3>
                <div className="flex flex-wrap gap-4">
                  {product.ideal_for.map((item, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl text-xl font-bold border border-white/10">
                      {item}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Especificaciones y Accesorios */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <section className="bg-white p-10 rounded-[2.5rem] border-2 border-gray-100 shadow-sm">
                <h3 className="text-2xl font-black text-secondary mb-8 uppercase tracking-tight flex items-center gap-3">
                  <div className="w-2 h-8 bg-primary rounded-full"></div>
                  Especificaciones Técnicas
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-5 border-b-2 border-gray-50">
                    <span className="text-gray-500 font-bold text-lg uppercase tracking-wider">Material</span>
                    <span className="font-black text-secondary text-lg">{product.material}</span>
                  </div>
                  <div className="flex justify-between items-center py-5 border-b-2 border-gray-50">
                    <span className="text-gray-500 font-bold text-lg uppercase tracking-wider">Color Principal</span>
                    <span className="font-black text-secondary text-lg">{product.color}</span>
                  </div>
                  <div className="flex justify-between items-center py-5 border-b-2 border-gray-50">
                    <span className="text-gray-500 font-bold text-lg uppercase tracking-wider">Línea de Diseño</span>
                    <span className="font-black text-secondary text-lg">{product.line_type}</span>
                  </div>
                  <div className="flex justify-between items-center py-5 border-b-2 border-gray-50">
                    <span className="text-gray-500 font-bold text-lg uppercase tracking-wider">Tipo de Vidrio</span>
                    <span className="font-black text-secondary text-lg">{product.glass}</span>
                  </div>
                </div>
              </section>

              <section className="bg-white p-10 rounded-[2.5rem] border-2 border-gray-100 shadow-sm">
                <h3 className="text-2xl font-black text-secondary mb-8 uppercase tracking-tight flex items-center gap-3">
                  <div className="w-2 h-8 bg-primary rounded-full"></div>
                  Accesorios Incluidos
                </h3>
                <ul className="grid grid-cols-1 gap-4">
                  {product.accessories?.map((acc, i) => (
                    <li key={i} className="flex items-center gap-4 text-gray-800 text-lg font-bold bg-gray-50 p-5 rounded-2xl border border-gray-100">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                        <Check size={20} strokeWidth={3} />
                      </div>
                      {acc}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            
            <div className="lg:col-span-1 space-y-6">
               <div className="bg-secondary p-10 rounded-[2.5rem] text-white space-y-6">
                  <h4 className="text-xl font-black uppercase tracking-tight">¿Dudas Técnicas?</h4>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Nuestros expertos pueden asesorarte sobre las medidas ideales para tu obra y los sistemas de instalación.
                  </p>
                  <Button variant="primary" className="w-full gap-2">
                     <MessageCircle size={18} />
                     Hablar con experto
                  </Button>
               </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default ProductPage;