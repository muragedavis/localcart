import { NextRequest, NextResponse } from 'next/server';
const pool = require('@/database/connection');
import { withAdminAuth } from '@/lib/middleware';

async function handlePUT(req: NextRequest, _user: any, id: number) {
  const { name, description, category_id, price, stock_quantity, image_url, status } = await req.json();

  if (!name || !price) {
    return NextResponse.json({ success: false, error: 'Name and price are required' }, { status: 400 });
  }

  const result = await pool.query(
    `UPDATE products SET name=$1, description=$2, category_id=$3, price=$4,
     stock_quantity=$5, image_url=$6, status=$7, updated_at=NOW()
     WHERE id=$8 RETURNING *`,
    [name, description || '', category_id || null, price, stock_quantity ?? 0, image_url || null, status || 'active', id]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: result.rows[0] });
}

async function handleDELETE(_req: NextRequest, _user: any, id: number) {
  const result = await pool.query('DELETE FROM products WHERE id=$1 RETURNING id', [id]);
  if (result.rows.length === 0) {
    return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: 'Product deleted' });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return withAdminAuth(req, (r, u) => handlePUT(r, u, parseInt(params.id)));
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return withAdminAuth(req, (r, u) => handleDELETE(r, u, parseInt(params.id)));
}
