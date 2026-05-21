import { NextRequest, NextResponse } from 'next/server';
const pool = require('@/database/connection');

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const categoryId = searchParams.get('category');

    let query = `
      SELECT 
        p.id, p.name, p.description, p.price, p.stock_quantity,
        p.image_url, p.status, p.created_at,
        c.id as category_id, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'active'
    `;
    const params: any[] = [];

    if (categoryId) {
      query += ` AND p.category_id = $${params.length + 1}`;
      params.push(parseInt(categoryId));
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
