const pool = require('./connection');

const schema = `
-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  image_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart Table
CREATE TABLE IF NOT EXISTS cart (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Cart Items Table
CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  cart_id INTEGER REFERENCES cart(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10, 2) NOT NULL,
  order_status VARCHAR(50) DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  shipping_address TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  payment_method VARCHAR(50) NOT NULL,
  transaction_reference VARCHAR(255) UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Site Settings Table (key-value store for UI customization)
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed default settings
INSERT INTO site_settings (key, value) VALUES
  -- Branding
  ('site_name', 'LocalCart'),
  ('site_tagline', 'Lightweight, fast, and easy online shopping'),
  ('primary_color', '#3B82F6'),
  ('secondary_color', '#10B981'),
  ('accent_color', '#F59E0B'),
  ('logo_url', ''),
  ('favicon_url', ''),
  ('banner_url', ''),
  -- Currency
  ('currency_symbol', '$'),
  ('currency_code', 'USD'),
  ('currency_position', 'before'),
  -- Store Info
  ('store_address', ''),
  ('store_phone', ''),
  ('store_email', ''),
  ('social_facebook', ''),
  ('social_twitter', ''),
  ('social_instagram', ''),
  -- Announcement Bar
  ('announcement_enabled', 'false'),
  ('announcement_text', 'Free shipping on orders over $50!'),
  ('announcement_bg', '#1F2937'),
  ('announcement_color', '#FFFFFF'),
  -- Navigation
  ('nav_links', '[{"label":"Home","href":"/"},{"label":"Shop","href":"/shop"}]'),
  -- Hero Section
  ('hero_title', 'Welcome to LocalCart'),
  ('hero_subtitle', 'Lightweight, fast, and easy online shopping'),
  ('hero_cta_text', 'Start Shopping'),
  -- Features Section
  ('features_enabled', 'true'),
  ('features_title', 'Why Choose Us?'),
  ('features_subtitle', 'Everything you need for a seamless shopping experience.'),
  ('features_items', '[{"icon":"⚡","title":"Lightning Fast","desc":"Optimized for speed and performance on any device"},{"icon":"🔒","title":"Secure & Trusted","desc":"Your data is protected with modern security practices"},{"icon":"📱","title":"Mobile Friendly","desc":"Shop anywhere, anytime on any device"}]'),
  -- Stats Section
  ('stats_enabled', 'true'),
  ('stats_items', '[{"value":"10K+","label":"Products"},{"value":"5K+","label":"Happy Customers"},{"value":"99%","label":"Satisfaction Rate"},{"value":"24/7","label":"Support"}]'),
  -- CTA Section
  ('cta_enabled', 'true'),
  ('cta_title', 'Ready to Start Shopping?'),
  ('cta_subtitle', 'Browse our collection of quality products and find what you need.'),
  ('cta_button_text', 'View All Products'),
  -- Footer
  ('footer_about', 'A lightweight e-commerce platform for local businesses.'),
  ('footer_copyright', '© 2024 LocalCart Commerce. All rights reserved.'),
  ('footer_shop_links', '[{"label":"Products","href":"/shop"},{"label":"Categories","href":"/shop"},{"label":"New Arrivals","href":"/shop"}]'),
  ('footer_support_links', '[{"label":"Contact","href":"#"},{"label":"FAQ","href":"#"},{"label":"Shipping","href":"#"}]'),
  ('footer_legal_links', '[{"label":"Privacy","href":"#"},{"label":"Terms","href":"#"},{"label":"Cookies","href":"#"}]')
ON CONFLICT (key) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items(cart_id);
`;

async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    await pool.query(schema);
    console.log('✓ Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();
