import { NextRequest, NextResponse } from 'next/server';
const pool = require('@/database/connection');
import { withAuth } from '@/lib/middleware';

async function handleGET(req: NextRequest, user: any) {
  try {
    const result = await pool.query(`
      SELECT 
        ci.id, ci.product_id, p.name as product_name, p.price,
        ci.quantity, ci.created_at
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = (SELECT id FROM cart WHERE user_id = $1)
      ORDER BY ci.created_at DESC
    `, [user.userId]);

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handlePOST(req: NextRequest, user: any) {
  try {
    const { product_id, quantity } = await req.json();

    if (!product_id || !quantity) {
      return NextResponse.json(
        { success: false, error: 'Product ID and quantity required' },
        { status: 400 }
      );
    }

    // Get or create user's cart
    const cartResult = await pool.query(
      'INSERT INTO cart (user_id) VALUES ($1) ON CONFLICT (user_id) DO UPDATE SET user_id = EXCLUDED.user_id RETURNING id',
      [user.userId]
    );

    const cartId = cartResult.rows[0].id;

    // Check if item already in cart
    const existingItem = await pool.query(
      'SELECT id FROM cart_items WHERE cart_id = $1 AND product_id = $2',
      [cartId, product_id]
    );

    let result;
    if (existingItem.rows.length > 0) {
      // Update quantity
      result = await pool.query(`
        UPDATE cart_items 
        SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id, product_id, quantity
      `, [quantity, existingItem.rows[0].id]);
    } else {
      // Add new item
      result = await pool.query(`
        INSERT INTO cart_items (cart_id, product_id, quantity)
        VALUES ($1, $2, $3)
        RETURNING id, product_id, quantity
      `, [cartId, product_id, quantity]);
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return withAuth(req, handleGET);
}

export async function POST(req: NextRequest) {
  return withAuth(req, handlePOST);
}
