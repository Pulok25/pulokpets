import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`Inventory API running on http://localhost:${PORT}`);
});
