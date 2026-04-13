import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

const initialCategoriesData = [
  {
    id: 'community',
    title: 'Community Fish',
    description: 'Peaceful, vibrant additions perfect for your mixed-species aquarium setup.',
    image: '/community.jpg',
    subcategories: [
      { name: 'Guppy', types: [
        { name: 'Dumbo Ear', price: 9.99 },
        { name: 'Red Moscow', price: 14.99 },
        { name: 'Black Moscow', price: 15.99 }
      ] },
      { name: 'Molly', types: [
        { name: 'Balloon Molly', price: 6.99 },
        { name: 'Marble Molly', price: 5.99 }
      ] },
      { name: 'Platty', types: [], price: 4.99 }
    ]
  },
  {
    id: 'betta',
    title: 'Premium Bettas',
    description: 'Majestic centerpieces known for their breathtaking colors and flowing fins.',
    image: '/public/halfmoon.jpg',
    subcategories: [
      { name: 'Half Moon', types: [], price: 24.99 },
      { name: 'Full Moon', types: [], price: 29.99 }
    ]
  },
  {
    id: 'monster',
    title: 'Monster Fish',
    description: 'Bold, charismatic giants for the dedicated and experienced aquarist.',
    image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    subcategories: [
      { name: 'Cichlid', types: [], price: 19.99 },
      { name: 'Oscar', types: [], price: 22.99 }
    ]
  }
];

export const AdminProvider = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    const saved = localStorage.getItem('isAdminLoggedIn');
    return saved === 'true';
  });

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('inventory');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse inventory from localStorage', e);
      }
    }
    return initialCategoriesData;
  });

  useEffect(() => {
    localStorage.setItem('isAdminLoggedIn', isAdminLoggedIn);
  }, [isAdminLoggedIn]);

  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);

  const login = (username, password) => {
    if (username === 'admin' && password === 'admin') {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdminLoggedIn(false);
  };

  const addFishType = (categoryId, subcategoryName, newTypeName, price) => {
    setInventory(prev => prev.map(cat => {
      if (cat.id !== categoryId) return cat;
      return {
        ...cat,
        subcategories: cat.subcategories.map(sub => {
          if (sub.name !== subcategoryName) return sub;
          // If the subcategory currently has no types, initialize it
          const currentTypes = sub.types || [];
          return {
            ...sub,
            types: [...currentTypes, { name: newTypeName, price: parseFloat(price) }]
          };
        })
      };
    }));
  };

  const removeFishType = (categoryId, subcategoryName, typeName) => {
    setInventory(prev => prev.map(cat => {
      if (cat.id !== categoryId) return cat;
      return {
        ...cat,
        subcategories: cat.subcategories.map(sub => {
          if (sub.name !== subcategoryName) return sub;
          if (!sub.types) return sub;
          return {
            ...sub,
            types: sub.types.filter(t => t.name !== typeName)
          };
        })
      };
    }));
  };

  const toggleStock = (categoryId, subcategoryName, typeName) => {
    setInventory(prev => prev.map(cat => {
      if (cat.id !== categoryId) return cat;
      return {
        ...cat,
        subcategories: cat.subcategories.map(sub => {
          if (sub.name !== subcategoryName) return sub;
          // If toggling stock on a subcategory directly (e.g. Platty)
          if (!typeName) {
             return { ...sub, outOfStock: !sub.outOfStock };
          }
          if (!sub.types) return sub;
          return {
            ...sub,
            types: sub.types.map(t => {
              if (t.name !== typeName) return t;
              return { ...t, outOfStock: !t.outOfStock };
            })
          };
        })
      };
    }));
  };

  return (
    <AdminContext.Provider value={{
      isAdminLoggedIn,
      login,
      logout,
      inventory,
      addFishType,
      removeFishType,
      toggleStock
    }}>
      {children}
    </AdminContext.Provider>
  );
};
