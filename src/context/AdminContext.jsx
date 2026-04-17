import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

const initialCategoriesData = [
  {
    id: 'polar-parrot',
    title: 'Polar Parrot',
    description: 'Strikingly beautiful hybrid cichlids with vibrant body colors, peaceful temperament, and a unique rounded shape — a centerpiece for any aquarium.',
    image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    subcategories: [
      {
        name: 'Blue Polar Parrot',
        types: [],
        description: 'A rare Blue-colored Polar Parrot Cichlid with a calm temperament and eye-catching metallic sheen.',
        size: '5–7 cm',
        price: 28.99
      },
      {
        name: 'White Polar Parrot',
        types: [],
        description: 'An elegant all-white Polar Parrot Cichlid with a peaceful nature, perfect as a community centrepiece.',
        size: '5–7 cm',
        price: 26.99
      }
    ]
  },
  {
    id: 'gourami',
    title: 'Gourami',
    description: 'Graceful labyrinth fish celebrated for their vibrant patterns and gentle personalities, ideal for planted community tanks.',
    image: 'https://images.unsplash.com/photo-1520302519878-e0e14e5b3dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    subcategories: [
      {
        name: 'Dwarf Gourami',
        types: [],
        description: 'A compact, brilliantly colored Gourami that thrives in smaller aquariums and peaceful community setups.',
        size: '4–5 cm',
        price: 12.99
      },
      {
        name: 'Kissing Gourami',
        types: [],
        description: 'Famous for their "kissing" behavior, these large and robust Gouramis make a bold addition to any spacious tank.',
        size: '12–15 cm',
        price: 18.99
      }
    ]
  },
  {
    id: 'community',
    title: 'Community Fish',
    description: 'Peaceful, vibrant additions perfect for your mixed-species aquarium setup.',
    image: '/community.jpg',
    subcategories: [
      { name: 'Guppy', types: [
        { name: 'Dumbo Ear', description: 'Famous for oversized pectoral fins resembling elephant ears.', size: '3–4 cm', price: 9.99 },
        { name: 'Red Moscow', description: 'A deep crimson full-body guppy with stunning metallic sheen.', size: '3–5 cm', price: 14.99 },
        { name: 'Black Moscow', description: 'An all-black Moscow guppy with a velvety iridescent body.', size: '3–5 cm', price: 15.99 }
      ] },
      { name: 'Molly', types: [
        { name: 'Balloon Molly', description: 'Round-bodied Molly with a distinctive balloon-like belly shape.', size: '5–6 cm', price: 6.99 },
        { name: 'Marble Molly', description: 'Beautiful marble-patterned Molly with contrasting black and white patches.', size: '5–7 cm', price: 5.99 }
      ] },
      {
        name: 'Red Platty',
        types: [],
        description: 'A vibrant red-colored Platy, hardy and perfect for beginners and community tanks alike.',
        size: '4–6 cm',
        price: 6.99
      },
      {
        name: 'Swordtail Platty',
        types: [],
        description: 'A striking Platy variety featuring an elongated sword-like tail extension — active and easy to keep.',
        size: '5–7 cm',
        price: 8.99
      }
    ]
  },
  {
    id: 'betta',
    title: 'Premium Bettas',
    description: 'Majestic centerpieces known for their breathtaking colors and flowing fins.',
    image: '/public/halfmoon.jpg',
    subcategories: [
      {
        name: 'Halfmoon Betta',
        types: [],
        description: 'A prized Betta variety whose caudal fin spreads to a perfect 180-degree half-moon shape with vivid coloration.',
        size: '5–7 cm',
        price: 24.99
      },
      {
        name: 'Full Moon Betta',
        types: [],
        description: 'An extraordinary Betta with an even fuller tail spread beyond 180 degrees, creating a breathtaking circular fan display.',
        size: '5–7 cm',
        price: 34.99
      },
      {
        name: 'Plakat Betta',
        types: [],
        description: 'The short-finned fighting form of Betta, compact and powerful with intense colors and an aggressive, athletic build.',
        size: '4–6 cm',
        price: 19.99
      }
    ]
  },
  {
    id: 'monster',
    title: 'Monster Fish',
    description: 'Bold, charismatic giants for the dedicated and experienced aquarist.',
    image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    subcategories: [
      {
        name: 'Cichlid',
        types: [],
        description: 'Highly intelligent and territorial fish with vivid coloration, popular among advanced hobbyists.',
        size: '15–30 cm',
        price: 19.99
      },
      {
        name: 'Oscar',
        types: [],
        description: 'A personable and intelligent fish that recognizes its owner — the "dog of the aquarium world".',
        size: '25–35 cm',
        price: 22.99
      }
    ]
  }
];

export const AdminProvider = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    const saved = localStorage.getItem('isAdminLoggedIn');
    return saved === 'true';
  });

  const [inventory, setInventory] = useState(initialCategoriesData);

  const loadInventory = async () => {
    try {
      const response = await fetch('/api/inventory');
      if (!response.ok) throw new Error('Failed to fetch inventory');
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error('Failed to load inventory from database:', error);
      setInventory(initialCategoriesData);
    }
  };

  useEffect(() => {
    localStorage.setItem('isAdminLoggedIn', isAdminLoggedIn);
  }, [isAdminLoggedIn]);

  useEffect(() => {
    loadInventory();
  }, []);

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

  const resetInventory = async () => {
    try {
      const response = await fetch('/api/inventory/reset', { method: 'POST' });
      if (!response.ok) throw new Error('Reset failed');
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error('Reset failed:', error);
      setInventory(initialCategoriesData);
    }
  };

  const addFishType = async (categoryId, subcategoryName, newTypeName, price, description = '', size = '') => {
    try {
      const response = await fetch('/api/inventory/type', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId, subcategoryName, newTypeName, price, description, size })
      });
      if (!response.ok) throw new Error('Add fish type failed');
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error('Add fish type failed:', error);
    }
  };

  const removeFishType = async (categoryId, subcategoryName, typeName) => {
    try {
      const response = await fetch('/api/inventory/type', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId, subcategoryName, typeName })
      });
      if (!response.ok) throw new Error('Remove fish type failed');
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error('Remove fish type failed:', error);
    }
  };

  const toggleStock = async (categoryId, subcategoryName, typeName) => {
    try {
      const response = await fetch('/api/inventory/stock', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId, subcategoryName, typeName })
      });
      if (!response.ok) throw new Error('Toggle stock failed');
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error('Toggle stock failed:', error);
    }
  };

  return (
    <AdminContext.Provider value={{
      isAdminLoggedIn,
      login,
      logout,
      inventory,
      addFishType,
      removeFishType,
      toggleStock,
      resetInventory
    }}>
      {children}
    </AdminContext.Provider>
  );
};
