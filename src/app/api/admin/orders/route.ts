import { NextRequest, NextResponse } from 'next/server';
const pool = require('@/database/connection');
import { withAdminAuth } from '@/lib/middleware';

async function handleGET(req: NextRequest, user: any) {
  try {
    const result = await pool.query(`
      SELECT o.id, o.total_amount, o.order_status, o.payment_status,
        o.created_at, u.email, u.full_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 50
    `);

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

async function handlePUT(req: NextRequest, user: any, orderId: number) {
  try {
    const { order_status, payment_status } = await req.json();

    const result = await pool.query(
      'UPDATE orders SET order_status = $1, payment_status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [order_status, payment_status, orderId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return withAdminAuth(req, handleGET);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return withAdminAuth(req, (req, user) => handlePUT(req, user, parseInt(params.id)));
}
