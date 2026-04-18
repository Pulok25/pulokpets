import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { X } from 'lucide-react';

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const { login } = useAdmin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      setUsername('');
      setPassword('');
      setError('');
      onClose();
      if (onLoginSuccess) onLoginSuccess();
    } else {
      setError('Invalid admin credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/50 backdrop-blur-sm">
      <div className="min-h-screen flex items-center justify-center py-10 px-4 sm:py-16">
        <div className="bg-white rounded-2xl w-full max-w-md sm:max-w-lg mx-auto p-8 relative shadow-2xl overflow-hidden max-h-[calc(100vh-3rem)]">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-slate-900">Admin Login</h3>
          <p className="text-slate-500 mt-2">Sign in to manage inventory.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm font-medium mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1" htmlFor="username">Username</label>
            <input 
              id="username"
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-aquatic-500 focus:ring-2 focus:ring-aquatic-500/20 outline-none transition-all"
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1" htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-aquatic-500 focus:ring-2 focus:ring-aquatic-500/20 outline-none transition-all"
              placeholder="Enter password"
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-aquatic-600 transition-colors mt-4"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  </div>
  );
};

export default LoginModal;
