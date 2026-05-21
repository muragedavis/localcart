import { NextRequest, NextResponse } from 'next/server';
const pool = require('@/database/connection');
import { generateToken, hashPassword, comparePassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password, full_name } = await req.json();

    if (!email || !password || !full_name) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, role',
      [email, hashedPassword, full_name, 'customer']
    );

    const user = result.rows[0];
    const token = generateToken(user.id, user.email, user.role);

    // Create empty cart for user
    await pool.query('INSERT INTO cart (user_id) VALUES ($1)', [user.id]);

    return NextResponse.json(
      {
        success: true,
        data: {
          userId: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          token,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
