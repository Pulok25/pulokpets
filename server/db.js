import fs from 'fs';
import path from 'path';

const dbPath = path.resolve('./server/inventory.json');
const chatPath = path.resolve('./server/chat.json');

// Initial data structure
const initialData = {
  categories: [],
  subcategories: [],
  types: []
};

let inventory = null;
let chatThreads = null;

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

const loadChat = () => {
  try {
    if (fs.existsSync(chatPath)) {
      const chatData = fs.readFileSync(chatPath, 'utf-8');
      chatThreads = JSON.parse(chatData).threads || [];
    } else {
      chatThreads = [];
      saveChat();
    }
  } catch (error) {
    console.error('Error loading chat data:', error);
    chatThreads = [];
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

const saveChat = () => {
  try {
    fs.writeFileSync(chatPath, JSON.stringify({ threads: chatThreads }, null, 2));
  } catch (error) {
    console.error('Error saving chat data:', error);
  }
};

const addChatThread = ({ customerName, customerEmail, text }) => {
  const id = Math.max(...chatThreads.map(t => t.id), 0) + 1;
  const thread = {
    id,
    customerName,
    customerEmail,
    createdAt: new Date().toISOString(),
    messages: [
      {
        id: 1,
        sender: 'customer',
        text,
        createdAt: new Date().toISOString()
      }
    ]
  };
  chatThreads.push(thread);
  saveChat();
  return thread;
};

const addCustomerMessage = ({ threadId, text }) => {
  const thread = chatThreads.find(t => t.id === threadId);
  if (!thread) return null;
  const messageId = Math.max(...thread.messages.map(m => m.id), 0) + 1;
  thread.messages.push({ id: messageId, sender: 'customer', text, createdAt: new Date().toISOString() });
  saveChat();
  return thread;
};

const addAdminReply = ({ threadId, text }) => {
  const thread = chatThreads.find(t => t.id === threadId);
  if (!thread) return null;
  const messageId = Math.max(...thread.messages.map(m => m.id), 0) + 1;
  thread.messages.push({ id: messageId, sender: 'admin', text, createdAt: new Date().toISOString() });
  saveChat();
  return thread;
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
loadChat();

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

  getChatThreads: () => {
    return chatThreads;
  },

  addChatThread: ({ customerName, customerEmail, text }) => {
    return addChatThread({ customerName, customerEmail, text });
  },

  addCustomerMessage: ({ threadId, text }) => {
    return addCustomerMessage({ threadId, text });
  },

  addAdminReply: ({ threadId, text }) => {
    return addAdminReply({ threadId, text });
  },

  deleteAllCategories: () => {
    inventory.categories = [];
    inventory.subcategories = [];
    inventory.types = [];
    saveInventory();
    return true;
  }
};
