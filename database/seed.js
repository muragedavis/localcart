const pool = require('./connection');
const bcrypt = require('bcryptjs');

const seed = async () => {
  try {
    console.log('Seeding database...');

    // Create categories
    const categoryRes = await pool.query(`
      INSERT INTO categories (name, slug, description) VALUES
      ('Electronics', 'electronics', 'Electronic devices and gadgets'),
      ('Clothing', 'clothing', 'Fashion and apparel'),
      ('Home & Garden', 'home-garden', 'Home and garden products'),
      ('Sports', 'sports', 'Sports and outdoor equipment')
      ON CONFLICT DO NOTHING
      RETURNING id;
    `);

    // Get category IDs
    const categories = await pool.query('SELECT id FROM categories LIMIT 4');
    const categoryIds = categories.rows.map(c => c.id);

    // Create admin user
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'ChangeMe123!', 10);
    await pool.query(`
      INSERT INTO users (full_name, email, password_hash, role) VALUES
      ('Admin User', $1, $2, 'admin')
      ON CONFLICT (email) DO NOTHING;
    `, [process.env.ADMIN_EMAIL || 'admin@localcart.com', adminPassword]);

    // Create sample products
    const products = [
      { name: 'Wireless Headphones', price: 79.99, stock: 50, category: categoryIds[0] },
      { name: 'USB-C Cable', price: 12.99, stock: 200, category: categoryIds[0] },
      { name: 'Summer T-Shirt', price: 24.99, stock: 100, category: categoryIds[1] },
      { name: 'Denim Jeans', price: 69.99, stock: 75, category: categoryIds[1] },
      { name: 'LED Desk Lamp', price: 34.99, stock: 30, category: categoryIds[2] },
      { name: 'Yoga Mat', price: 29.99, stock: 40, category: categoryIds[3] },
    ];

    for (const product of products) {
      await pool.query(`
        INSERT INTO products (name, description, category_id, price, stock_quantity, status)
        VALUES ($1, $2, $3, $4, $5, 'active')
        ON CONFLICT DO NOTHING;
      `, [
        product.name,
        `High-quality ${product.name.toLowerCase()}`,
        product.category,
        product.price,
        product.stock,
      ]);
    }

    console.log('✓ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
