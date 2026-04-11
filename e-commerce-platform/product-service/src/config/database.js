const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'product_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

// Product seed data with real image URLs (Unsplash)
const seedProducts = [
  {
    id: '93d809f0-c573-4be9-9285-832ecfd31ed2',
    name: 'iPhone 15 Pro',
    description: 'Latest Apple iPhone with A17 Pro chip, titanium design, and advanced camera system',
    price: 999.99,
    category: 'Electronics',
    image_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=500&fit=crop',
    stock: 50
  },
  {
    id: 'd44252be-ad50-45d5-8678-ac202d7576eb',
    name: 'MacBook Air M3',
    description: 'Supercharged by M3 chip, fanless design, up to 18 hours battery life',
    price: 1099.99,
    category: 'Electronics',
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
    stock: 30
  },
  {
    id: 'c735deca-2a0f-42e7-90b7-e495a8aae9d4',
    name: 'AirPods Pro',
    description: 'Active Noise Cancellation, Transparency mode, Spatial Audio',
    price: 249.99,
    category: 'Electronics',
    image_url: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500&h=500&fit=crop',
    stock: 100
  },
  {
    id: '51fb72e0-9d25-4b22-8a1b-c16c29fc941a',
    name: 'Nike Air Max',
    description: 'Premium athletic shoes with Air Max cushioning and breathable mesh upper',
    price: 159.99,
    category: 'Fashion',
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    stock: 75
  },
  {
    id: 'e65582f5-8102-4039-abbf-87a7c0d2fab7',
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise cancellation with exceptional sound quality',
    price: 349.99,
    category: 'Electronics',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    stock: 40
  },
  {
    id: 'e85e2a85-4f40-4b4b-8bcc-f228980d9f6b',
    name: 'Adidas Hoodie',
    description: 'Comfortable cotton blend hoodie with classic Adidas branding',
    price: 79.99,
    category: 'Fashion',
    image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop',
    stock: 120
  }
];

async function initDatabase() {
  const connection = await pool.getConnection();
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(100),
        image_url VARCHAR(500),
        stock INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if products already exist
    const [existingProducts] = await connection.execute('SELECT COUNT(*) as count FROM products');

    // Seed products if table is empty
    if (existingProducts[0].count === 0) {
      console.log('Seeding product data...');
      for (const product of seedProducts) {
        await connection.execute(
          `INSERT INTO products (id, name, description, price, category, image_url, stock)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [product.id, product.name, product.description, product.price, product.category, product.image_url, product.stock]
        );
      }
      console.log(`Seeded ${seedProducts.length} products with real image URLs`);
    } else {
      // Update existing products with real image URLs
      console.log('Updating existing products with real image URLs...');
      for (const product of seedProducts) {
        await connection.execute(
          `UPDATE products SET image_url = ? WHERE id = ?`,
          [product.image_url, product.id]
        );
      }
      console.log('Product images updated successfully');
    }

    console.log('Product tables initialized');
  } finally {
    connection.release();
  }
}

module.exports = { pool, initDatabase };
