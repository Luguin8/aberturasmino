// src/components/ui/Container.jsx
import React from 'react';

const Container = ({
  children,
  className = '',
  as: Component = 'div',
  fluid = false,
  clean = false
}) => {
  return (
    <Component 
      className={`
        w-full 
        ${fluid ? '' : 'max-w-[1400px] mx-auto'} 
        ${clean ? '' : 'px-4 sm:px-6 lg:px-8'} 
        ${className}
      `}
    >
      {children}
    </Component>
  );
};

export default Container;