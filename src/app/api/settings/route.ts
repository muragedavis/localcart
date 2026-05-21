import { NextResponse } from 'next/server';
const pool = require('@/database/connection');

export async function GET() {
  try {
    const result = await pool.query('SELECT key, value FROM site_settings');
    const settings: Record<string, string> = {};
    for (const row of result.rows) {
      settings[row.key] = row.value;
    }
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load settings' }, { status: 500 });
  }
}
