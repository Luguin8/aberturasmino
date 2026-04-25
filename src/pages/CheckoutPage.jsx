import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, CreditCard, Banknote, MessageCircle, ArrowLeft, Trash2, CheckCircle2, ShieldCheck, ChevronRight } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useCart } from '../context/CartContext';
import { siteConfig } from '../data/siteConfig';
import { supabase } from '../config/supabase';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Container from '../components/ui/Container';

const CheckoutPage = () => {
  const { cart, cartTotal, removeFromCart, clearCart } = useCart();
  const [selectedPayment, setSelectedPayment] = useState('option1');
  const [loading, setLoading] = useState(false);
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
    setLoading(true);

    try {
      const orderData = {
        items: cart,
        total: finalTotal,
        payment_method: currentOption.name,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      const { error } = await supabase.from('orders').insert([orderData]);
      if (error) console.error('Error saving order:', error);

      const message = `¡Hola! 👋 Quisiera confirmar el siguiente pedido:\n\n` +
        cart.map(item => `- ${item.name} (x${item.quantity})`).join('\n') +
        `\n\n*Método de Pago:* ${currentOption.name}` +
        `\n*Total a Pagar:* ${formatPrice(finalTotal)}` +
        `\n\nQuedo atento a la confirmación, ¡gracias!`;

      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${siteConfig.whatsappNumber}?text=${encodedMessage}`, '_blank');
      
      clearCart();
      navigate('/success');
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error al procesar el pedido.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <Layout>
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
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-10 md:py-20">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-4">
               <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-primary transition-all uppercase tracking-widest"
              >
                <ArrowLeft size={14} />
                Volver atrás
              </button>
              <h1 className="text-4xl md:text-5xl font-black text-secondary uppercase tracking-tight leading-none">
                Finalizar <span className="text-primary">Pedido</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400 font-bold uppercase tracking-widest">
               <span>Carrito</span>
               <ChevronRight size={14} />
               <span className="text-secondary">Pago</span>
               <ChevronRight size={14} />
               <span>Éxito</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Side: Order Details & Payment */}
            <div className="lg:col-span-8 space-y-10">
              {/* Products List */}
              <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                  <h2 className="text-xl font-black text-secondary uppercase tracking-tight flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <ShoppingBag size={18} />
                    </div>
                    Resumen de Aberturas
                  </h2>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{cart.length} Modelos</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {cart.map((item) => (
                    <div key={item.id} className="p-8 flex items-center gap-6 group hover:bg-gray-50/50 transition-colors">
                      <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
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
                        <p className="text-xl font-black text-primary">{formatPrice((item.salePrice || item.price) * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Payment Selection */}
              <section className="space-y-6">
                 <h2 className="text-2xl font-black text-secondary uppercase tracking-tight px-4">Método de Pago</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {paymentOptions.map((option) => {
                      const Icon = option.icon;
                      const isActive = selectedPayment === option.id;
                      return (
                        <label 
                          key={option.id}
                          className={`relative p-8 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 flex flex-col gap-4 shadow-sm group ${
                            isActive 
                            ? 'border-primary bg-white ring-8 ring-primary/5' 
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
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                             isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400 group-hover:text-secondary'
                          }`}>
                             <Icon size={24} />
                          </div>
                          <div>
                            <p className="text-base font-black text-secondary uppercase tracking-tight mb-1">{option.name}</p>
                            <p className="text-xs text-gray-400 font-medium leading-relaxed">{option.description}</p>
                          </div>
                          <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                             <Badge variant={option.color === 'green' ? 'success' : option.color === 'blue' ? 'primary' : 'offer'}>
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
              <div className="bg-secondary rounded-[2.5rem] p-10 text-white shadow-2xl sticky top-24 space-y-8">
                <div>
                   <h3 className="text-xl font-black uppercase tracking-tight mb-2">Resumen Total</h3>
                   <div className="w-12 h-1 bg-primary"></div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-white/60">
                    <span className="text-xs font-bold uppercase tracking-widest">Subtotal Bruto</span>
                    <span className="font-bold">{formatPrice(cartTotal)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/10">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Beneficio / Recargo</p>
                       <p className={`text-sm font-black uppercase ${currentOption.modifier < 1 ? 'text-green-400' : 'text-orange-400'}`}>
                          {currentOption.badge}
                       </p>
                    </div>
                    <span className={`text-lg font-black ${currentOption.modifier < 1 ? 'text-green-400' : 'text-orange-400'}`}>
                       {currentOption.modifier < 1 ? '-' : '+'}{formatPrice(Math.abs(cartTotal - finalTotal))}
                    </span>
                  </div>

                  <div className="pt-8 border-t border-white/10 space-y-2 text-right">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block">Total Final Estimado</span>
                    <span className="text-5xl font-black text-white leading-none block">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                   <Button 
                    variant="primary"
                    className="w-full h-16 text-lg gap-3 shadow-xl shadow-primary/20"
                    onClick={handleConfirmOrder}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <MessageCircle size={24} />
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
    </Layout>
  );
};

export default CheckoutPage;
