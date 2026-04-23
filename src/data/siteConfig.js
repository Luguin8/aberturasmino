/**
 * ============================================
 * ARCHIVO MOCK — CONFIGURACIÓN DEL SITIO
 * ============================================
 * Datos globales del sitio: contacto, redes, textos.
 * EN PRODUCCIÓN: Reemplazar por consultas a Supabase
 * o una tabla de "settings" en la base de datos.
 * ============================================
 */

export const siteConfig = {
  // Datos del negocio
  businessName: 'Aberturas Miño',
  businessSubtitle: 'ESQUINA · CORRIENTES',
  
  // Contacto
  whatsappNumber: '+5493777817571',
  whatsappDisplay: '+54 9 3777 81-7571',
  phone: '+5493777817571',
  email: 'info@aberturasmiño.com.ar',
  
  // Dirección
  address: 'Esquina, Corrientes, Argentina',
  mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3520.0!2d-59.52!3d-30.01!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAwJzM2LjAiUyA1OcKwMzEnMTIuMCJX!5e0!3m2!1ses!2sar!4v1',
  
  // Redes sociales
  instagram: 'https://instagram.com/aberturasmiño',
  facebook: 'https://facebook.com/aberturasmiño',
  
  // Textos del top bar
  topBarText: 'Envío gratis a todo el país en productos seleccionados',
  
  // Horarios
  schedule: 'Lunes a Viernes: 8:00 - 12:00 y 16:00 - 20:00 | Sábados: 8:00 - 12:00',
};
