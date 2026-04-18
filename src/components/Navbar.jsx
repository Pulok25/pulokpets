import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Search, Fish, User } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import LoginModal from './LoginModal';

const Navbar = ({ cartCount, setView, currentView }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isAdminLoggedIn, logout } = useAdmin();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('store')}>
            <div className="bg-gradient-to-tr from-aquatic-600 to-aquatic-400 p-2 rounded-xl text-white">
              <Fish size={24} />
            </div>
            <span className={`text-2xl font-bold tracking-tight ${isScrolled ? 'text-slate-900' : 'text-white drop-shadow-md'}`}>
              Pulok<span className="text-aquatic-500">Pets</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" onClick={() => setView('store')} className={`font-medium transition-colors hover:text-aquatic-500 ${isScrolled ? 'text-slate-600' : 'text-white/90 hover:text-white'}`}>Home</a>
            <a href="#categories" onClick={() => setView('store')} className={`font-medium transition-colors hover:text-aquatic-500 ${isScrolled ? 'text-slate-600' : 'text-white/90 hover:text-white'}`}>Shop Fish</a>
            <a href="#about" onClick={() => setView('store')} className={`font-medium transition-colors hover:text-aquatic-500 ${isScrolled ? 'text-slate-600' : 'text-white/90 hover:text-white'}`}>About Us</a>
            <a href="#faq" onClick={() => setView('store')} className={`font-medium transition-colors hover:text-aquatic-500 ${isScrolled ? 'text-slate-600' : 'text-white/90 hover:text-white'}`}>FAQ</a>
            <a href="#contact" onClick={() => setView('store')} className={`font-medium transition-colors hover:text-aquatic-500 ${isScrolled ? 'text-slate-600' : 'text-white/90 hover:text-white'}`}>Contact</a>
            {isAdminLoggedIn ? (
              <button 
                onClick={() => setView('admin')} 
                className={`font-bold transition-colors border-b-2 ${currentView === 'admin' ? 'border-aquatic-500 text-aquatic-500' : 'border-transparent hover:text-aquatic-500'} ${isScrolled && currentView !== 'admin' ? 'text-slate-600' : (currentView !== 'admin' ? 'text-white/90 hover:text-white' : '')}`}
              >
                Dashboard
              </button>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className={`font-medium transition-colors hover:text-aquatic-500 ${isScrolled ? 'text-slate-600' : 'text-white/90 hover:text-white'}`}
              >
                Admin Login
              </button>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button className={`p-2 rounded-full transition-colors ${isScrolled ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-white/20 text-white'}`} aria-label="Search">
              <Search size={20} />
            </button>
            <button 
              onClick={() => isAdminLoggedIn ? logout() : setIsLoginModalOpen(true)}
              className={`p-2 rounded-full transition-colors flex items-center gap-2 ${isScrolled ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-white/20 text-white'}`} 
              aria-label="Admin"
              title={isAdminLoggedIn ? "Logout" : "Admin Login"}
            >
              <User size={20} />
            </button>
            <button className={`p-2 rounded-full transition-colors relative ${isScrolled ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-white/20 text-white'}`} aria-label="Cart">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold flex items-center justify-center text-white border border-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <button 
              onClick={() => isAdminLoggedIn ? logout() : setIsLoginModalOpen(true)}
              className={`p-2 rounded-full transition-colors ${isScrolled ? 'text-slate-900 hover:bg-slate-100' : 'text-white hover:bg-white/20'}`} 
              aria-label="Admin"
            >
              <User size={24} />
            </button>
            <button className={`p-2 rounded-full transition-colors relative ${isScrolled ? 'text-slate-900 hover:bg-slate-100' : 'text-white hover:bg-white/20'}`} aria-label="Cart">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold flex items-center justify-center text-white border border-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-md ${isScrolled ? 'text-slate-900' : 'text-white'}`}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-xl absolute top-full left-0 w-full rounded-b-2xl border-t border-slate-100">
          <div className="px-4 py-6 flex flex-col space-y-4">
            <a href="#home" className="text-slate-600 hover:text-aquatic-600 font-medium px-2 py-1" onClick={() => { setIsMenuOpen(false); setView('store'); }}>Home</a>
            <a href="#categories" className="text-slate-600 hover:text-aquatic-600 font-medium px-2 py-1" onClick={() => { setIsMenuOpen(false); setView('store'); }}>Shop Fish</a>
            <a href="#about" className="text-slate-600 hover:text-aquatic-600 font-medium px-2 py-1" onClick={() => { setIsMenuOpen(false); setView('store'); }}>About Us</a>
            <a href="#faq" className="text-slate-600 hover:text-aquatic-600 font-medium px-2 py-1" onClick={() => { setIsMenuOpen(false); setView('store'); }}>FAQ</a>
            <a href="#contact" className="text-slate-600 hover:text-aquatic-600 font-medium px-2 py-1" onClick={() => { setIsMenuOpen(false); setView('store'); }}>Contact</a>
            {isAdminLoggedIn ? (
              <button className="text-slate-600 hover:text-aquatic-600 font-medium px-2 py-1 text-left" onClick={() => { setIsMenuOpen(false); setView('admin'); }}>Dashboard</button>
            ) : (
              <button className="text-slate-600 hover:text-aquatic-600 font-medium px-2 py-1 text-left" onClick={() => { setIsMenuOpen(false); setIsLoginModalOpen(true); }}>Admin Login</button>
            )}
          </div>
        </div>
      )}

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLoginSuccess={() => setView('admin')} />
    </nav>
  );
};

export default Navbar;
