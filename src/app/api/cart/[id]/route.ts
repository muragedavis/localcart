import { NextRequest, NextResponse } from 'next/server';
const pool = require('@/database/connection');
import { withAuth } from '@/lib/middleware';

async function handleDELETE(req: NextRequest, user: any) {
  try {
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('id');

    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'Item ID required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'DELETE FROM cart_items WHERE id = $1 AND cart_id = (SELECT id FROM cart WHERE user_id = $2)',
      [itemId, user.userId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete cart item error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  return withAuth(req, handleDELETE);
}
