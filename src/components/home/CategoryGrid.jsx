// src/components/home/CategoryGrid.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, DoorClosed, Sofa, ArrowRight } from 'lucide-react';
import Container from '../ui/Container';

const categories = [
  {
    id: '6ec021b8-c3c7-4be2-a822-b02019a9c52b',
    name: 'Ventanas',
    icon: <LayoutGrid size={40} />,
    color: 'bg-blue-50 text-blue-600',
    desc: 'Aluminio y PVC de alta calidad'
  },
  {
    id: '9abab4ac-c816-458c-9f5a-cfbb18aa0cae',
    name: 'Puertas',
    icon: <DoorClosed size={40} />,
    color: 'bg-orange-50 text-orange-600',
    desc: 'Seguridad y diseño para tu hogar'
  },
  {
    id: 'muebles-proximamente',
    name: 'Muebles',
    icon: <Sofa size={40} />,
    color: 'bg-purple-50 text-purple-600',
    desc: 'Próximamente: Amoblamientos'
  },
];

const CategoryGrid = () => {
  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-secondary uppercase italic">
            Explorá por <span className="text-primary underline">Categoría</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/categoria/${cat.id}`}
              className="group relative bg-gray-50 rounded-[2.5rem] p-10 flex flex-col items-center text-center transition-all hover:bg-white hover:shadow-2xl hover:shadow-gray-200 border-2 border-transparent hover:border-primary/10"
            >
              <div className={`w-24 h-24 ${cat.color} rounded-3xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                {cat.icon}
              </div>
              <h3 className="text-2xl font-black text-secondary mb-2">{cat.name}</h3>
              <p className="text-gray-500 font-medium mb-6">{cat.desc}</p>
              <div className="flex items-center gap-2 text-primary font-black text-sm uppercase">
                Ver productos <ArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default CategoryGrid;