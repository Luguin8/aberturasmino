import React from 'react';

const Container = ({ 
  children, 
  className = '',
  as: Component = 'div'
}) => {
  return (
    <Component className={`max-w-[1280px] mx-auto px-4 md:px-6 ${className}`}>
      {children}
    </Component>
  );
};

export default Container;
