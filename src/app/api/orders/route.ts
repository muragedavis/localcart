import { NextRequest, NextResponse } from 'next/server';
const pool = require('@/database/connection');
import { withAuth } from '@/lib/middleware';

async function handlePOST(req: NextRequest, user: any) {
  try {
    const { items, shipping_address } = await req.json();

    if (!items || items.length === 0 || !shipping_address) {
      return NextResponse.json(
        { success: false, error: 'Items and shipping address required' },
        { status: 400 }
      );
    }

    // Calculate total
    let totalAmount = 0;
    for (const item of items) {
      const result = await pool.query(
        'SELECT price FROM products WHERE id = $1',
        [item.product_id]
      );
      if (result.rows.length > 0) {
        totalAmount += result.rows[0].price * item.quantity;
      }
    }

    // Create order
    const orderResult = await pool.query(`
      INSERT INTO orders (user_id, total_amount, shipping_address, order_status, payment_status)
      VALUES ($1, $2, $3, 'pending', 'pending')
      RETURNING id
    `, [user.userId, totalAmount, shipping_address]);

    const orderId = orderResult.rows[0].id;

    // Add order items
    for (const item of items) {
      const priceResult = await pool.query(
        'SELECT price FROM products WHERE id = $1',
        [item.product_id]
      );
      const unitPrice = priceResult.rows[0].price;

      await pool.query(`
        INSERT INTO order_items (order_id, product_id, quantity, unit_price)
        VALUES ($1, $2, $3, $4)
      `, [orderId, item.product_id, item.quantity, unitPrice]);

      // Update stock
      await pool.query(
        'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    // Clear cart
    const cartResult = await pool.query(
      'SELECT id FROM cart WHERE user_id = $1',
      [user.userId]
    );
    if (cartResult.rows.length > 0) {
      await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cartResult.rows[0].id]);
    }

    return NextResponse.json(
      {
        success: true,
        data: { orderId, totalAmount },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleGET(req: NextRequest, user: any) {
  try {
    const result = await pool.query(`
      SELECT 
        o.id, o.total_amount, o.order_status, o.payment_status,
        o.created_at, COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [user.userId]);

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return withAuth(req, handlePOST);
}

export async function GET(req: NextRequest) {
  return withAuth(req, handleGET);
}
