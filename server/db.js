import fs from 'fs';
import path from 'path';

const dbPath = path.resolve('./server/inventory.json');

// Initial data structure
const initialData = {
  categories: [
    {
      id: 'polar-parrot',
      title: 'Polar Parrot',
      description: 'Strikingly beautiful hybrid cichlids with vibrant body colors, peaceful temperament, and a unique rounded shape — a centerpiece for any aquarium.',
      image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      outOfStock: false,
      featured: false
    },
    {
      id: 'gourami',
      title: 'Gourami',
      description: 'Graceful labyrinth fish celebrated for their vibrant patterns and gentle personalities, ideal for planted community tanks.',
      image: 'https://images.unsplash.com/photo-1520302519878-e0e14e5b3dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      outOfStock: false,
      featured: false
    },
    {
      id: 'community',
      title: 'Community Fish',
      description: 'Peaceful, vibrant additions perfect for your mixed-species aquarium setup.',
      image: '/community.jpg',
      outOfStock: false,
      featured: false
    },
    {
      id: 'betta',
      title: 'Premium Bettas',
      description: 'Majestic centerpieces known for their breathtaking colors and flowing fins.',
      image: '/public/halfmoon.jpg',
      outOfStock: false,
      featured: false
    },
    {
      id: 'monster',
      title: 'Monster Fish',
      description: 'Bold, charismatic giants for the dedicated and experienced aquarist.',
      image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      outOfStock: false,
      featured: false
    }
  ],
  subcategories: [
    { id: 1, categoryId: 'polar-parrot', name: 'Blue Polar Parrot', description: 'A rare Blue-colored Polar Parrot Cichlid', size: '5–7 cm', price: 28.99, outOfStock: false },
    { id: 2, categoryId: 'polar-parrot', name: 'White Polar Parrot', description: 'An elegant all-white Polar Parrot Cichlid', size: '5–7 cm', price: 26.99, outOfStock: false },
    { id: 3, categoryId: 'gourami', name: 'Dwarf Gourami', description: 'A compact, brilliantly colored Gourami', size: '4–5 cm', price: 12.99, outOfStock: false },
    { id: 4, categoryId: 'gourami', name: 'Kissing Gourami', description: 'Famous for their kissing behavior', size: '12–15 cm', price: 18.99, outOfStock: false },
    { id: 5, categoryId: 'community', name: 'Guppy', description: 'Colorful and peaceful', size: '3–4 cm', price: 9.99, outOfStock: false },
    { id: 6, categoryId: 'community', name: 'Molly', description: 'Hardy and peaceful', size: '5–6 cm', price: 6.99, outOfStock: false },
    { id: 7, categoryId: 'community', name: 'Red Platty', description: 'Vibrant red-colored Platy', size: '4–6 cm', price: 6.99, outOfStock: false },
    { id: 8, categoryId: 'community', name: 'Swordtail Platty', description: 'Striking with sword-like tail', size: '5–7 cm', price: 8.99, outOfStock: false },
    { id: 9, categoryId: 'betta', name: 'Halfmoon Betta', description: 'Perfect 180-degree tail spread', size: '5–7 cm', price: 24.99, outOfStock: false },
    { id: 10, categoryId: 'betta', name: 'Full Moon Betta', description: 'Even fuller tail spread', size: '5–7 cm', price: 34.99, outOfStock: false },
    { id: 11, categoryId: 'betta', name: 'Plakat Betta', description: 'Short-finned fighting form', size: '4–6 cm', price: 19.99, outOfStock: false },
    { id: 12, categoryId: 'monster', name: 'Cichlid', description: 'Highly intelligent and territorial', size: '15–30 cm', price: 19.99, outOfStock: false },
    { id: 13, categoryId: 'monster', name: 'Oscar', description: 'Personable and intelligent fish', size: '25–35 cm', price: 22.99, outOfStock: false }
  ],
  types: [
    { id: 1, subcategoryId: 1, name: 'Dumbo Ear', description: 'Famous for oversized pectoral fins', size: '3–4 cm', price: 9.99, outOfStock: false },
    { id: 2, subcategoryId: 1, name: 'Red Moscow', description: 'Deep crimson full-body guppy', size: '3–5 cm', price: 14.99, outOfStock: false },
    { id: 3, subcategoryId: 1, name: 'Black Moscow', description: 'All-black Moscow guppy', size: '3–5 cm', price: 15.99, outOfStock: false },
    { id: 4, subcategoryId: 2, name: 'Balloon Molly', description: 'Round-bodied with balloon-like belly', size: '5–6 cm', price: 6.99, outOfStock: false },
    { id: 5, subcategoryId: 2, name: 'Marble Molly', description: 'Beautiful marble-patterned', size: '5–7 cm', price: 5.99, outOfStock: false }
  ]
};

let inventory = null;

// Load inventory from JSON
const loadInventory = () => {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf-8');
      inventory = JSON.parse(data);
    } else {
      inventory = JSON.parse(JSON.stringify(initialData));
      saveInventory();
    }
  } catch (error) {
    console.error('Error loading inventory:', error);
    inventory = JSON.parse(JSON.stringify(initialData));
  }
};

// Save inventory to JSON
const saveInventory = () => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(inventory, null, 2));
  } catch (error) {
    console.error('Error saving inventory:', error);
  }
};

