import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dbPath = path.resolve('./server/database.sqlite3');
const shouldSeed = !fs.existsSync(dbPath);
const db = new Database(dbPath);

const createSchema = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      image TEXT
    );

    CREATE TABLE IF NOT EXISTS subcategories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      categoryId TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      size TEXT,
      price REAL,
      outOfStock INTEGER DEFAULT 0,
      FOREIGN KEY(categoryId) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subcategoryId INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      size TEXT,
      price REAL,
      outOfStock INTEGER DEFAULT 0,
      FOREIGN KEY(subcategoryId) REFERENCES subcategories(id)
    );
  `);
};

const INITIAL_DATA = [
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
      {
        name: 'Guppy',
        types: [
          { name: 'Dumbo Ear', description: 'Famous for oversized pectoral fins resembling elephant ears.', size: '3–4 cm', price: 9.99 },
          { name: 'Red Moscow', description: 'A deep crimson full-body guppy with stunning metallic sheen.', size: '3–5 cm', price: 14.99 },
          { name: 'Black Moscow', description: 'An all-black Moscow guppy with a velvety iridescent body.', size: '3–5 cm', price: 15.99 }
        ]
      },
      {
        name: 'Molly',
        types: [
          { name: 'Balloon Molly', description: 'Round-bodied Molly with a distinctive balloon-like belly shape.', size: '5–6 cm', price: 6.99 },
          { name: 'Marble Molly', description: 'Beautiful marble-patterned Molly with contrasting black and white patches.', size: '5–7 cm', price: 5.99 }
        ]
      },
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

const seedInventory = () => {
  const insertCategory = db.prepare(`INSERT OR REPLACE INTO categories (id, title, description, image) VALUES (@id, @title, @description, @image)`);
  const insertSubcategory = db.prepare(`INSERT INTO subcategories (categoryId, name, description, size, price, outOfStock) VALUES (@categoryId, @name, @description, @size, @price, @outOfStock)`);
  const insertType = db.prepare(`INSERT INTO types (subcategoryId, name, description, size, price, outOfStock) VALUES (@subcategoryId, @name, @description, @size, @price, @outOfStock)`);

  const clearSubcategories = db.prepare(`DELETE FROM subcategories`);
  const clearTypes = db.prepare(`DELETE FROM types`);
  const clearCategories = db.prepare(`DELETE FROM categories`);

  db.transaction(() => {
    clearTypes.run();
    clearSubcategories.run();
    clearCategories.run();

    INITIAL_DATA.forEach(category => {
      insertCategory.run({
        id: category.id,
        title: category.title,
        description: category.description,
        image: category.image
      });

      category.subcategories.forEach(sub => {
        const info = insertSubcategory.run({
          categoryId: category.id,
          name: sub.name,
          description: sub.description || '',
          size: sub.size || '',
          price: sub.price || 0,
          outOfStock: sub.outOfStock ? 1 : 0
        });

        if (sub.types && sub.types.length > 0) {
          sub.types.forEach(type => {
            insertType.run({
              subcategoryId: info.lastInsertRowid,
              name: type.name,
              description: type.description || '',
              size: type.size || '',
              price: type.price || 0,
              outOfStock: type.outOfStock ? 1 : 0
            });
          });
        }
      });
    });
  })();
};

const getInventory = () => {
  const categories = db.prepare(`SELECT id, title, description, image FROM categories ORDER BY title`).all();
  const subcategories = db.prepare(`SELECT id, categoryId, name, description, size, price, outOfStock FROM subcategories ORDER BY id`).all();
  const types = db.prepare(`SELECT id, subcategoryId, name, description, size, price, outOfStock FROM types ORDER BY id`).all();

  return categories.map(category => ({
    ...category,
    subcategories: subcategories
      .filter(sub => sub.categoryId === category.id)
      .map(sub => ({
        ...sub,
        outOfStock: Boolean(sub.outOfStock),
        types: types
          .filter(type => type.subcategoryId === sub.id)
          .map(type => ({
            ...type,
            outOfStock: Boolean(type.outOfStock)
          }))
      }))
  }));
};

const findSubcategoryId = (categoryId, subcategoryName) => {
  const subcategory = db.prepare(`SELECT id FROM subcategories WHERE categoryId = ? AND name = ? LIMIT 1`).get(categoryId, subcategoryName);
  return subcategory?.id ?? null;
};

const findType = (subcategoryId, typeName) => {
  return db.prepare(`SELECT id, outOfStock FROM types WHERE subcategoryId = ? AND name = ? LIMIT 1`).get(subcategoryId, typeName);
};

const addType = ({ categoryId, subcategoryName, newTypeName, price, description, size }) => {
  const subcategoryId = findSubcategoryId(categoryId, subcategoryName);
  if (!subcategoryId) return false;

  db.prepare(`INSERT INTO types (subcategoryId, name, description, size, price, outOfStock) VALUES (?, ?, ?, ?, ?, 0)`).run(
    subcategoryId,
    newTypeName,
    description || '',
    size || '',
    parseFloat(price) || 0
  );
  return true;
};

const removeType = ({ categoryId, subcategoryName, typeName }) => {
  const subcategoryId = findSubcategoryId(categoryId, subcategoryName);
  if (!subcategoryId) return false;

  db.prepare(`DELETE FROM types WHERE subcategoryId = ? AND name = ?`).run(subcategoryId, typeName);
  return true;
};

const toggleStock = ({ categoryId, subcategoryName, typeName }) => {
  const subcategoryId = findSubcategoryId(categoryId, subcategoryName);
  if (!subcategoryId) return false;

  if (!typeName) {
    const sub = db.prepare(`SELECT id, outOfStock FROM subcategories WHERE id = ?`).get(subcategoryId);
    if (!sub) return false;
    db.prepare(`UPDATE subcategories SET outOfStock = ? WHERE id = ?`).run(sub.outOfStock ? 0 : 1, subcategoryId);
    return true;
  }

  const type = findType(subcategoryId, typeName);
  if (!type) return false;
  db.prepare(`UPDATE types SET outOfStock = ? WHERE id = ?`).run(type.outOfStock ? 0 : 1, type.id);
  return true;
};

createSchema();
if (shouldSeed) {
  seedInventory();
}

export default {
  getInventory,
  seedInventory,
  addType,
  removeType,
  toggleStock
};
