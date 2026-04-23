/**
 * ============================================
 * ARCHIVO MOCK — MEDIOS DE PAGO
 * ============================================
 * EN PRODUCCIÓN: Reemplazar por consultas a Supabase.
 * ============================================
 */

export const paymentMethods = [
  {
    id: 'pay-1',
    title: 'Transferencia Bancaria',
    description: 'Obtené un 20% de descuento pagando por transferencia o depósito bancario.',
    discount: '20% OFF',
    icon: 'banknote',
    details: 'El descuento se aplica automáticamente al seleccionar este medio de pago. Una vez realizada la transferencia, enviar comprobante por WhatsApp para confirmar el pedido.',
  },
  {
    id: 'pay-2',
    title: 'Tarjetas de Crédito',
    description: 'Hasta 12 cuotas sin interés con todas las tarjetas de crédito.',
    discount: 'Hasta 12 cuotas',
    icon: 'credit-card',
    details: 'Aceptamos Visa, Mastercard, American Express y Cabal. Las cuotas sin interés aplican en compras mayores a $50.000.',
  },
  {
    id: 'pay-3',
    title: 'Tarjeta Naranja',
    description: 'Hasta 10 cuotas con Tarjeta Naranja.',
    discount: '10 cuotas',
    icon: 'credit-card',
    details: 'Plan exclusivo con Tarjeta Naranja. Consultá las cuotas disponibles para tu compra.',
  },
  {
    id: 'pay-4',
    title: 'Go Cuotas',
    description: '4 cuotas con Go Cuotas, sin tarjeta de crédito.',
    discount: '4 cuotas',
    icon: 'smartphone',
    details: 'Pagá en 4 cuotas quincenales sin tarjeta de crédito. Solo necesitás tu DNI.',
  },
  {
    id: 'pay-5',
    title: 'Efectivo',
    description: 'Pagá en efectivo en nuestro local con 15% de descuento.',
    discount: '15% OFF',
    icon: 'wallet',
    details: 'Descuento especial para pagos en efectivo en nuestro showroom de Esquina, Corrientes.',
  },
];
