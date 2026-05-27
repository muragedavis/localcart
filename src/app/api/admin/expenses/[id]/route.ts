import { NextRequest, NextResponse } from 'next/server';
const pool = require('@/database/connection');
import { withAdminAuth } from '@/lib/middleware';

async function handleDELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ success: false, error: 'Invalid id' }, { status: 400 });
  }
  const result = await pool.query('DELETE FROM expenses WHERE id = $1 RETURNING id', [id]);
  if (result.rowCount === 0) {
    return NextResponse.json({ success: false, error: 'Expense not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}

async function handlePUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ success: false, error: 'Invalid id' }, { status: 400 });
  }
  const { supplier_name, description, amount, category, expense_date, notes } = await req.json();
  if (!supplier_name || !amount) {
    return NextResponse.json({ success: false, error: 'Supplier name and amount are required' }, { status: 400 });
  }
  const result = await pool.query(`
    UPDATE expenses
    SET supplier_name=$1, description=$2, amount=$3, category=$4, expense_date=$5, notes=$6
    WHERE id=$7
    RETURNING *
  `, [
    supplier_name.trim(),
    description?.trim() || null,
    parseFloat(amount),
    category || 'other',
    expense_date || new Date().toISOString().split('T')[0],
    notes?.trim() || null,
    id,
  ]);
  if (result.rowCount === 0) {
    return NextResponse.json({ success: false, error: 'Expense not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: result.rows[0] });
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  return withAdminAuth(req, () => handleDELETE(req, context));
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  return withAdminAuth(req, () => handlePUT(req, context));
}
