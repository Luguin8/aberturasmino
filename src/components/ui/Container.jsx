// src/components/ui/Container.jsx
import React from 'react';

const Container = ({
  children,
  className = '',
  as: Component = 'div'
}) => {
  return (
    <Component className={`w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </Component>
  );
};

export default Container;