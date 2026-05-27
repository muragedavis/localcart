import { NextRequest, NextResponse } from 'next/server';
const pool = require('@/database/connection');
import { withAdminAuth } from '@/lib/middleware';

const INIT_TABLE = `
  CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    supplier_name VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) DEFAULT 'other'
      CHECK (category IN ('product_cost', 'shipping', 'packaging', 'marketing', 'other')),
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
`;

async function ensureTable() {
  await pool.query(INIT_TABLE);
}

async function handleGET(req: NextRequest) {
  await ensureTable();
  const { searchParams } = new URL(req.url);
  const month  = searchParams.get('month');   // e.g. "2026-05"
  const limit  = parseInt(searchParams.get('limit') || '50');

  let query = `
    SELECT id, supplier_name, description, amount, category,
           expense_date, notes, created_at
    FROM expenses
  `;
  const params: any[] = [];

  if (month) {
    query += ` WHERE to_char(expense_date, 'YYYY-MM') = $1`;
    params.push(month);
  }

  query += ` ORDER BY expense_date DESC, created_at DESC LIMIT $${params.length + 1}`;
  params.push(limit);

  const [rowsResult, totalsResult] = await Promise.all([
    pool.query(query, params),
    pool.query(`
      SELECT
        COALESCE(SUM(amount), 0)                                         AS total_all_time,
        COALESCE(SUM(CASE WHEN to_char(expense_date,'YYYY-MM') = to_char(CURRENT_DATE,'YYYY-MM') THEN amount END), 0) AS total_this_month,
        COALESCE(SUM(CASE WHEN expense_date >= CURRENT_DATE - INTERVAL '30 days' THEN amount END), 0)                 AS total_last_30_days
      FROM expenses
    `),
  ]);

  return NextResponse.json({
    success: true,
    data: rowsResult.rows,
    totals: totalsResult.rows[0],
  });
}

async function handlePOST(req: NextRequest) {
  await ensureTable();
  const { supplier_name, description, amount, category, expense_date, notes } = await req.json();

  if (!supplier_name || !amount) {
    return NextResponse.json({ success: false, error: 'Supplier name and amount are required' }, { status: 400 });
  }
  if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
    return NextResponse.json({ success: false, error: 'Amount must be a positive number' }, { status: 400 });
  }

  const result = await pool.query(`
    INSERT INTO expenses (supplier_name, description, amount, category, expense_date, notes)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `, [
    supplier_name.trim(),
    description?.trim() || null,
    parseFloat(amount),
    category || 'other',
    expense_date || new Date().toISOString().split('T')[0],
    notes?.trim() || null,
  ]);

  return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
}

export async function GET(req: NextRequest) {
  return withAdminAuth(req, () => handleGET(req));
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, () => handlePOST(req));
}
