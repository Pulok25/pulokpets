import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedProducts from './components/FeaturedProducts';
import Categories from './components/Categories';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import { AdminProvider, useAdmin } from './context/AdminContext';

function AppContent() {
  const [cartCount, setCartCount] = useState(0);
  const [currentView, setCurrentView] = useState('store');
  const { isAdminLoggedIn } = useAdmin();

  // Redirect to store if admin logs out while on dashboard
  useEffect(() => {
    if (!isAdminLoggedIn && currentView === 'admin') {
      setCurrentView('store');
    }
  }, [isAdminLoggedIn, currentView]);

  const handleSetView = (view) => {
    // Block non-admins from accessing the admin view
    if (view === 'admin' && !isAdminLoggedIn) return;
    setCurrentView(view);
  };

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar cartCount={cartCount} setView={handleSetView} currentView={currentView} />
      <main className="flex-grow">
        {currentView === 'admin' && isAdminLoggedIn ? (
          <AdminDashboard />
        ) : (
          <>
            <Hero />
            <FeaturedProducts onAddToCart={handleAddToCart} />
            <Categories onAddToCart={handleAddToCart} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AdminProvider>
      <AppContent />
    </AdminProvider>
  );
}

export default App;
