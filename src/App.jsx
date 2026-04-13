import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedProducts from './components/FeaturedProducts';
import Categories from './components/Categories';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import { AdminProvider } from './context/AdminContext';

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [currentView, setCurrentView] = useState('store');

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <AdminProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar cartCount={cartCount} setView={setCurrentView} currentView={currentView} />
        <main className="flex-grow">
          {currentView === 'store' ? (
            <>
              <Hero />
              <FeaturedProducts onAddToCart={handleAddToCart} />
              <Categories onAddToCart={handleAddToCart} />
            </>
          ) : (
            <AdminDashboard />
          )}
        </main>
        <Footer />
      </div>
    </AdminProvider>
  );
}

export default App;
