/**
 * ============================================
 * ARCHIVO MOCK — DATOS FICTICIOS
 * ============================================
 * Este archivo contiene datos de prueba para desarrollo.
 * EN PRODUCCIÓN: Reemplazar por consultas a Supabase.
 * Ver documentación en walkthrough.md para la migración.
 * ============================================
 */

export const categories = [
  {
    id: 'cat-1',
    name: 'Ventanas',
    slug: 'ventanas',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop',
    subcategories: [
      { id: 'sub-1', name: 'Aluminio', slug: 'ventanas-aluminio' },
      { id: 'sub-2', name: 'PVC', slug: 'ventanas-pvc' },
      { id: 'sub-3', name: 'Madera', slug: 'ventanas-madera' },
    ],
  },
  {
    id: 'cat-2',
    name: 'Puertas',
    slug: 'puertas',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop',
    subcategories: [
      { id: 'sub-4', name: 'Chapa Inyectada', slug: 'puertas-chapa-inyectada' },
      { id: 'sub-5', name: 'Madera', slug: 'puertas-madera' },
      { id: 'sub-6', name: 'Aluminio', slug: 'puertas-aluminio' },
    ],
  },
  {
    id: 'cat-3',
    name: 'Portones',
    slug: 'portones',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop',
    subcategories: [
      { id: 'sub-7', name: 'Levadizos', slug: 'portones-levadizos' },
      { id: 'sub-8', name: 'Corredizos', slug: 'portones-corredizos' },
    ],
  },
  {
    id: 'cat-4',
    name: 'Placards',
    slug: 'placards',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop',
    subcategories: [
      { id: 'sub-9', name: 'Melamina', slug: 'placards-melamina' },
      { id: 'sub-10', name: 'Madera', slug: 'placards-madera' },
    ],
  },
  {
    id: 'cat-5',
    name: 'Rejas',
    slug: 'rejas',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop',
    subcategories: [
      { id: 'sub-11', name: 'Fijas', slug: 'rejas-fijas' },
      { id: 'sub-12', name: 'Rebatibles', slug: 'rejas-rebatibles' },
    ],
  },
  {
    id: 'cat-6',
    name: 'Mosquiteros',
    slug: 'mosquiteros',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop',
    subcategories: [
      { id: 'sub-13', name: 'De enrollar', slug: 'mosquiteros-enrollar' },
      { id: 'sub-14', name: 'Fijos', slug: 'mosquiteros-fijos' },
    ],
  },
];