// Format inventory for API response
const formatInventory = () => {
  return inventory.categories.map(cat => {
    const subs = inventory.subcategories.filter(s => s.categoryId === cat.id).map(sub => {
      const types = inventory.types.filter(t => t.subcategoryId === sub.id);
      return {
        id: sub.id,
        categoryId: sub.categoryId,
        name: sub.name,
        description: sub.description,
        size: sub.size,
        price: sub.price,
        outOfStock: sub.outOfStock,
        types: types.length > 0 ? types : []
      };
    });
    return {
      id: cat.id,
      title: cat.title,
      description: cat.description,
      image: cat.image,
      outOfStock: cat.outOfStock,
      subcategories: subs
    };
  });
};

// Initialize
loadInventory();

// Export functions
export default {
  getInventory: () => formatInventory(),

  seedInventory: () => {
    inventory = JSON.parse(JSON.stringify(initialData));
    saveInventory();
  },

  addCategory: ({ id, title, description = '', image = '' }) => {
    if (inventory.categories.find(c => c.id === id)) return false;
    inventory.categories.push({ id, title, description, image, outOfStock: false, featured: false });
    saveInventory();
    return true;
  },

  removeCategory: ({ categoryId }) => {
    const catIdx = inventory.categories.findIndex(c => c.id === categoryId);
    if (catIdx === -1) return false;
    
    inventory.categories.splice(catIdx, 1);
    inventory.subcategories = inventory.subcategories.filter(s => s.categoryId !== categoryId);
    inventory.types = inventory.types.filter(t => {
      const sub = inventory.subcategories.find(s => s.id === t.subcategoryId);
      return sub !== undefined;
    });
    saveInventory();
    return true;
  },

  addSubcategory: ({ categoryId, name, description = '', size = '', price }) => {
    if (!inventory.categories.find(c => c.id === categoryId)) return false;
    const id = Math.max(...inventory.subcategories.map(s => s.id), 0) + 1;
    inventory.subcategories.push({ id, categoryId, name, description, size, price, outOfStock: false });
    saveInventory();
    return true;
  },

  removeSubcategory: ({ categoryId, subcategoryId = null, subcategoryName = null }) => {
    let idx;
    if (subcategoryId != null) {
      idx = inventory.subcategories.findIndex(s => s.id === subcategoryId && s.categoryId === categoryId);
    } else {
      idx = inventory.subcategories.findIndex(s => s.categoryId === categoryId && s.name === subcategoryName);
    }
    if (idx === -1) return false;
    const resolvedSubcategoryId = inventory.subcategories[idx].id;

    inventory.subcategories.splice(idx, 1);
    inventory.types = inventory.types.filter(t => t.subcategoryId !== resolvedSubcategoryId);
    saveInventory();
    return true;
  },

  updateCategory: ({ categoryId, title, description = '', image = '' }) => {
    const category = inventory.categories.find(c => c.id === categoryId);
    if (!category) return false;
    category.title = title;
    category.description = description;
    category.image = image;
    saveInventory();
    return true;
  },

  addType: ({ categoryId, subcategoryName, newTypeName, price, description = '', size = '' }) => {
    const sub = inventory.subcategories.find(s => s.categoryId === categoryId && s.name === subcategoryName);
    if (!sub) return false;
    
    const id = Math.max(...inventory.types.map(t => t.id), 0) + 1;
    inventory.types.push({ id, subcategoryId: sub.id, name: newTypeName, description, size, price, outOfStock: false });
    saveInventory();
    return true;
  },

  removeType: ({ categoryId, subcategoryName, typeName }) => {
    const sub = inventory.subcategories.find(s => s.categoryId === categoryId && s.name === subcategoryName);
    if (!sub) return false;
    
    const typeIdx = inventory.types.findIndex(t => t.subcategoryId === sub.id && t.name === typeName);
    if (typeIdx === -1) return false;
    
    inventory.types.splice(typeIdx, 1);
    saveInventory();
    return true;
  },

  toggleStock: ({ categoryId, subcategoryName = null, typeName = null }) => {
    if (typeName) {
      // Toggle type stock
      const sub = inventory.subcategories.find(s => s.categoryId === categoryId && s.name === subcategoryName);
      if (!sub) return false;
      const type = inventory.types.find(t => t.subcategoryId === sub.id && t.name === typeName);
      if (!type) return false;
      type.outOfStock = !type.outOfStock;
    } else if (subcategoryName) {
      // Toggle subcategory stock
      const sub = inventory.subcategories.find(s => s.categoryId === categoryId && s.name === subcategoryName);
      if (!sub) return false;
      sub.outOfStock = !sub.outOfStock;
    } else {
      // Toggle category stock
      const cat = inventory.categories.find(c => c.id === categoryId);
      if (!cat) return false;
      cat.outOfStock = !cat.outOfStock;
    }
    saveInventory();
    return true;
  },

  toggleFeatured: ({ categoryId }) => {
    const cat = inventory.categories.find(c => c.id === categoryId);
    if (!cat) return false;
    cat.featured = !cat.featured;
    saveInventory();
    return true;
  },

  deleteAllCategories: () => {
    inventory.categories = [];
    inventory.subcategories = [];
    inventory.types = [];
    saveInventory();
    return true;
  }
};
