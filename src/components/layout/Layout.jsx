import React, { useState } from 'react';
import TopBar from './TopBar';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from '../ui/WhatsAppButton';
import CartDrawer from '../cart/CartDrawer';
import { useCart } from '../../context/CartContext';

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setIsCartOpen, cartCount } = useCart();

  return (
    <div className="app-wrapper">
      <TopBar />
      <Header 
        onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        onCartClick={() => setIsCartOpen(true)}
        cartCount={cartCount}
      />
      <Navbar isOpen={isMobileMenuOpen} />
      
      <main className="main-content">
        {children}
      </main>

      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </div>
  );
};

export default Layout;
