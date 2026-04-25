import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useCart } from '../context/CartContext';
import { siteConfig } from '../data/siteConfig';
import { MessageCircle, ArrowLeft } from 'lucide-react';

const CheckoutPage = () => {
    const { cart, cartTotal } = useCart();
    const navigate = useNavigate();

    // Estados para guardar los datos del cliente
    const [formData, setFormData] = useState({
        nombre: '',
        localidad: '',
        telefono: '',
        comentarios: ''
    });

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleWhatsAppCheckout = (e) => {
        e.preventDefault(); // Evita que la página se recargue al enviar el formulario

        // Armamos el mensaje final combinando los datos del formulario y el carrito
        const message = `¡Hola, gente de Aberturas Miño! 👋\n` +
            `Mi nombre es *${formData.nombre}* y quisiera confirmar el siguiente presupuesto:\n\n` +
            `*📍 Mis datos:*\n` +
            `- Localidad/Envío: ${formData.localidad}\n` +
            `- Teléfono: ${formData.telefono}\n` +
            `- Notas: ${formData.comentarios || 'Sin comentarios extra'}\n\n` +
            `*🛒 Mi Pedido:*\n` +
            cart.map(item => `- ${item.name} (Cantidad: ${item.quantity}) - ${formatPrice(item.salePrice * item.quantity)}`).join('\n') +
            `\n\n*💰 Total estimado: ${formatPrice(cartTotal)}*` +
            `\n\nEspero su respuesta, ¡gracias!`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${siteConfig.whatsappNumber}?text=${encodedMessage}`, '_blank');
    };

    // Si el carrito está vacío, no mostramos el formulario
    if (cart.length === 0) {
        return (
            <Layout>
                <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>
                    <h2>No hay aberturas en tu pedido</h2>
                    <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>Volver al inicio</button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container" style={{ padding: '40px 0' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '20px' }}>
                    <ArrowLeft size={18} /> Volver
                </button>

                <h1 style={{ marginBottom: '30px' }}>Completá tus datos para el presupuesto</h1>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                    {/* Columna Izquierda: Formulario */}
                    <div>
                        <form onSubmit={handleWhatsAppCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Nombre y Apellido *</label>
                                <input required type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Localidad / Dirección de obra *</label>
                                <input required type="text" name="localidad" value={formData.localidad} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Teléfono de contacto *</label>
                                <input required type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Consultas adicionales o detalles</label>
                                <textarea name="comentarios" value={formData.comentarios} onChange={handleInputChange} rows="3" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', padding: '15px', fontSize: '16px' }}>
                                <MessageCircle size={20} />
                                Enviar Presupuesto por WhatsApp
                            </button>
                        </form>
                    </div>

                    {/* Columna Derecha: Resumen del Pedido */}
                    <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', height: 'fit-content' }}>
                        <h3 style={{ marginBottom: '20px' }}>Resumen de tu pedido</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {cart.map((item) => (
                                <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                                    <span>{item.quantity}x {item.name}</span>
                                    <span style={{ fontWeight: 'bold' }}>{formatPrice(item.salePrice * item.quantity)}</span>
                                </li>
                            ))}
                        </ul>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontSize: '18px', fontWeight: '900' }}>
                            <span>Total Estimado:</span>
                            <span>{formatPrice(cartTotal)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CheckoutPage;