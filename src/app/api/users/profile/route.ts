import { NextRequest, NextResponse } from 'next/server';
const pool = require('@/database/connection');
import { withAuth } from '@/lib/middleware';

async function handleGET(req: NextRequest, user: any) {
  try {
    const result = await pool.query(
      'SELECT id, full_name, email, phone, role, created_at FROM users WHERE id = $1',
      [user.userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handlePUT(req: NextRequest, user: any) {
  try {
    const { full_name, phone } = await req.json();

    const result = await pool.query(
      'UPDATE users SET full_name = $1, phone = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, full_name, email, phone, role',
      [full_name, phone, user.userId]
    );

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return withAuth(req, handleGET);
}

export async function PUT(req: NextRequest) {
  return withAuth(req, handlePUT);
}
