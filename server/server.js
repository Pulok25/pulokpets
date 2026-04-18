import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/api/inventory', (req, res) => {
  try {
    const inventory = db.getInventory();
    res.json(inventory);
  } catch (error) {
    console.error('Failed to load inventory:', error);
    res.status(500).json({ error: 'Failed to load inventory' });
  }
});

app.post('/api/inventory/reset', (req, res) => {
  try {
    db.seedInventory();
    const inventory = db.getInventory();
    res.json(inventory);
  } catch (error) {
    console.error('Failed to reset inventory:', error);
    res.status(500).json({ error: 'Failed to reset inventory' });
  }
});

app.post('/api/inventory/type', (req, res) => {
  const { categoryId, subcategoryName, newTypeName, price, description, size } = req.body;
  if (!categoryId || !subcategoryName || !newTypeName || price == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const added = db.addType({ categoryId, subcategoryName, newTypeName, price, description, size });
    if (!added) {
      return res.status(400).json({ error: 'Unable to add type to this subcategory' });
    }
    res.json(db.getInventory());
  } catch (error) {
    console.error('Failed to add type:', error);
    res.status(500).json({ error: 'Failed to add type' });
  }
});

app.post('/api/inventory/category', (req, res) => {
  const { id, title, description, image } = req.body;
  if (!id || !title) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    db.addCategory({ id, title, description, image });
    res.json(db.getInventory());
  } catch (error) {
    console.error('Failed to add category:', error);
    res.status(500).json({ error: 'Failed to add category' });
  }
});

app.patch('/api/inventory/category', (req, res) => {
  const { categoryId, title, description, image } = req.body;
  if (!categoryId || !title) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const updated = db.updateCategory({ categoryId, title, description, image });
    if (!updated) {
      return res.status(400).json({ error: 'Unable to update category' });
    }
    res.json(db.getInventory());
  } catch (error) {
    console.error('Failed to update category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

app.delete('/api/inventory/category', (req, res) => {
  const { categoryId } = req.body;
  if (!categoryId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const removed = db.removeCategory({ categoryId });
    if (!removed) {
      return res.status(400).json({ error: 'Unable to remove category' });
    }
    res.json(db.getInventory());
  } catch (error) {
    console.error('Failed to remove category:', error);
    res.status(500).json({ error: 'Failed to remove category' });
  }
});

app.post('/api/inventory/subcategory', (req, res) => {
  const { categoryId, name, description, size, price } = req.body;
  if (!categoryId || !name || price == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const added = db.addSubcategory({ categoryId, name, description, size, price });
    if (!added) {
      return res.status(400).json({ error: 'Unable to add subcategory' });
    }
    res.json(db.getInventory());
  } catch (error) {
    console.error('Failed to add subcategory:', error);
    res.status(500).json({ error: 'Failed to add subcategory' });
  }
});

app.delete('/api/inventory/subcategory', (req, res) => {
  const { categoryId, subcategoryId, subcategoryName } = req.body;
  if (!categoryId || (!subcategoryId && !subcategoryName)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const removed = db.removeSubcategory({ categoryId, subcategoryId, subcategoryName });
    if (!removed) {
      return res.status(400).json({ error: 'Unable to remove subcategory' });
    }
    res.json(db.getInventory());
  } catch (error) {
    console.error('Failed to remove subcategory:', error);
    res.status(500).json({ error: 'Failed to remove subcategory' });
  }
});

app.patch('/api/inventory/stock', (req, res) => {
  const { categoryId, subcategoryName, typeName } = req.body;
  if (!categoryId || !subcategoryName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const toggled = db.toggleStock({ categoryId, subcategoryName, typeName });
    if (!toggled) {
      return res.status(400).json({ error: 'Unable to toggle stock' });
    }
    res.json(db.getInventory());
  } catch (error) {
    console.error('Failed to toggle stock:', error);
    res.status(500).json({ error: 'Failed to toggle stock' });
  }
});

app.delete('/api/inventory/type', (req, res) => {
  const { categoryId, subcategoryName, typeName } = req.body;
  if (!categoryId || !subcategoryName || !typeName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const removed = db.removeType({ categoryId, subcategoryName, typeName });
    if (!removed) {
      return res.status(400).json({ error: 'Unable to remove type' });
    }
    res.json(db.getInventory());
  } catch (error) {
    console.error('Failed to remove type:', error);
    res.status(500).json({ error: 'Failed to remove type' });
  }
});

app.patch('/api/inventory/featured', (req, res) => {
  const { categoryId } = req.body;
  if (!categoryId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const toggled = db.toggleFeatured({ categoryId });
    if (!toggled) {
      return res.status(400).json({ error: 'Unable to toggle featured' });
    }
    res.json(db.getInventory());
  } catch (error) {
    console.error('Failed to toggle featured:', error);
    res.status(500).json({ error: 'Failed to toggle featured' });
  }
});

app.get('/api/chat/threads', (req, res) => {
  try {
    res.json(db.getChatThreads());
  } catch (error) {
    console.error('Failed to load chat threads:', error);
    res.status(500).json({ error: 'Failed to load chat threads' });
  }
});

app.post('/api/chat/message', (req, res) => {
  const { threadId, customerName, customerEmail, text } = req.body;
  if (!text || (!threadId && (!customerName || !customerEmail))) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    let thread;
    if (threadId) {
      thread = db.addCustomerMessage({ threadId, text });
    } else {
      thread = db.addChatThread({ customerName, customerEmail, text });
    }
    if (!thread) {
      return res.status(400).json({ error: 'Unable to save chat message' });
    }
    res.json(thread);
  } catch (error) {
    console.error('Failed to save chat message:', error);
    res.status(500).json({ error: 'Failed to save chat message' });
  }
});

app.post('/api/chat/reply', (req, res) => {
  const { threadId, text } = req.body;
  if (!threadId || !text) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const thread = db.addAdminReply({ threadId, text });
    if (!thread) {
      return res.status(400).json({ error: 'Unable to send reply' });
    }
    res.json(thread);
  } catch (error) {
    console.error('Failed to send reply:', error);
    res.status(500).json({ error: 'Failed to send reply' });
  }
});

app.delete('/api/inventory/all', (req, res) => {
  try {
    db.deleteAllCategories();
    res.json(db.getInventory());
  } catch (error) {
    console.error('Failed to delete all categories:', error);
    res.status(500).json({ error: 'Failed to delete all categories' });
  }
});

app.listen(PORT, () => {
  console.log(`Inventory API running on http://localhost:${PORT}`);
});
