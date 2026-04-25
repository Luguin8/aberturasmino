import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-300 rounded-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover shadow-lg hover:shadow-primary/30',
    secondary: 'bg-secondary text-white hover:bg-secondary-hover shadow-lg hover:shadow-secondary/30',
    outline: 'border-2 border-gray-200 text-secondary hover:border-primary hover:text-primary',
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-secondary',
    success: 'bg-green-500 text-white hover:bg-green-600 shadow-lg hover:shadow-green-500/30',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    icon: 'p-2',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
