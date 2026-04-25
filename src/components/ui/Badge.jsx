import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default', 
  className = '' 
}) => {
  const baseStyles = 'px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider';
  
  const variants = {
    default: 'bg-gray-100 text-gray-600',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-orange-100 text-orange-700',
    offer: 'bg-primary text-white shadow-sm',
    featured: 'bg-secondary text-white shadow-sm',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
