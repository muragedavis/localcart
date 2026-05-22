import { NextRequest, NextResponse } from 'next/server';
const pool = require('@/database/connection');
import { withAdminAuth } from '@/lib/middleware';

async function handleGET(req: NextRequest, _user: any, orderId: number) {
  try {
    const result = await pool.query(`
      SELECT o.*, u.full_name, u.email,
        COALESCE(json_agg(
          json_build_object(
            'id', oi.id,
            'product_name', p.name,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price
          ) ORDER BY oi.id
        ) FILTER (WHERE oi.id IS NOT NULL), '[]') as items
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.id = $1
      GROUP BY o.id, u.full_name, u.email
    `, [orderId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Get order detail error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

async function handlePUT(req: NextRequest, _user: any, orderId: number) {
  try {
    const { order_status, payment_status } = await req.json();

    const result = await pool.query(
      `UPDATE orders
       SET order_status = COALESCE($1, order_status),
           payment_status = COALESCE($2, payment_status),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 RETURNING *`,
      [order_status ?? null, payment_status ?? null, orderId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return withAdminAuth(req, (r, u) => handleGET(r, u, parseInt(params.id)));
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return withAdminAuth(req, (r, u) => handlePUT(r, u, parseInt(params.id)));
}
