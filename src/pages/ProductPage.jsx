import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { supabase } from '../config/supabase';
import { Check, ChevronRight, ShoppingCart, MessageCircle, ArrowLeft, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
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
      id: selectedVariant.id,
      productId: product.id,
      name: `${product.name} (${selectedVariant.size})`,
      price: selectedVariant.price,
      salePrice: selectedVariant.sale_price || selectedVariant.price,
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
      <div className="bg-gray-50 min-h-screen py-10 md:py-16">
        <Container>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-8 overflow-hidden whitespace-nowrap">
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
                <img 
                  src={product.image_url || '/placeholder.png'} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
              </div>
            </div>

            {/* Info Section */}
            <div className="flex flex-col">
              <div className="space-y-4 mb-8">
                <Badge variant="primary">{product.material}</Badge>
                <h1 className="text-4xl md:text-5xl font-black text-secondary leading-tight uppercase tracking-tight">
                  {product.name}
                </h1>
                <p className="text-gray-400 text-lg font-medium">
                  {product.model} &bull; Línea {product.line_type}
                </p>
              </div>

              {/* Price Section */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-8">
                <div className="flex items-baseline gap-4 mb-6">
                  {selectedVariant?.sale_price ? (
                    <>
                      <span className="text-4xl font-black text-primary">
                        {formatPrice(selectedVariant.sale_price)}
                      </span>
                      <span className="text-lg text-gray-300 line-through font-bold">
                        {formatPrice(selectedVariant.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-4xl font-black text-secondary">
                      {formatPrice(selectedVariant?.price)}
                    </span>
                  )}
                </div>

                {/* Variants Selection */}
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">
                    Seleccionar Medida
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.product_variants.map((v) => (
                      <button
                        key={v.id}
                        className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                          selectedVariant?.id === v.id 
                            ? 'bg-secondary text-white shadow-lg shadow-secondary/20 scale-105' 
                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedVariant(v)}
                      >
                        {v.size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                <Button 
                  className="h-16 gap-3 text-lg" 
                  onClick={handleAddToCart}
                >
                  <ShoppingCart size={24} />
                  Sumar al pedido
                </Button>
                <a 
                  href={`https://wa.me/${siteConfig.whatsappNumber}?text=¡Hola! Quería consultar sobre la ${product.name} en medida ${selectedVariant?.size}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="outline" className="w-full h-16 gap-3 text-lg border-green-500 text-green-600 hover:bg-green-500 hover:text-white">
                    <MessageCircle size={24} />
                    WhatsApp
                  </Button>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-10 border-t border-gray-200">
                <div className="flex flex-col items-center text-center gap-2">
                   <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                      <ShieldCheck size={20} />
                   </div>
                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Calidad Certificada</p>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                   <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                      <Truck size={20} />
                   </div>
                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Envío Seguro</p>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                   <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                      <RotateCcw size={20} />
                   </div>
                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Garantía Miño</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Info */}
          <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <section>
                <h3 className="text-2xl font-black text-secondary mb-8 uppercase tracking-tight">Descripción y Detalles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  <div className="flex justify-between items-center py-4 border-b border-gray-100">
                    <span className="text-gray-400 font-bold text-sm uppercase">Material</span>
                    <span className="font-bold text-secondary">{product.material}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-100">
                    <span className="text-gray-400 font-bold text-sm uppercase">Color</span>
                    <span className="font-bold text-secondary">{product.color}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-100">
                    <span className="text-gray-400 font-bold text-sm uppercase">Vidrio</span>
                    <span className="font-bold text-secondary">{product.glass}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-100">
                    <span className="text-gray-400 font-bold text-sm uppercase">Línea</span>
                    <span className="font-bold text-secondary">{product.line_type}</span>
                  </div>
                </div>
              </section>

              <section className="bg-white p-10 rounded-[2rem] border border-gray-100">
                <h3 className="text-2xl font-black text-secondary mb-8 uppercase tracking-tight">Accesorios Incluidos</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.accessories?.map((acc, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-600 font-medium bg-gray-50 p-4 rounded-xl">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Check size={14} />
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