import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, CreditCard, Banknote, MessageCircle, ArrowLeft, Trash2, CheckCircle2, ShieldCheck, ChevronRight, User, IdCard, Truck, Store } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { siteConfig } from '../data/siteConfig';
import { supabase } from '../config/supabase';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Container from '../components/ui/Container';

const CheckoutPage = () => {
  const { cart, cartTotal, removeFromCart, clearCart } = useCart();
  const [selectedPayment, setSelectedPayment] = useState('option1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [buyerData, setBuyerData] = useState({
    nombre: '',
    dni: '',
    metodoEnvio: 'retiro'
  });
  const [showErrors, setShowErrors] = useState(false);
  const navigate = useNavigate();

  const paymentOptions = [
    { 
      id: 'option1', 
      name: 'Transferencia Bancaria', 
      description: 'Aboná mediante CBU/Alias y obtené el máximo beneficio.', 
      modifier: 0.8,
      badge: '20% OFF',
      icon: Banknote,
      color: 'green'
    },
    { 
      id: 'option2', 
      name: 'Efectivo / Débito', 
      description: 'Precio de lista abonando en nuestro local o al recibir.', 
      modifier: 1.0,
      badge: 'Lista',
      icon: CreditCard,
      color: 'blue'
    },
    { 
      id: 'option3', 
      name: 'Tarjeta de Crédito', 
      description: '3 cuotas fijas (15% de recargo administrativo).', 
      modifier: 1.15,
      badge: '+15%',
      icon: CreditCard,
      color: 'orange'
    }
  ];

  const currentOption = paymentOptions.find(opt => opt.id === selectedPayment);
  const finalTotal = cartTotal * currentOption.modifier;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price || 0);
  };

  const handleConfirmOrder = async () => {
    if (cart.length === 0) return;
    
    // PASO 2 y 3: CÁLCULO SEGURO (RECALCULATION)
    // Recalculamos el total internamente para mitigar inyecciones de precios desde el estado global
    const secureTotal = cart.reduce((acc, item) => acc + ((item.salePrice || item.price) * (item.quantity || 1)), 0);
    const finalSecureTotal = secureTotal * currentOption.modifier;

    if (!buyerData.nombre || !buyerData.dni) {
      setShowErrors(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customer_name: buyerData.nombre,
        customer_dni: buyerData.dni,
        delivery_method: buyerData.metodoEnvio,
        items: cart,
        total: finalSecureTotal, // PASO 4: Inserción segura usando finalSecureTotal
        status: 'Pendiente'
      };

      const { error } = await supabase.from('orders').insert([orderData]);
      
      if (error) {
        console.error('Error saving order:', error);
        toast.error("Error al procesar el pedido");
        return;
      }

      const message = `*Datos del Comprador*\n` +
        `*Nombre:* ${buyerData.nombre}\n` +
        `*DNI:* ${buyerData.dni}\n` +
        `*Método de entrega:* ${buyerData.metodoEnvio === 'retiro' ? 'Retiro en local' : 'Envío a domicilio'}\n` +
        `------------------------\n\n` +
        `¡Hola! 👋 Quisiera confirmar el siguiente pedido:\n\n` +
        cart.map(item => `- ${item.name} (${item.selectedOptionsSummary}) (x${item.quantity})`).join('\n') +
        `\n\n*Método de Pago:* ${currentOption.name}` +
        `\n*Total a Pagar:* ${formatPrice(finalSecureTotal)}` +
        `\n\nQuedo atento a la confirmación, ¡gracias!`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodedMessage}`;
      
      clearCart();
      window.open(whatsappUrl, '_blank');
      navigate('/success');
    } catch (err) {
      console.error(err);
      toast.error("Error al procesar el pedido");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <Container className="py-40 flex flex-col items-center justify-center text-center space-y-8">
        <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
          <ShoppingBag size={64} />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-secondary uppercase tracking-tight">Tu pedido está vacío</h1>
          <p className="text-gray-400 font-medium max-w-md mx-auto">Parece que aún no has agregado ninguna abertura a tu presupuesto personalizado.</p>
        </div>
        <Link to="/">
          <Button variant="primary" className="h-14 px-10">
             Explorar Catálogo
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <>
      <div className="bg-gray-50 min-h-screen py-4 md:py-6">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-black text-secondary uppercase tracking-tight leading-none">
                Finalizar <span className="text-primary">Pedido</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
               <span>Carrito</span>
               <ChevronRight size={12} />
               <span className="text-secondary">Pago</span>
               <ChevronRight size={12} />
               <span>Éxito</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Side: Order Details & Payment */}
            <div className="lg:col-span-8 space-y-10">
              {/* Buyer Data Section */}
              <section className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                  <h2 className="text-lg font-black text-secondary uppercase tracking-tight flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <User size={16} />
                    </div>
                    Datos del Comprador
                  </h2>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="nombre" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                        Nombre y Apellido
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          <User size={18} />
                        </div>
                        <input
                          id="nombre"
                          type="text"
                          placeholder="Ej: Juan Pérez"
                          className={`w-full h-12 rounded-xl pl-12 pr-4 focus:outline-none focus:ring-2 transition-all font-medium ${
                            showErrors && !buyerData.nombre 
                              ? 'border-red-500 bg-red-50 focus:ring-red-500/20 focus:border-red-500 text-red-700' 
                              : 'bg-gray-50 border border-gray-100 focus:ring-primary/20 focus:border-primary text-secondary'
                          }`}
                          value={buyerData.nombre}
                          onChange={(e) => setBuyerData({ ...buyerData, nombre: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="dni" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                        DNI
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          <IdCard size={18} />
                        </div>
                        <input
                          id="dni"
                          type="text"
                          placeholder="Ej: 12.345.678"
                          className={`w-full h-12 rounded-xl pl-12 pr-4 focus:outline-none focus:ring-2 transition-all font-medium ${
                            showErrors && !buyerData.dni 
                              ? 'border-red-500 bg-red-50 focus:ring-red-500/20 focus:border-red-500 text-red-700' 
                              : 'bg-gray-50 border border-gray-100 focus:ring-primary/20 focus:border-primary text-secondary'
                          }`}
                          value={buyerData.dni}
                          onChange={(e) => setBuyerData({ ...buyerData, dni: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                      Método de Entrega
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setBuyerData({ ...buyerData, metodoEnvio: 'retiro' })}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                          buyerData.metodoEnvio === 'retiro'
                            ? 'border-primary bg-primary/5 text-secondary ring-4 ring-primary/5'
                            : 'border-gray-50 bg-gray-50/50 text-gray-400 hover:border-gray-200'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          buyerData.metodoEnvio === 'retiro' ? 'bg-primary text-white' : 'bg-white text-gray-300'
                        }`}>
                          <Store size={20} />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-black uppercase tracking-tight">Retiro en local</p>
                          <p className="text-[10px] font-medium opacity-60">Sin costo adicional</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBuyerData({ ...buyerData, metodoEnvio: 'envio' })}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                          buyerData.metodoEnvio === 'envio'
                            ? 'border-primary bg-primary/5 text-secondary ring-4 ring-primary/5'
                            : 'border-gray-50 bg-gray-50/50 text-gray-400 hover:border-gray-200'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          buyerData.metodoEnvio === 'envio' ? 'bg-primary text-white' : 'bg-white text-gray-300'
                        }`}>
                          <Truck size={20} />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-black uppercase tracking-tight">Envío a domicilio</p>
                          <p className="text-[10px] font-medium opacity-60">Coordinar con vendedor</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Products List */}
              <section className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                  <h2 className="text-lg font-black text-secondary uppercase tracking-tight flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <ShoppingBag size={16} />
                    </div>
                    Resumen de Aberturas
                  </h2>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{cart.length} Modelos</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {cart.map((item) => (
                    <div key={item.id} className="p-4 md:p-6 flex items-center gap-6 group hover:bg-gray-50/50 transition-colors">
                      <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
                        <img src={item.image || '/placeholder.png'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-lg font-bold text-secondary leading-tight">{item.name}</h4>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors p-2"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Cantidad: {item.quantity}</p>
                        {item.selectedOptionsSummary && (
                          <p className="text-[10px] text-primary font-black uppercase tracking-tight">
                            {item.selectedOptionsSummary}
                          </p>
                        )}
                        <p className="text-xl font-black text-primary">{formatPrice((item.salePrice || item.price) * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Payment Selection */}
              <section className="space-y-4">
                 <h2 className="text-xl font-black text-secondary uppercase tracking-tight px-4">Método de Pago</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {paymentOptions.map((option) => {
                      const Icon = option.icon;
                      const isActive = selectedPayment === option.id;
                      return (
                        <label 
                          key={option.id}
                          className={`relative p-5 rounded-[1.5rem] border-2 cursor-pointer transition-all duration-300 flex flex-col gap-3 shadow-sm group ${
                            isActive 
                            ? 'border-primary bg-white ring-4 ring-primary/5' 
                            : 'border-white bg-white hover:border-gray-200'
                          }`}
                        >
                          <input 
                            type="radio" 
                            name="payment" 
                            className="sr-only" 
                            value={option.id}
                            checked={isActive}
                            onChange={(e) => setSelectedPayment(e.target.value)}
                          />
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                             isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400 group-hover:text-secondary'
                          }`}>
                             <Icon size={20} />
                          </div>
                          <div>
                            <p className="text-base font-black text-secondary uppercase tracking-tight mb-1">{option.name}</p>
                            <p className="text-xs text-gray-400 font-medium leading-relaxed">{option.description}</p>
                          </div>
                           <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center">
                             <Badge variant={option.color === 'green' ? 'success' : option.color === 'blue' ? 'primary' : 'offer'} className="scale-90 origin-left">
                                {option.badge}
                             </Badge>
                             <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                isActive ? 'border-primary' : 'border-gray-200'
                             }`}>
                                {isActive && <div className="w-3 h-3 bg-primary rounded-full animate-in zoom-in duration-300" />}
                             </div>
                          </div>
                        </label>
                      );
                    })}
                 </div>
              </section>
            </div>

            {/* Right Side: Summary Card */}
            <div className="lg:col-span-4">
              <div className="bg-secondary rounded-[2rem] p-8 text-white shadow-2xl sticky top-24 space-y-6">
                <div>
                   <h3 className="text-lg font-black uppercase tracking-tight mb-1">Resumen Total</h3>
                   <div className="w-10 h-1 bg-primary"></div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-white/60">
                    <span className="text-xs font-bold uppercase tracking-widest">Subtotal Bruto</span>
                    <span className="font-bold">{formatPrice(cartTotal)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="space-y-0.5">
                       <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Beneficio / Recargo</p>
                       <p className={`text-xs font-black uppercase ${currentOption.modifier < 1 ? 'text-green-400' : 'text-orange-400'}`}>
                          {currentOption.badge}
                       </p>
                    </div>
                    <span className={`text-base font-black ${currentOption.modifier < 1 ? 'text-green-400' : 'text-orange-400'}`}>
                       {currentOption.modifier < 1 ? '-' : '+'}{formatPrice(Math.abs(cartTotal - finalTotal))}
                    </span>
                  </div>

                  <div className="pt-6 border-t border-white/10 space-y-1 text-right">
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest block">Total Final Estimado</span>
                    <span className="text-4xl font-black text-white leading-none block">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                </div>

                 <div className="space-y-3">
                  {showErrors && (!buyerData.nombre || !buyerData.dni) && (
                    <p className="text-red-500 text-sm font-bold text-center mt-2 animate-pulse">
                      Por favor, completa los campos resaltados en rojo para continuar.
                    </p>
                  )}
                  
                  <Button 
                    variant="primary"
                    className="w-full h-14 text-base gap-3 shadow-xl shadow-primary/20"
                    onClick={handleConfirmOrder}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Procesando...</span>
                      </>
                    ) : (
                      <>
                        <MessageCircle size={22} />
                        Confirmar pedido
                      </>
                    )}
                  </Button>
                  
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl text-white/40 text-[10px] font-bold uppercase tracking-widest text-center leading-relaxed">
                    <ShieldCheck size={20} className="text-primary shrink-0" />
                    <span>Tus datos están protegidos. El pedido se procesará vía WhatsApp directamente con ventas.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default CheckoutPage;
