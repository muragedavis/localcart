// Helper file for common database queries
const pool = require('./connection');

// User queries
const getUser = async (userId) => {
  const result = await pool.query('SELECT id, full_name, email, role, phone, created_at FROM users WHERE id = $1', [userId]);
  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

// Product queries
const getProducts = async (limit = 20, offset = 0, category = null) => {
  let query = 'SELECT * FROM products WHERE status = $1';
  const params = ['active'];
  
  if (category) {
    query += ' AND category_id = $2';
    params.push(category);
  }
  
  query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
  params.push(limit, offset);
  
  const result = await pool.query(query, params);
  return result.rows;
};

const getProductById = async (productId) => {
  const result = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);
  return result.rows[0];
};

// Order queries
const getOrdersByUser = async (userId) => {
  const result = await pool.query(`
    SELECT o.*, 
           COALESCE(json_agg(
             json_build_object(
               'id', oi.id,
               'product_id', oi.product_id,
               'product_name', p.name,
               'quantity', oi.quantity,
               'unit_price', oi.unit_price
             )
           ) FILTER (WHERE oi.id IS NOT NULL), '[]') as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = $1
    GROUP BY o.id
    ORDER BY o.created_at DESC;
  `, [userId]);
  return result.rows;
};

const getOrderById = async (orderId) => {
  const result = await pool.query(`
    SELECT o.*, 
           COALESCE(json_agg(
             json_build_object(
               'id', oi.id,
               'product_id', oi.product_id,
               'product_name', p.name,
               'quantity', oi.quantity,
               'unit_price', oi.unit_price
             )
           ) FILTER (WHERE oi.id IS NOT NULL), '[]') as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.id = $1
    GROUP BY o.id;
  `, [orderId]);
  return result.rows[0];
};

module.exports = {
  pool,
  getUser,
  getUserByEmail,
  getProducts,
  getProductById,
  getOrdersByUser,
  getOrderById,
};
