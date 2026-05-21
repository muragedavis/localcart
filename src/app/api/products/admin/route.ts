import { NextRequest, NextResponse } from 'next/server';
const pool = require('@/database/connection');
import { withAdminAuth } from '@/lib/middleware';

async function handlePOST(req: NextRequest, user: any) {
  try {
    const { name, description, category_id, price, stock_quantity, image_url } = await req.json();

    if (!name || !price) {
      return NextResponse.json(
        { success: false, error: 'Name and price are required' },
        { status: 400 }
      );
    }

    const result = await pool.query(`
      INSERT INTO products (name, description, category_id, price, stock_quantity, image_url, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'active')
      RETURNING *
    `, [name, description, category_id || null, price, stock_quantity || 0, image_url || null]);

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, handlePOST);
}
